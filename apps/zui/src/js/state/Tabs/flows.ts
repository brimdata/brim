import {nanoid} from "@reduxjs/toolkit"
import {queryPath} from "src/app/router/utils/paths"
import SessionQueries from "../SessionQueries"
import {Thunk} from "../types"
import Tabs from "./"
import {findTabById, findTabByUrl} from "./find"
import {invoke} from "src/core/invoke"

export const create =
  (url = "/", id = nanoid()): Thunk<string> =>
  (dispatch) => {
    dispatch(SessionQueries.init(id))
    dispatch(Tabs.add(id))
    global.tabHistories.create(id, [{pathname: url}], 0)
    dispatch(Tabs.activate(id))
    return id
  }

export const createQuerySession =
  (): Thunk<string> =>
  (dispatch, getState, {api}) => {
    const sessionId = nanoid()
    const version = "0"
    api.queries.addVersion(sessionId, {version, value: "", pins: []})
    const url = queryPath(sessionId, version)
    return dispatch(create(url, sessionId))
  }

export const previewUrl =
  (url: string): Thunk =>
  (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    const previewId = Tabs.getPreview(getState())
    const previewTab = previewId && findTabById(tabs, previewId)
    const tab = findTabByUrl(tabs, url)

    if (tab) {
      dispatch(Tabs.activate(tab.id))
    } else if (previewTab) {
      global.tabHistories.delete(previewId)
      global.tabHistories.create(previewId).push(url)
      dispatch(Tabs.activate(previewId))
    } else {
      const id = dispatch(Tabs.create(url))
      dispatch(Tabs.preview(id))
    }
  }

export const activateUrl =
  (url: string): Thunk =>
  (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    const tab = findTabByUrl(tabs, url)
    const previewId = Tabs.getPreview(getState())
    if (tab) {
      dispatch(Tabs.activate(tab.id))
    } else {
      dispatch(Tabs.create(url))
    }
    if (tab?.id === previewId) {
      dispatch(Tabs.preview(null))
    }
  }

export const closeActive = (): Thunk => (dispatch, getState) => {
  const tabs = Tabs.getData(getState())
  if (tabs.length === 0) {
    invoke("closeWindow")
  } else {
    const id = Tabs.getActive(getState())
    dispatch(Tabs.remove(id))
  }
}

export const activateNext = (): Thunk => (dispatch, getState) => {
  const id = Tabs.getActive(getState())
  const tabs = Tabs.getData(getState())
  const index = tabs.findIndex((tab) => tab.id === id)
  const next = tabs[(index + 1) % tabs.length]
  dispatch(Tabs.activate(next.id))
}

export const activatePrev = (): Thunk => (dispatch, getState) => {
  const id = Tabs.getActive(getState())
  const tabs = Tabs.getData(getState())
  const index = tabs.findIndex((tab) => tab.id === id)
  const next = tabs[(tabs.length + index - 1) % tabs.length]
  dispatch(Tabs.activate(next.id))
}

export const activateByIndex =
  (index: number): Thunk =>
  (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    const tab = tabs[index]
    if (tab) dispatch(Tabs.activate(tab.id))
  }

export const activateLast = (): Thunk => (dispatch, getState) => {
  const tabs = Tabs.getData(getState())
  const tab = tabs[tabs.length - 1]
  if (tab) dispatch(Tabs.activate(tab.id))
}
