import {createSelector} from "reselect"
import {TabState} from "../Tab/types"
import {State} from "../types"
import {createIsEqualSelector} from "../utils"
import {TabsState} from "./types"

export const getData = (state: State) => state.tabs.data
export const getActive = (state: State) => state.tabs.active
export const getCount = (state: State) => state.tabs.data.length
export const getPreview = (state: State) => state.tabs.preview

export const getActiveTab = createSelector<State, TabsState, TabState>(
  (state) => state.tabs,
  (tabs) => {
    const tab = tabs.data.find((t) => t.id === tabs.active)
    if (!tab) throw new Error("Can't find active tab")
    return tab
  }
)

export const _getIds = createSelector(getData, (data) => {
  return data.map((d) => d.id)
})

export const getIds = createIsEqualSelector(_getIds, (ids) => ids)
