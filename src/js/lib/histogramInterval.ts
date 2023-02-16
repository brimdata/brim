import moment from "moment"
import {TimeUnit} from "."

import {DateTuple} from "../lib/TimeWindow"

export type Interval = {
  number: number
  unit: LongTimeUnit
  roundingUnit: TimeUnit
}

export type LongTimeUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"

export const timeUnits = {
  millisecond: "ms",
  second: "s",
  minute: "m",
  hour: "h",
  day: "d",
  week: "w",
  year: "y",
}

export default function histogramInterval([from, to]: DateTuple): Interval {
  const duration = moment.duration(moment(to).diff(moment(from)))

  if (duration.asMinutes() <= 1)
    return {number: 100, unit: "millisecond", roundingUnit: "second"}

  if (duration.asMinutes() <= 3)
    return {number: 500, unit: "millisecond", roundingUnit: "second"}

  if (duration.asMinutes() <= 5)
    return {number: 1, unit: "second", roundingUnit: "second"}

  if (duration.asMinutes() <= 10)
    return {number: 10, unit: "second", roundingUnit: "second"}

  if (duration.asMinutes() <= 20)
    return {number: 20, unit: "second", roundingUnit: "second"}

  if (duration.asMinutes() <= 30)
    return {number: 30, unit: "second", roundingUnit: "minute"}

  if (duration.asHours() <= 2)
    return {number: 1, unit: "minute", roundingUnit: "minute"}

  if (duration.asHours() <= 4)
    return {number: 5, unit: "minute", roundingUnit: "hour"}

  if (duration.asHours() <= 12)
    return {number: 15, unit: "minute", roundingUnit: "hour"}

  if (duration.asDays() <= 1)
    return {number: 30, unit: "minute", roundingUnit: "hour"}

  if (duration.asDays() <= 3)
    return {number: 1, unit: "hour", roundingUnit: "hour"}

  if (duration.asDays() <= 14)
    return {number: 6, unit: "hour", roundingUnit: "day"}

  if (duration.asDays() <= 60)
    return {number: 12, unit: "hour", roundingUnit: "day"}

  if (duration.asDays() <= 120)
    return {number: 1, unit: "day", roundingUnit: "day"}

  if (duration.asMonths() <= 12)
    return {number: 7, unit: "day", roundingUnit: "day"}

  return {number: 30, unit: "day", roundingUnit: "day"}
}
