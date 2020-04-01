/* @flow */

export type LayoutState = {
  rightSidebarWidth: number,
  rightSidebarIsOpen: boolean
}

export type LayoutAction =
  | LAYOUT_RIGHT_SIDEBAR_SHOW
  | LAYOUT_RIGHT_SIDEBAR_HIDE
  | LAYOUT_RIGHT_SIDEBAR_TOGGLE
  | LAYOUT_RIGHT_SIDEBAR_WIDTH_SET

export type LAYOUT_RIGHT_SIDEBAR_SHOW = {
  type: "LAYOUT_RIGHT_SIDEBAR_SHOW"
}

export type LAYOUT_RIGHT_SIDEBAR_HIDE = {
  type: "LAYOUT_RIGHT_SIDEBAR_HIDE"
}

export type LAYOUT_RIGHT_SIDEBAR_TOGGLE = {
  type: "LAYOUT_RIGHT_SIDEBAR_TOGGLE"
}

export type LAYOUT_RIGHT_SIDEBAR_WIDTH_SET = {
  type: "LAYOUT_RIGHT_SIDEBAR_WIDTH_SET",
  width: number
}
