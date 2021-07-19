import {formatPrimitive} from "app/core/format"
import {isEventType} from "ppl/suricata/suricata-plugin"
import {isPath} from "ppl/zeek/zeek-plugin"
import {zed} from "zealot"

const ONE_CHAR = 7.39
const CELL_PAD = ONE_CHAR * 2

const MAX_WIDTH = 500
const MIN_WIDTH = 10
const resizeHandle = 5
const sortIcon = 11

export function estimateHeaderWidth(name: string) {
  let width = Math.ceil(name.length * ONE_CHAR + resizeHandle + sortIcon)
  return Math.min(MAX_WIDTH, width)
}

export function estimateCellWidth(value: zed.AnyValue, name: string) {
  let width = MIN_WIDTH
  if (value instanceof zed.Primitive) {
    width = Math.ceil(formatPrimitive(value).length * ONE_CHAR + CELL_PAD)
  } else {
    width = Math.ceil(value.toString().length * ONE_CHAR + CELL_PAD)
  }

  // Move to plugin
  if (isPath(new zed.Field(name, value))) {
    width += 12 // padding
  }

  // Move to plugin
  if (isEventType(new zed.Field(name, value))) {
    width += 12 // padding
  }

  return Math.min(MAX_WIDTH, width)
}
