import {zed} from "@brimdata/zealot"
import useSelect from "src/app/core/hooks/use-select"
import {Inspector} from "src/app/features/inspector/inspector"
import searchFieldContextMenu from "src/ppl/menus/searchFieldContextMenu"
import React, {useCallback, MouseEvent, useMemo} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import Slice from "src/js/state/Inspector"
import {useRowSelection} from "./results-table/hooks/use-row-selection"
import {debounce, values} from "lodash"
import Results from "src/js/state/Results"

export function MainInspector(props: {
  height: number
  width: number
  values: zed.Value[]
}) {
  const select = useSelect()
  const dispatch = useDispatch()
  const expanded = useSelector(Slice.getExpanded)
  const defaultExpanded = useSelector(Slice.getDefaultExpanded)
  const {parentRef, clicked} = useRowSelection({
    count: values.length,
  })

  function setExpanded(key: string, isExpanded: boolean) {
    dispatch(Slice.setExpanded({key, isExpanded}))
  }

  function isExpanded(key: string) {
    if (expanded.has(key)) {
      return expanded.get(key)
    } else {
      return defaultExpanded
    }
  }

  function loadMore() {
    if (select(Results.isFetching)) return
    if (select(Results.isComplete)) return
    if (select(Results.isLimited)) return
    dispatch(Results.fetchNextPage())
  }

  function onContextMenu(e, value: zed.Value, field: zed.Field) {
    dispatch(
      searchFieldContextMenu({
        value,
        field,
        record: field.rootRecord,
      })
    )
  }

  function onClick(
    e: MouseEvent,
    value: zed.Value,
    field: zed.Field,
    index: number
  ) {
    dispatch(viewLogDetail(field.rootRecord))
    clicked(e, index)
  }

  function onScroll({top, left}) {
    dispatch(Slice.setScrollPosition({top, left}))
  }

  const safeOnScroll = useMemo(
    () => debounce(onScroll, 250, {trailing: true, leading: false}),
    []
  )

  const initialScrollPosition = useMemo(
    () => select(Slice.getScrollPosition),
    []
  )

  return (
    <Inspector
      initialScrollPosition={initialScrollPosition}
      onScroll={safeOnScroll}
      innerRef={parentRef}
      isExpanded={useCallback(isExpanded, [expanded, defaultExpanded])}
      setExpanded={useCallback(setExpanded, [])}
      loadMore={useCallback(loadMore, [])}
      onContextMenu={useCallback(onContextMenu, [])}
      onClick={useCallback(onClick, [])}
      {...props}
    />
  )
}
