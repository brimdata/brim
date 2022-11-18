import BrimApi from "../api"
import initDebugGlobals from "./initDebugGlobals"
import initDOM from "./initDOM"
import initGlobals from "./initGlobals"
import initIpcListeners from "./initIpcListeners"
import initMenuActionListeners from "./initMenuActionListeners"
import initPlugins from "./initPlugins"
import initStore from "./initStore"
import initLakeParams from "./initLakeParams"
import {initAutosave} from "./initAutosave"
import {featureFlagsOp} from "../electron/ops/feature-flags-op"
import {commands} from "src/app/commands/command"
import {menus} from "src/app/menus/create-menu"

export default async function initialize() {
  const api = new BrimApi()
  const store = await initStore(api)
  api.init(store.dispatch, store.getState)

  const pluginManager = await initPlugins(api)
  global.featureFlags = await featureFlagsOp.invoke()

  initDOM()
  await initGlobals(store)
  initIpcListeners(store)
  initMenuActionListeners(store)
  initLakeParams(store)
  initDebugGlobals(store, api)
  initAutosave(store)
  commands.setContext(store, api)
  menus.setContext(api)

  return {store, api, pluginManager}
}
