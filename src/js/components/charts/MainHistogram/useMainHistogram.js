/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useMemo} from "react"
import * as d3 from "d3"

import type {DateTuple} from "../../../lib/TimeWindow"
import type {Pen, HistogramChart} from "../types"
import {innerHeight, innerWidth} from "../dimens"
import Chart from "../../../state/Chart"
import EmptyMessage from "../../EmptyMessage"
import HistogramTooltip from "../../HistogramTooltip"
import LoadingMessage from "../../LoadingMessage"
import barStacks from "../pens/barStacks"
import brim from "../../../brim"
import focusBar from "../pens/focusBar"
import format from "./format"
import hoverLine from "../pens/hoverLine"
import reactComponent from "../pens/reactComponent"
import search from "../../../state/Search"
import submitSearch from "../../../flows/submitSearch"
import tab from "../../../state/Tab"
import time from "../../../brim/time"
import useConst from "../../hooks/useConst"
import xAxisBrush from "../pens/xAxisBrush"
import xAxisTime from "../pens/xAxisTime"
import xPositionTooltip from "../pens/xPositionTooltip"
import yAxisSingleTick from "../pens/yAxisSingleTick"

export default function(width: number, height: number): HistogramChart {
  let chartData = useSelector(Chart.getData)
  let status = useSelector(Chart.getStatus)
  let span = useSelector(tab.getSpanAsDates)
  let innerSpan = useSelector(tab.getSpanFocusAsDates)

  let dispatch = useDispatch()
  let pens = useConst<Pen[]>([], () => {
    function onDragEnd(span: DateTuple) {
      dispatch(search.setSpanArgs(brim.dateTuple(span).toSpan()))
      dispatch(submitSearch())
    }

    function onSelection(span: DateTuple) {
      dispatch(search.setSpanFocus(null))
      dispatch(search.setSpanArgsFromDates(span))
      dispatch(submitSearch())
    }

    function onFocus(dates: DateTuple) {
      dispatch(search.setSpanFocus(time.convertToSpan(dates)))
      dispatch(submitSearch({history: false, investigation: false}))
    }

    function onSelectionClear() {
      dispatch(search.setSpanFocus(null))
      dispatch(submitSearch({history: false, investigation: false}))
    }

    function onSelectionClick(span) {
      dispatch(search.setSpanFocus(null))
      dispatch(search.setSpanArgsFromDates(span))
      dispatch(submitSearch())
    }

    return [
      xAxisTime({onDragEnd}),
      barStacks(),
      yAxisSingleTick(),
      xAxisBrush({onSelection, onSelectionClear, onSelectionClick}),
      hoverLine(),
      reactComponent((chart) => (
        <EmptyMessage show={!chart.state.isFetching && chart.state.isEmpty} />
      )),
      reactComponent((chart) => (
        <LoadingMessage show={chart.state.isFetching} message="Chart Loading" />
      )),
      focusBar({onFocus}),

      xPositionTooltip({
        wrapperClassName: "histogram-tooltip-wrapper",
        render: HistogramTooltip
      })
    ]
  })

  return useMemo<HistogramChart>(() => {
    let data = format(chartData, span)
    let maxY = d3.max(data.points, (d) => d.count) || 0
    let oneCharWidth = 5.5366666667
    let chars = d3.format(",")(maxY).length
    let yAxisWidth = chars * oneCharWidth + 3
    let minWidth = 38
    let margins = {
      left: Math.max(minWidth, yAxisWidth + 8),
      right: 8,
      top: 3,
      bottom: 16
    }

    return {
      data,
      width,
      height,
      margins,
      state: {
        isFetching: status === "FETCHING",
        selection: innerSpan,
        isEmpty: data.points.length === 0,
        isDragging: false
      },
      yScale: d3
        .scaleLinear()
        .range([innerHeight(height, margins), 0])
        .domain([0, maxY]),
      xScale: d3
        .scaleUtc()
        .range([0, innerWidth(width, margins)])
        .domain(span),
      pens
    }
  }, [chartData, status, span, innerSpan, width, height])
}
