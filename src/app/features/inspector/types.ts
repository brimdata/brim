import {zed} from "@brimdata/zealot"
import React, {MouseEvent, ReactNode} from "react"
import {InspectContext} from "./inspect-list"

export type IsExpanded = (key: string) => boolean
export type SetExpanded = (key: string, value: boolean) => void

type InspectorMouseEvent = (
  e: MouseEvent,
  value: zed.Value | zed.Type,
  field: zed.Field | zed.TypeField,
  index: number
) => void

export type InspectorProps = {
  height: number
  width: number
  values: zed.Value[]
  isExpanded: IsExpanded
  setExpanded: SetExpanded
  onContextMenu?: InspectorMouseEvent
  onClick?: InspectorMouseEvent
  loadMore?: Function
  innerRef?: React.Ref<any>
  onScroll?: (props: {top: number; left: number}) => void
  initialScrollPosition?: {top: number; left: number}
}

export type InspectArgs = {
  ctx: InspectContext
  value: zed.Value | zed.Type
  field: zed.Field | zed.TypeField | null
  type: zed.Type
  // This is the visual name of the key,
  // the field name for records,
  // an array index for arrays,
  // and the key type for a map
  key: string | null | zed.Any
  last: boolean
  indexPath: number[]
}

export type RowData = {
  indent: number
  render: ReactNode
}
