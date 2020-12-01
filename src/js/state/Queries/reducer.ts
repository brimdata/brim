import {Group, Query, QueriesAction, QueriesState} from "./types"
import produce from "immer"
import {get, set, initial, last, isEqual} from "lodash"
import init from "./initial"

export default produce((draft: QueriesState, action: QueriesAction) => {
  switch (action.type) {
    case "QUERIES_SET_ALL":
      return action.rootGroup
    case "QUERIES_ADD_ITEM":
      addItemToGroup(draft, action.groupPath, action.item)
      return
    case "QUERIES_REMOVE_ITEM":
      removeItemFromGroup(draft, action.itemPath)
      return
    case "QUERIES_EDIT_ITEM":
      if (!get(draft, toItemPath(action.itemPath), null)) return

      set(draft, toItemPath(action.itemPath), action.item)
      return
    case "QUERIES_MOVE_ITEM":
      moveItem(draft, action.srcItemPath, action.destItemPath)
      return
  }
}, init())

const toItemPath = (path: number[]): string =>
  path.map((pathNdx) => `items[${pathNdx}]`).join(".")

const addItemToGroup = (
  draft: QueriesState,
  groupPath: number[],
  item: Query | Group,
  index?: number
): void => {
  const parentGroup = get(draft, toItemPath(groupPath), null)
  if (!parentGroup) return

  if (typeof index === "undefined") {
    parentGroup.items.push(item)
    return
  }

  parentGroup.items.splice(index, 0, item)
}

const removeItemFromGroup = (draft: QueriesState, itemPath: number[]): void => {
  const parentGroup = get(draft, toItemPath(initial(itemPath)), null)
  if (!parentGroup) return

  parentGroup.items.splice(last(itemPath), 1)
}

const moveItem = (
  draft: QueriesState,
  srcItemPath: number[],
  destItemPath: number[]
): void => {
  const srcItem = get(draft, toItemPath(srcItemPath), null)

  if (!srcItem) return
  if (!get(draft, toItemPath(initial(destItemPath)), null)) return

  // If the move is all in the same directory then the adjusting indices can
  // cause an off by one issue since the destination index will be affected after
  // removal (e.g. an item cannot be moved to the end of its current group because of this).
  // For this situation we instead remove the item first, and then insert its copy
  if (isEqual(initial(srcItemPath), initial(destItemPath))) {
    removeItemFromGroup(draft, srcItemPath)
    addItemToGroup(
      draft,
      initial(destItemPath),
      {...srcItem},
      last(destItemPath)
    )
  } else {
    addItemToGroup(
      draft,
      initial(destItemPath),
      {...srcItem},
      last(destItemPath)
    )
    removeItemFromGroup(draft, srcItemPath)
  }
}
