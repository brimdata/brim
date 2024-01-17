import {invoke} from "lodash"
import React, {useEffect, useState} from "react"
import {AppProvider} from "src/app/core/context"
import AppWindowRouter from "src/app/router/app-window-router"
import LogDetailsWindow from "src/js/components/LogDetailsWindow"
import {Modals} from "src/js/components/Modals"
import {Tooltip} from "src/components/tooltip"
import initialize from "src/js/initializers/initialize"
import TabHistories from "src/js/state/TabHistories"
import Tabs from "src/js/state/Tabs"
import {getPersistedWindowState} from "src/js/state/stores/get-persistable"

export default function DetailPage() {
  const [app, setApp] = useState(null)

  useEffect(() => {
    initialize().then((vars) => {
      vars.store.dispatch(Tabs.create()) // Make a "tab" so that selectors work
      window.onbeforeunload = () => {
        vars.api.abortables.abortAll()
        vars.store.dispatch(TabHistories.save(global.tabHistories.serialize()))
        invoke(
          "autosaveOp",
          global.windowId,
          getPersistedWindowState(vars.store.getState())
        )
      }
      setApp(vars)
    })
  }, [])

  if (!app) return null

  return (
    <AppProvider store={app.store} api={app.api}>
      <AppWindowRouter>
        <LogDetailsWindow />
        <Modals />
        <Tooltip />
      </AppWindowRouter>
    </AppProvider>
  )
}
