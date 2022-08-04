import {nanoid} from "@reduxjs/toolkit"
import {Query} from "src/js/state/Queries/types"
import {Thunk} from "src/js/state/types"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import actions from "./actions"
import Queries from "."
import {flattenQueryTree, getNextCount} from "./helpers"
import {BrimQuery} from "src/app/query-home/utils/brim-query"

export function create(
  attrs: Partial<QueryVersion & {name?: string}> = {}
): Thunk<BrimQuery> {
  return (dispatch, getState) => {
    const queries = flattenQueryTree(Queries.raw(getState()), false).map(
      (n) => n.model
    )
    const {name, ...versionAttrs} = attrs
    const query: Query = {
      id: nanoid(),
      name: name || `Query #${getNextCount(queries, "Query")}`,
    }
    const version: QueryVersion = {
      value: "",
      ...versionAttrs,
      version: nanoid(),
      ts: new Date().toISOString(),
    }
    dispatch(actions.addItem(query))
    dispatch(QueryVersions.add({queryId: query.id, version}))
    const versions = QueryVersions.getByQueryId(query.id)(getState())

    return new BrimQuery(query, versions)
  }
}
