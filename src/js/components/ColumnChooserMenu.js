/* @flow */

import {CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import React from "react"

import type {DispatchProps, State} from "../state/types"
import {Fieldset, Subscript, Label} from "./Typography"
import type {TableColumn} from "../state/Columns/types"
import CloseButton from "./CloseButton"
import Columns from "../state/Columns"
import TableColumns from "../models/TableColumns"
import dispatchToProps from "../lib/dispatchToProps"
import styled from "styled-components"
import Checkbox from "./common/Checkbox"
import SelectInput from "./common/forms/SelectInput"
import Layout from "../state/Layout"
import type {ColumnHeadersViewState} from "../state/Layout/types"

const ControlListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  cursor: default;

  p {
    text-decoration: underline;
    color: ${(props) => props.theme.colors.havelock};
  }
`

const ColumnListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  cursor: default;
  ${(props) => props.theme.typography.labelNormal}
`

const StyledLabel = styled.label`
  ${(props) => props.theme.typography.labelNormal}
`

const StyledSelectInput = styled(SelectInput)`
  width: 60px;
`

const Paragraph = styled.p`
  ${(props) => props.theme.typography.labelSmall}
`

type OwnProps = {|
  onClose: () => *
|}

type StateProps = {|
  tableColumns: TableColumns,
  columnHeadersView: ColumnHeadersViewState
|}

type Props = {|
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
|}

export default class ColumnChooserMenu extends React.Component<Props> {
  tableId() {
    return this.props.tableColumns.id
  }

  allVisible() {
    return this.props.tableColumns.allVisible()
  }

  deselectAllColumns = (e: Event) => {
    e.stopPropagation()
    this.props.dispatch(Columns.hideAllColumns(this.props.tableColumns))
  }

  selectAllColumns = (e: Event) => {
    e.stopPropagation()
    this.props.dispatch(Columns.showAllColumns(this.props.tableColumns))
  }

  onColumnClick(e: Event, column: TableColumn) {
    e.stopPropagation()
    if (column.isVisible) {
      this.props.dispatch(Columns.hideColumn(this.tableId(), column))
    } else {
      this.props.dispatch(Columns.showColumn(this.tableId(), column))
    }
  }

  render() {
    const {columnHeadersView} = this.props
    const columns = this.props.tableColumns.getColumns()
    const count = this.props.tableColumns.visibleCount()

    const onChangeColumnView = (e) => {
      this.props.dispatch(Layout.setColumnHeadersView(e.target.value))
    }

    return (
      <CSSTransition
        classNames="slide-in-right"
        timeout={{enter: 150, exit: 150}}
        in={true}
        appear
      >
        <div
          className="column-chooser-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <Fieldset>Column Chooser</Fieldset>
          <hr />
          <CloseButton light onClick={this.props.onClose} />
          <div className="count" onClick={this.selectAllColumns}>
            <Label>{count}</Label>
          </div>
          <ul>
            <ControlListItem>
              <StyledLabel>Headers</StyledLabel>
              <StyledSelectInput
                name="Headers"
                value={columnHeadersView}
                onChange={onChangeColumnView}
              >
                <option value="ON">On</option>
                <option value="OFF">Off</option>
                <option value="AUTO">Auto</option>
              </StyledSelectInput>
            </ControlListItem>
            <ControlListItem>
              <Paragraph onClick={this.selectAllColumns}>Select All</Paragraph>
              <Paragraph onClick={this.deselectAllColumns}>
                Deselect All
              </Paragraph>
            </ControlListItem>
            {columns.map((c) => (
              <ColumnListItem key={`${c.name}-${c.type}`}>
                <Checkbox
                  label={c.name}
                  checked={c.isVisible}
                  onChange={(e) => this.onColumnClick(e, c)}
                />
                <Subscript>{c.type}</Subscript>
              </ColumnListItem>
            ))}
          </ul>
        </div>
      </CSSTransition>
    )
  }
}

const stateToProps = (state: State) => ({
  tableColumns: Columns.getCurrentTableColumns(state),
  columnHeadersView: Layout.getColumnHeadersView(state)
})

export const XColumnChooserMenu = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(ColumnChooserMenu)
