/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {SearchArgs} from "../state/Search/types"
import type {Thunk} from "../state/types"
import {hashDescriptorKeys} from "../state/Viewer/helpers/hashDescriptorKeys"
import Columns from "../state/Columns"
import ErrorFactory from "../models/ErrorFactory"
import Notice from "../state/Notice"
import SearchBar from "../state/SearchBar"
import Viewer from "../state/Viewer"
import brim from "../brim"
import executeSearch from "./executeSearch"

export default function executeTableSearch(
  tabId: string,
  args: SearchArgs,
  isBlocking: boolean = false
): Thunk {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      const collectedColumns = {}
      let collectedRecords = []
      let table = brim
        .search(args.tableProgram, args.span, args.spaceId)
        .id("Table")
        .status((status) => dispatch(Viewer.setStatus(tabId, status)))
        .chan(0, (records, types) => {
          const columns = hashDescriptorKeys(types)

          if (isBlocking) {
            Object.assign(collectedColumns, columns)
            collectedRecords = collectedRecords.concat(records)
            return
          }

          dispatch(Viewer.appendRecords(tabId, records))
          dispatch(Viewer.updateColumns(tabId, columns))
          dispatch(Columns.touch(columns))
        })
        .warnings((warnings) =>
          dispatch(SearchBar.errorSearchBarParse(warnings[0]))
        )
        .error((error) => {
          dispatch(Notice.set(ErrorFactory.create(error)))
          reject(error)
        })
        .abort(resolve)
        .end((_id, count) => {
          if (isBlocking) {
            dispatch(Viewer.setRecords(tabId, collectedRecords))
            dispatch(Viewer.setColumns(tabId, collectedColumns))
            dispatch(Columns.touch(collectedColumns))
          }
          dispatch(Viewer.setEndStatus(tabId, endStatus(count)))
          resolve()
        })
      dispatch(Viewer.setStatus(tabId, "FETCHING"))
      dispatch(Viewer.setEndStatus(tabId, "FETCHING"))
      dispatch(executeSearch(table))
    })
  }
}

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
