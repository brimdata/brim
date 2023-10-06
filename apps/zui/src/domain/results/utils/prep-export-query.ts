import ZuiApi from "src/js/api/zui-api"
import program from "src/js/models/program"
import Results from "src/js/state/Results"
import {RESULTS_QUERY} from "src/views/results-pane/run-results-query"

export function prepExportQuery(api: ZuiApi, format: string) {
  let query = Results.getQuery(RESULTS_QUERY)(api.getState())
  query = cutColumns(query, api)
  query = maybeFuse(query, format)
  return query
}

function cutColumns(query: string, api: ZuiApi) {
  if (api.table && api.table.hiddenColumnCount > 0) {
    const names = api.table.columns.map((c) => c.columnDef.header as string)
    return program(query)
      .quietCut(...names)
      .string()
  } else {
    return query
  }
}

function maybeFuse(query: string, format: string) {
  if (format === "csv" || format === "arrows") query += " | fuse"
  return query
}
