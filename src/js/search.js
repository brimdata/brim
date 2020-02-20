/* @flow */
import "regenerator-runtime/runtime"

import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import GlobalContext from "./state/GlobalContext"
import View from "./state/View"
import init from "./initializers"
import initGlobalStore from "./initializers/initGlobalStore"
import invoke from "./electron/ipc/invoke"
import ipc from "./electron/ipc"
import lib from "./lib"

const store = init()

store.dispatch(View.setIsIngesting(true))
invoke(ipc.zqd.subscribe()).then(() => {
  store.dispatch(View.setIsIngesting(false))
})

initGlobalStore().then((globalStore) => {
  ReactDOM.render(
    <AppErrorBoundary dispatch={store.dispatch}>
      <Provider store={globalStore} context={GlobalContext}>
        <Provider store={store}>
          <App />
        </Provider>
      </Provider>
    </AppErrorBoundary>,
    lib.doc.id("app-root")
  )
})
