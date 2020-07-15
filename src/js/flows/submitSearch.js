/* @flow */
import type {Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import History from "../state/History"
import Investigation from "../state/Investigation"
import Notice from "../state/Notice"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import brim from "../brim"
import executeHistogramSearch from "./executeHistogramSearch"
import executeTableSearch from "./executeTableSearch"

export default function submitSearch(
  save: Object = {history: true, investigation: true},
  ts: Date = new Date()
): Thunk {
  return function(dispatch, getState) {
    let time = brim.time(ts)
    let prevArgs = Search.getArgs(getState())
    dispatch(SearchBar.submittingSearchBar(ts))
    dispatch(Tab.computeSpan())
    if (!dispatch(SearchBar.validate())) return Promise.reject()

    const state = getState()

    let record = Search.getRecord(state)
    if (save.history) {
      dispatch(History.push(record, time.toTs()))
    }
    if (save.investigation) {
      globalDispatch(Investigation.push(record, time.toTs()))
    }

    let tabId = Tabs.getActive(state)
    let args = Search.getArgs(state)

    dispatch(Viewer.clear(tabId))
    dispatch(Notice.dismiss())

    switch (args.type) {
      case "analytics":
        return dispatch(executeTableSearch(tabId, args))
      case "zoom":
        return dispatch(executeTableSearch(tabId, args))
      default:
        dispatch(executeHistogramSearch(tabId, args, prevArgs))
        return dispatch(executeTableSearch(tabId, args))
    }
  }
}
