/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {DispatchProps, State} from "../state/types"
import {XCurlModal} from "./CurlModal"
import {XDebugModal} from "./DebugModal"
import {XSearchButtonMenu} from "./SearchButtonMenu"
import {getCurlModalIsOpen, getDebugModalIsOpen} from "../state/reducers/view"
import {hideModal} from "../state/actions"
import {submitSearchBar} from "../state/thunks/searchBar"
import Arrow from "../icons/caret-bottom-sm.svg"
import DropMenu from "./DropMenu"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Modal from "./Modal"
import dispatchToProps from "../lib/dispatchToProps"
import {reactElementProps} from "../test/integration"

type StateProps = {|
  debugModalIsOpen: boolean,
  curlModalIsOpen: boolean
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

export default class SearchButton extends React.Component<Props> {
  render() {
    return (
      <div className="search-button-wrapper">
        <button
          className="button search-button"
          {...reactElementProps("search_button")}
          onClick={() => this.props.dispatch(submitSearchBar())}
        >
          <MagGlass />
        </button>

        <DropMenu menu={XSearchButtonMenu} position="right">
          <button className="button options-button">
            <Arrow />
          </button>
        </DropMenu>

        <Modal
          title="Debug Query"
          isOpen={this.props.debugModalIsOpen}
          onClose={() => this.props.dispatch(hideModal())}
        >
          <XDebugModal />
        </Modal>

        <XCurlModal
          isOpen={this.props.curlModalIsOpen}
          onClose={() => this.props.dispatch(hideModal())}
        />
      </div>
    )
  }
}

const stateToProps = (state: State) => ({
  debugModalIsOpen: getDebugModalIsOpen(state),
  curlModalIsOpen: getCurlModalIsOpen(state)
})

export const XSearchButton = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchButton)
