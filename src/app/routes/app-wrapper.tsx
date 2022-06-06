import ColumnsModal from "src/app/columns/columns-modal"
import env from "src/app/core/env"
import HookLog from "src/app/system-test/HookLog"
import React from "react"
import BrimToaster from "src/js/components/BrimToaster"
import BrimTooltip from "src/js/components/BrimTooltip"
import ErrorNotice from "src/js/components/ErrorNotice"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {XLatestError} from "src/js/components/LatestError"
import {Modals} from "src/js/components/Modals"
import PoolModal from "src/js/components/PoolModal"
import Preferences from "src/js/components/Preferences/Preferences"
import StatusBar from "src/js/components/StatusBar"
import TabBar from "src/js/components/TabBar/TabBar"
import styled from "styled-components"
import {Sidebar} from "src/app/features/sidebar"
import Tabs from "src/js/state/Tabs"
import {useDispatch} from "../core/state"

const ColumnLayout = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: column;
  position: relative;
`

const RowLayout = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: row;
  position: relative;
  padding-top: 1px;
`

const SearchPageMain = styled.div`
  display: flex;
  height: 100%;
`

const SearchPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

function interactive() {
  return (dispatch, getState) => {
    const active = Tabs.getActive(getState())
    const preview = Tabs.getPreview(getState())
    if (active === preview) {
      dispatch(Tabs.preview(null))
    }
  }
}

export default function AppWrapper({children}) {
  const dispatch = useDispatch()
  return (
    <div className="app-wrapper">
      <div className="title-bar-drag-area" />
      <XLatestError />
      <SearchPageWrapper>
        <SearchPageMain>
          <ColumnLayout>
            <div id="modal-dialog-root" />
            <TabBar />
            <RowLayout>
              <Sidebar />
              <ColumnLayout
                onClick={() => dispatch(interactive())}
                onMouseDown={() => dispatch(interactive())}
              >
                {children}
              </ColumnLayout>
            </RowLayout>
            <StatusBar />
          </ColumnLayout>
        </SearchPageMain>
      </SearchPageWrapper>

      {/* Global Modals */}
      <ErrorNotice />
      <Preferences />
      <Modals />
      <PoolModal />
      <ColumnsModal />
      <HTMLContextMenu />
      <BrimToaster />
      <BrimTooltip />

      {env.isIntegrationTest && <HookLog />}
    </div>
  )
}
