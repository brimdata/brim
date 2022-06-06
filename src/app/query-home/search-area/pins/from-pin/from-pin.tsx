import {isString} from "lodash"
import React, {useRef} from "react"
import {useDispatch} from "src/app/core/state"
import submitSearch from "src/app/query-home/flows/submit-search"
import Editor from "src/js/state/Editor"
import {FromQueryPin} from "src/js/state/Editor/types"
import {BasePin} from "../base-pin"
import {showMenu} from "./show-menu"

export default function FromPin(props: {pin: FromQueryPin; index: number}) {
  const dispatch = useDispatch()
  const ref = useRef()
  return (
    <BasePin
      pin={props.pin}
      ref={ref}
      index={props.index}
      prefix="from"
      label={props.pin.value || "Select pool"}
      showMenu={() => {
        if (!ref.current) return
        dispatch(showMenu(ref.current)).then((value: string) => {
          if (isString(value)) {
            if (value !== props.pin.value) {
              dispatch(Editor.updatePin({value}))
              dispatch(submitSearch())
            }
          } else dispatch(Editor.cancelPinEdit())
        })
      }}
    />
  )
}
