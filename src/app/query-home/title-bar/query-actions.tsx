import React from "react"
import {useSelector} from "react-redux"
import {runQuery} from "src/app/commands/run-query"
import {useBrimApi} from "src/app/core/context"
import useSelect from "src/app/core/hooks/use-select"
import {useDispatch} from "src/app/core/state"
import {InputButton} from "src/components/input-button"
import {SubmitButton} from "src/components/submit-button"
import Editor from "src/js/state/Editor"
import Layout from "src/js/state/Layout"
import styled from "styled-components"
import {useActiveQuery} from "./context"

const Actions = styled.div`
  display: flex;
  gap: 10px;
`

export function QueryActions() {
  const active = useActiveQuery()
  const isEditing = useSelector(Layout.getIsEditingTitle)
  if (isEditing) return null
  return (
    <Actions>
      {active.isModified() && <Update />}
      <Create />
      <Run />
    </Actions>
  )
}

function Run() {
  return (
    <SubmitButton
      aria-label="run-query"
      onClick={() => runQuery.run()} // 🎶
      icon="run"
      iconSize={16}
    >
      Run
    </SubmitButton>
  )
}

function Create() {
  const dispatch = useDispatch()
  const active = useActiveQuery()
  const text = active.isAnonymous() ? "Save" : "Save As"
  const isEmpty = useSelector(Editor.isEmpty)
  function onClick() {
    dispatch(Layout.showTitleForm("create"))
  }
  return (
    <InputButton onClick={onClick} disabled={isEmpty}>
      {text}
    </InputButton>
  )
}

function Update() {
  const active = useActiveQuery()
  const api = useBrimApi()
  const select = useSelect()

  function onClick() {
    const snapshot = select(Editor.getSnapshot)
    const id = active.query.id
    api.queries.addVersion(id, snapshot)
    api.queries.open(id, {history: "replace"})
  }

  return <SubmitButton onClick={onClick}>Save</SubmitButton>
}
