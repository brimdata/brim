import isString from "lodash/isString"
import {zed} from "zealot"
import {isStringy} from "zealot/zed"

export function toZql(object: unknown): string {
  if (object instanceof zed.Primitive) return toZqlZngPrimitive(object)
  if (isString(object)) return toZqlString(object)
  if (object instanceof Date) return toZqlDate(object)
  if (typeof object === "boolean") return toZqlBool(object)

  throw new Error(`Can't convert object to ZQL: ${object}`)
}

const DOUBLE_QUOTE = /"/g
const ESCAPED_DOUBLE_QUOTE = '\\"'
const BACK_SLASH = /\\/g
const ESCAPED_BACK_SLASH = "\\\\"

function toZqlString(string: string) {
  return `"${string
    .replace(BACK_SLASH, ESCAPED_BACK_SLASH)
    .replace(DOUBLE_QUOTE, ESCAPED_DOUBLE_QUOTE)}"`
}

function toZqlDate(date: Date) {
  return (date.getTime() / 1000).toString()
}

function toZqlBool(bool: boolean) {
  return bool ? "true" : "false"
}

function toZqlZngPrimitive(data: zed.Primitive) {
  if (data.isUnset()) {
    return "null"
  } else if (isStringy(data)) {
    return toZqlString(data.toString())
  } else {
    return data.toString()
  }
}
