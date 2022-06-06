import {useSelector} from "react-redux"
import React from "react"
import {join} from "path"

import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import clickFeedback from "./clickFeedback"
import lib from "../lib"
import {
  Content,
  Footer,
  ButtonGroup,
  Title,
  Pre,
  Scrollable,
} from "./ModalDialog/ModalDialog"
import ToolbarButton from "src/app/query-home/toolbar/button"
import styled from "styled-components"
import useEnterKey from "./hooks/useEnterKey"

const Command = styled(Pre)`
  margin-bottom: 48px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
`

export default function ZQModal({onClose}) {
  const program = useSelector(SearchBar.getSearchProgram)
  const zng = join(useSelector(Tab.getPoolName), "all.zng")
  const cmd = ["zq", "-f table", `"${program}"`, zng].join(" ")
  useEnterKey(onClose)

  function copyToClip(e) {
    clickFeedback(e.target, "Copied")
    const node = document.getElementById("zq-code")
    if (node) lib.doc.copyToClipboard(node.textContent)
  }

  return (
    <Content width={600}>
      <Title>Zq Command</Title>
      <Scrollable>
        <Command id="zq-code">{cmd}</Command>
      </Scrollable>
      <Footer>
        <ButtonGroup>
          <ToolbarButton text="Copy" onClick={copyToClip} />
          <ToolbarButton text="Done" onClick={onClose} />
        </ButtonGroup>
      </Footer>
    </Content>
  )
}
