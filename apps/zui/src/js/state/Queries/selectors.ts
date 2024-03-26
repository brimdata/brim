import {Group, QueriesState, Query} from "./types"
import {State} from "../types"
import TreeModel from "tree-model"
import {createSelector} from "reselect"
import QueryVersions from "../QueryVersions"
import {QueryModel} from "src/js/models/query-model"
import {entitiesToArray} from "../utils"
import memoizeOne from "memoize-one"

export const raw = (state: State): QueriesState => state.queries

export const find = (state: State, id: string): Query | null => {
  return new TreeModel({childrenPropertyName: "items"})
    .parse(state.queries)
    .first((n) => n.model.id === id)?.model
}

export const findSessionQuery = (state: State, id: string): Query | null => {
  return state.sessionQueries[id]
}

const memoGetVersions = memoizeOne(entitiesToArray)

const getQueryVersions = (state: State, id: string) => {
  const ids = QueryVersions.at(id).ids(state)
  const entities = QueryVersions.at(id).entities(state)
  return memoGetVersions(ids, entities)
}

export const build = createSelector(
  find,
  findSessionQuery,
  getQueryVersions,
  (localMeta, sessionMeta, versions) => {
    if (localMeta) return new QueryModel(localMeta, versions, "local")
    if (sessionMeta) return new QueryModel(sessionMeta, versions, "session")
    return null
  }
)

export const makeBuildSelector = () => {
  return createSelector(find, getQueryVersions, (meta, versions) => {
    if (!meta) return null
    return new QueryModel(meta, versions, "local")
  })
}

/**
 * @deprecated use find instead
 */
export const getQueryById =
  (queryId: string) =>
  (state: State): Query => {
    return find(state, queryId)
  }

export const getGroupById =
  (groupId: string) =>
  (state: State): Group => {
    return new TreeModel({childrenPropertyName: "items"})
      .parse(state.queries)
      .first((n) => n.model.id === groupId && "items" in n.model)?.model
  }

export const getTags = createSelector<State, QueriesState, string[]>(
  raw,
  (queries): string[] => {
    const tagMap = {}
    new TreeModel({childrenPropertyName: "items"}).parse(queries).walk((n) => {
      // skip if it is group (true means continue)
      if (!n.model.tags) return true
      n.model.tags.forEach((t) => {
        tagMap[t] = true
      })

      return true
    })

    return Object.keys(tagMap)
  }
)

export const any = createSelector(getGroupById("root"), (group) => {
  return group.items.length > 0
})
