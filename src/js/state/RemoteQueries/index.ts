import {createSlice} from "@reduxjs/toolkit"
import {State} from "../types"
import {Group, Query} from "../Queries/types"
import TreeModel from "tree-model"

const slice = createSlice({
  name: "$remoteQueries",
  initialState: {
    id: "root",
    name: "root",
    isOpen: true,
    items: []
  },
  reducers: {
    set(s, a) {
      s.items = a.payload
    }
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  raw: (s) => s.remoteQueries,
  getQueryById: (queryId: string) => (state: State): Query => {
    return new TreeModel({childrenPropertyName: "items"})
      .parse(state.remoteQueries)
      .first((n) => n.model.id === queryId && !("items" in n.model))?.model
  },
  getGroupById: (groupId: string) => (state: State): Group => {
    return new TreeModel({childrenPropertyName: "items"})
      .parse(state.remoteQueries)
      .first((n) => n.model.id === groupId && "items" in n.model)?.model
  }
}
