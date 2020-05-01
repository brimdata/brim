/* @flow */
import fsExtra from "fs-extra"

import type {Dispatch, Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import ErrorFactory from "../models/ErrorFactory"
import Handlers from "../state/Handlers"
import Notice from "../state/Notice"
import Search from "../state/Search"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import brim from "../brim"
import errors from "../errors"
import ingest from "../brim/ingest"
import lib from "../lib"

export default (
  paths: string[],
  _client: *,
  gDispatch: Dispatch = globalDispatch
): Thunk => async (dispatch, getState) => {
  let client = _client || Tab.getZealot(getState())
  let clusterId = Tab.clusterId(getState())
  let tabId = Tabs.getActive(getState())
  let requestId = brim.randomHash()

  try {
    await lib.transaction([
      validateInput(paths),
      createDir(),
      createSpace(client, gDispatch, clusterId),
      registerHandler(dispatch, requestId),
      postFiles(client),
      setSpace(dispatch, tabId),
      trackProgress(client, gDispatch, clusterId),
      unregisterHandler(dispatch, requestId)
    ])
  } catch (e) {
    dispatch(Notice.set(ErrorFactory.create(e.cause)))
  }
}

const validateInput = (paths) => ({
  async do() {
    let params = await ingest.detectFileTypes(paths).then(ingest.getParams)
    if (params.error) throw new Error(params.error)
    return params
  }
})

const createDir = () => ({
  async do({dataDir}) {
    await fsExtra.ensureDir(dataDir)
  },
  async undo({dataDir}) {
    await fsExtra.remove(dataDir)
  }
})

const createSpace = (client, dispatch, clusterId) => ({
  async do(params) {
    let {name} = await client.spaces.create({data_dir: params.dataDir})
    dispatch(
      Spaces.setDetail(clusterId, {
        name,
        ingest: {progress: 0, snapshot: 0, warnings: []}
      })
    )
    return {...params, name}
  },
  async undo({name}) {
    await client.spaces.delete(name)
    dispatch(Spaces.remove(clusterId, name))
  }
})

const registerHandler = (dispatch, id) => ({
  do({name}) {
    let handle = {type: "INGEST", spaceName: name}
    dispatch(Handlers.register(id, handle))
  },
  undo() {
    dispatch(Handlers.remove(id))
  }
})

const unregisterHandler = (dispatch, id) => ({
  do() {
    dispatch(Handlers.remove(id))
  }
})

const postFiles = (client) => ({
  async do(params) {
    let {name, endpoint, paths} = params
    let stream
    if (endpoint === "pcap") {
      stream = client.pcaps.post({space: name, path: paths[0]})
    } else {
      stream = client.logs.post({space: name, paths, types: "default"})
    }
    return {...params, stream}
  }
})

const setSpace = (dispatch, tabId) => ({
  do({name}) {
    dispatch(Search.setSpace(name, tabId))
  },
  undo() {
    dispatch(Search.setSpace("", tabId))
  }
})

const trackProgress = (client, dispatch, clusterId) => {
  return {
    async do({name, stream, endpoint}) {
      let space = Spaces.actionsFor(clusterId, name)

      async function updateSpaceDetails() {
        let details = await client.spaces.get(name)
        dispatch(Spaces.setDetail(clusterId, details))
      }

      function toPercent(status): number {
        if (status.packet_total_size === 0) return 1
        else return status.packet_read_size / status.packet_total_size || 0
      }

      dispatch(space.setIngestProgress(0))
      for await (let {type, ...status} of stream) {
        switch (type) {
          case "PacketPostStatus":
            dispatch(space.setIngestProgress(toPercent(status)))
            dispatch(space.setIngestSnapshot(status.snapshot_count))
            if (status.snapshot_count > 0) updateSpaceDetails()
            break
          case "LogPostStatus":
            updateSpaceDetails()
            break
          case "LogPostWarning":
            dispatch(space.appendIngestWarning(status.warning))
            break
          case "TaskEnd":
            if (status.error) {
              if (endpoint === "pcap") {
                throw errors.pcapIngest(status.error.error)
              } else {
                throw errors.logsIngest(status.error.error)
              }
            }
            break
        }
      }
      dispatch(space.setIngestProgress(1))
      // The progress bar has a transition of 1 second. I think people are
      // psychologically comforted when they see the progress bar complete.
      // That is why we sleep here. It should be moved into the search
      // progress component
      await lib.sleep(1500)
      dispatch(space.setIngestProgress(null))
    }
  }
}
