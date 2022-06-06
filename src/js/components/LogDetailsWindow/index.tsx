import {useDispatch, useSelector} from "react-redux"
import React from "react"
import useStoreExport from "src/app/core/hooks/useStoreExport"
import {Center, Left, PaneHeader, PaneTitle, Right} from "../Pane"
import Current from "../../state/Current"
import HistoryButtons from "../common/HistoryButtons"
import LogDetails from "../../state/LogDetails"
import DetailPane from "src/app/detail/Pane"
import ActionButton from "src/app/query-home/toolbar/action-button"
import usePluginToolbarItems from "src/app/query-home/toolbar/hooks/use-plugin-toolbar-items"

export default function LogDetailsWindow() {
  useStoreExport()
  const dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).canGoBack()
  const nextExists = useSelector(LogDetails.getHistory).canGoForward()
  const pool = useSelector(Current.getQueryPool)
  const pluginButtons = usePluginToolbarItems("detail").map((button, i) => (
    <ActionButton key={button.label || i} {...button} />
  ))

  return (
    <div className="log-detail-window">
      <PaneHeader>
        <Left>
          <HistoryButtons
            prevExists={prevExists}
            nextExists={nextExists}
            backFunc={() => dispatch(LogDetails.back())}
            forwardFunc={() => dispatch(LogDetails.forward())}
          />
        </Left>
        <Center>
          <PaneTitle>Log details for pool: {pool.name}</PaneTitle>
        </Center>
        <Right>
          <div>{pluginButtons}</div>
        </Right>
      </PaneHeader>
      <DetailPane />
    </div>
  )
}
