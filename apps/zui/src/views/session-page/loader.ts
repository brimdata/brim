import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import {startTransition} from "react"
import {QueryModel} from "../../js/models/query-model"
import Notice from "src/js/state/Notice"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import {Location} from "history"
import Pools from "src/js/state/Pools"
import {invoke} from "src/core/invoke"
import {runHistogramQuery} from "src/views/histogram-pane/run-query"
import {runResultsQuery} from "src/views/results-pane/run-results-query"
import Layout from "src/js/state/Layout"
import {syncPool} from "src/app/core/pools/sync-pool"

export function loadRoute(location: Location): Thunk {
  return (dispatch) => {
    dispatch(syncPluginContext)
    dispatch(Tabs.loaded(location.key))
    dispatch(Notice.dismiss())
    dispatch(syncEditor)
    dispatch(fetchData())
  }
}

function syncPluginContext(dispatch, getState) {
  const poolName = Current.getActiveQuery(getState()).toAst().poolName
  const program = QueryModel.versionToZed(Current.getVersion(getState()))
  invoke("updatePluginSessionOp", {poolName, program})
}

function syncEditor(dispatch, getState) {
  const lakeId = Current.getLakeId(getState())
  const version = Current.getVersion(getState())
  const poolName = Current.getActiveQuery(getState()).toAst().poolName
  const pool = Pools.getByName(lakeId, poolName)(getState())

  if (pool && !pool.hasSpan()) dispatch(syncPool(pool.id, lakeId))

  // Give codemirror a chance to update by scheduling this update
  setTimeout(() => {
    dispatch(Editor.setValue(version?.value ?? ""))
    dispatch(Editor.setPins(version?.pins || []))
  })
}

function fetchData() {
  return (dispatch, getState, {api}) => {
    const version = Current.getVersion(getState())
    const histogramVisible = Layout.getShowHistogram(getState())

    startTransition(() => {
      if (version) {
        dispatch(runResultsQuery())
        if (histogramVisible) {
          runHistogramQuery(api)
        }
      }
    })
  }
}
