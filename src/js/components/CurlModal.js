/* @flow */

import {useDispatch} from "react-redux"
import React from "react"

import {inspectSearch} from "../flows/inspectSearch"
import {reactElementProps} from "../test/integration"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import clickFeedback from "./clickFeedback"
import lib from "../lib"

export default function CurlModalBox() {
  function copyToClip(_, e) {
    clickFeedback(e.target, "Copied")

    var node = document.getElementById("copy-to-curl-code")
    if (node) lib.doc.copyToClipboard(node.textContent)
  }

  let buttons = [
    {
      label: "Copy",
      click: copyToClip
    },
    {
      label: "Done",
      click: (closeModal) => closeModal()
    }
  ]

  return (
    <ModalBox
      buttons={buttons}
      name="curl"
      className="curl-modal"
      title="curl command"
      {...reactElementProps("curlModal")}
    >
      <CurlModalContents />
    </ModalBox>
  )
}

function CurlModalContents() {
  const dispatch = useDispatch()
  const {search, host, program} = dispatch(inspectSearch())
  return (
    <TextContent>
      {search && (
        <pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
          curl -X {search.method} -d &apos;
          {JSON.stringify(JSON.parse(search.body), null, 2)}
          &apos; http://{host}
          {search.path}
        </pre>
      )}
      {!search && (
        <pre id="copy-to-curl-code" {...reactElementProps("curlCommand")}>
          Invalid ZQL: &apos;{program}&apos;
        </pre>
      )}
    </TextContent>
  )
}
