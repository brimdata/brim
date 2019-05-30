/* @flow */

import React from "react"

import type {ViewerDimens} from "../../types"
import {XColResizer} from "./ColResizer"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"
import columnKey from "../../lib/columnKey"
import {reactElementProps} from "../../test/integration"

type Props = {
  dimens: ViewerDimens,
  scrollLeft: number,
  columns: TableColumns
}

export default class Header extends React.PureComponent<Props> {
  render() {
    const {dimens, scrollLeft} = this.props

    if (dimens.rowWidth !== "auto") {
      return (
        <header
          style={Styler.header(dimens, scrollLeft)}
          // Cannot get this.props.locator because property locator is missing in Props
          {...reactElementProps(this.props.locator)}
        >
          {this.props.columns.getVisible().map((column) => (
            <div
              className="header-cell"
              key={columnKey(column)}
              style={{width: column.width || 300}}
            >
              {column.name}
              <XColResizer column={column} tableId={this.props.columns.id} />
            </div>
          ))}
        </header>
      )
    } else {
      return null
    }
  }
}
