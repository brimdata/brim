import React, {ChangeEvent} from "react"
import useWorkspaceId from "app/router/hooks/use-workspace-id"
import tabHistory from "app/router/tab-history"
import {lakeImportPath} from "app/router/utils/paths"
import {MenuItemConstructorOptions} from "electron"
import {useDispatch, useSelector} from "react-redux"
import styled from "styled-components"
import DropdownArrow from "src/js/icons/DropdownArrow"
import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Modal from "src/js/state/Modal"
import {AppDispatch} from "src/js/state/types"
import Lakes from "src/js/state/Lakes"
import {Lake} from "src/js/state/Lakes/types"
import brim from "src/js/brim"
import {useHistory} from "react-router"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {useBrimApi} from "app/core/context"

const LakePickerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const LakeNameGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 12px 6px;
  user-select: none;
  width: 100%;
  border-radius: 6px;
  padding: 6px 10px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  svg {
    height: 8px;
    width: 8px;
    stroke: var(--slate);
    margin-left: 6px;
  }
`

const NameColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  label {
    ${(props) => props.theme.typography.labelBold};
    color: var(--aqua);
  }
  label:last-child {
    ${(props) => props.theme.typography.labelSmall};
    color: var(--lead);
  }
`

const StyledAddButton = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  border-width: 0;
  margin: 0 16px;
  line-height: 20px;
  font-family: "system-ui", sans-serif;
  font-weight: 300;
  font-size: 20px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

const showLakeSelectMenu = () => (dispatch, getState) => {
  const workspaces = Lakes.all(getState())
  const currentId = Current.getWorkspaceId(getState())

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Get Info",
      click: () => dispatch(Modal.show("view-workspace"))
    },
    {type: "separator"}
  ]

  workspaces.forEach((w: Lake) => {
    const isCurrent = w.id === currentId
    template.push({
      type: "checkbox",
      label: w.name,
      checked: isCurrent,
      click: () => {
        if (isCurrent) return
        dispatch(tabHistory.push(lakeImportPath(w.id)))
      }
    })
  })

  showContextMenu(template)
}

export default function LakePicker() {
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const workspaceId = useWorkspaceId()
  const api = useBrimApi()
  const [importer, ref] = useCallbackRef<HTMLButtonElement>()
  const current = brim.workspace(useSelector(Lakes.id(workspaceId)))

  const showAddMenu = () => {
    const template: MenuItemConstructorOptions[] = [
      {
        label: "Add Lake...",
        click: () => dispatch(Modal.show("new-workspace"))
      },
      {
        label: "Add Pool",
        click: () => history.push(lakeImportPath(workspaceId)),
        enabled: !!workspaceId
      },
      {type: "separator"},
      {
        label: "Add Local Query...",
        click: () => dispatch(Modal.show("new-query"))
      },
      {
        label: "Import from JSON...",
        click: () => importer && importer.click()
      },
      {type: "separator"},
      {
        label: "Add Remote Query...",
        click: () => dispatch(Modal.show("new-query", {isRemote: true}))
      }
    ]

    showContextMenu(template)
  }

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    if (file) {
      api.importQueries(file)
    }
    e.target.value = null
  }

  return (
    <LakePickerWrapper>
      <LakeNameGroup onClick={() => dispatch(showLakeSelectMenu())}>
        <NameColumn>
          <label>{`${current?.name}`}</label>
          <label>{`${current?.getAddress()}`}</label>
        </NameColumn>
        <DropdownArrow />
      </LakeNameGroup>
      <StyledAddButton onClick={() => showAddMenu()}>+</StyledAddButton>
      <input
        ref={ref}
        type="file"
        style={{display: "none"}}
        onChange={onImport}
      />
    </LakePickerWrapper>
  )
}
