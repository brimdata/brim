/* @flow */
import type {DateTuple} from "../../lib/TimeWindow"
import type {
  SEARCH_CLEAR,
  SEARCH_SPAN_ARGS_SET,
  SEARCH_SPAN_FOCUS_SET,
  SEARCH_SPAN_SET,
  SpanArgs
} from "./types"
import brim, {type Span} from "../../brim"

export default {
  setSpan(span: Span): SEARCH_SPAN_SET {
    return {type: "SEARCH_SPAN_SET", span}
  },
  setSpanArgs(spanArgs: SpanArgs, tabId?: string): SEARCH_SPAN_ARGS_SET {
    return {type: "SEARCH_SPAN_ARGS_SET", spanArgs, tabId}
  },
  setSpanArgsFromDates(dates: DateTuple): SEARCH_SPAN_ARGS_SET {
    let spanArgs = brim.dateTuple(dates).toSpan()
    return {type: "SEARCH_SPAN_ARGS_SET", spanArgs}
  },
  setSpanFocus(spanFocus: ?Span): SEARCH_SPAN_FOCUS_SET {
    return {type: "SEARCH_SPAN_FOCUS_SET", spanFocus}
  },
  clear(): SEARCH_CLEAR {
    return {type: "SEARCH_CLEAR"}
  }
}
