import React, {useMemo} from "react"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {useSelector} from "react-redux"
import {HistoryItem} from "./history-item"
import {isEmpty} from "lodash"
import {EmptyText} from "src/components/empty-text"
import {FillFlexParent} from "src/components/fill-flex-parent"
import {Tree} from "react-arborist"
import {TREE_ITEM_HEIGHT} from "../../sidebar/item"

const BG = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0;
`

export function HistorySection() {
  const sessionHistory = useSelector(Current.getSessionHistory) || []
  const history = useMemo(
    () =>
      [...sessionHistory].reverse().map((d, index) => ({
        ...d,
        id: (sessionHistory.length - 1 - index).toString(),
        index: sessionHistory.length - 1 - index,
      })),
    [sessionHistory]
  )

  return (
    <BG aria-label="history-pane">
      {isEmpty(history) && (
        <EmptyText>Session history will appear here.</EmptyText>
      )}
      <FillFlexParent>
        {(dimens) => {
          return (
            <Tree
              {...dimens}
              data={history}
              padding={8}
              rowHeight={TREE_ITEM_HEIGHT}
              indent={8}
              disableDrag
              disableDrop
            >
              {HistoryItem}
            </Tree>
          )
        }}
      </FillFlexParent>
    </BG>
  )
}
