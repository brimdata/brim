import React from "react"
import TabBar from "src/js/components/TabBar/TabBar"
import {Sidebar} from "src/views/sidebar"
import {AppModals} from "./app-modals"
import {MainArea} from "./main-area"
import {AppGrid} from "./app-grid"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {DataDropzone} from "./data-dropzone"
import RightPane from "src/views/right-pane"

export default function AppWrapper({children}) {
  const lakeId = useLakeId()
  return (
    <DataDropzone>
      <AppGrid>
        <TabBar key={lakeId} />
        <Sidebar />
        <MainArea>{children}</MainArea>
        <RightPane />
        <AppModals />
      </AppGrid>
    </DataDropzone>
  )
}
