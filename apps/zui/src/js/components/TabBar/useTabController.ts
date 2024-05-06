import {useSelector} from "react-redux"
import {startTransition, useEffect, useRef, useState} from "react"

import Tabs from "../../state/Tabs"
import {useDispatch} from "src/core/use-dispatch"

export default function (count: number, calcWidths: Function) {
  const trueActiveId = useSelector(Tabs.getActive)
  const [activeId, setActive] = useState(trueActiveId)
  const removedByClick = useRef(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!removedByClick.current) calcWidths()
  }, [count])

  useEffect(() => {
    setActive(trueActiveId)
  }, [trueActiveId])

  return {
    activeId,
    previewId: useSelector(Tabs.getPreview),

    onAddClick() {
      dispatch(Tabs.createQuerySession())
    },

    onRemoveClick(event: MouseEvent, id: string) {
      event.stopPropagation()
      removedByClick.current = true
      dispatch(Tabs.remove(id))
    },

    onTabClick(id: string) {
      setActive(id)
      startTransition(() => {
        dispatch(Tabs.activate(id))
      })
    },

    onMouseLeave() {
      if (removedByClick.current) {
        calcWidths()
        removedByClick.current = false
      }
    },

    onTabMove(indices: number[]) {
      dispatch(Tabs.order(indices))
    },
  }
}
