/* @flow */

import {animated, useSpring} from "react-spring"
import React, {useState} from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"

import lib from "../lib"
import useCallbackRef from "./hooks/useCallbackRef"
import useEntrance from "./hooks/useEntrance"
import useTipPosition from "./hooks/useTipPosition"

type Props = {
  show: boolean,
  children: any,
  anchor: ?HTMLElement,
  className?: string
}

export default function Tip({show, children, anchor, className}: Props) {
  let [over, setOver] = useState(false)
  let [popper, setRef] = useCallbackRef()
  let style = useTipPosition(anchor, popper)
  let [status, entered, exited] = useEntrance(over || show, 100, 100)

  const immediate = (name) => name === "transform"
  let configs = {
    in: {opacity: 1, immediate},
    entering: {opacity: 1, onRest: entered, immediate},
    exiting: {opacity: 0, onRest: exited, immediate},
    out: {opacity: 0, immediate}
  }
  let spring = useSpring({
    ...configs[status],
    ...style,
    config: {duration: 100}
  })

  const onMouseEnter = () => setOver(true)
  const onMouseLeave = () => setOver(false)

  if (status === "out") return null
  else
    return ReactDOM.createPortal(
      <animated.div
        className={classNames("tip", className)}
        ref={setRef}
        style={spring}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="tip-bg" />
        <div>{children}</div>
      </animated.div>,
      lib.doc.id("tooltip-root")
    )
}
