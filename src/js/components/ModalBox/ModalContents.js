/* @flow */
import React from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"

import type {ModalContentsProps} from "./types"
import Buttons from "./Buttons"
import CloseButton from "../CloseButton"
import lib from "../../lib"
import useModalController from "./useModalController"

// $FlowFixMe
const ModalContents = React.forwardRef(function ModalContents(
  {children, className, title, buttons: template, ...rest}: ModalContentsProps,
  ref
) {
  let {closeModal, buttons} = useModalController(template)

  return ReactDOM.createPortal(
    <div className="modal-overlay" ref={ref}>
      <div {...rest} className={classNames("modal-contents", className)}>
        <CloseButton light onClick={closeModal} />
        <h2 className="modal-header">{title}</h2>
        <div className="modal-body">{children}</div>
        <Buttons template={buttons} closeModal={closeModal} />
      </div>
    </div>,
    lib.doc.id("modal-root")
  )
})

export default ModalContents
