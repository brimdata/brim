import {app} from "electron"
import keytar from "keytar"
import {EventEmitter} from "events"
import os from "os"
import {Store as ReduxStore} from "redux"
import url from "url"
import {
  deserializeState,
  toAccessTokenKey,
  toRefreshTokenKey,
} from "../auth0/utils"
import {getPersistedGlobalState} from "../../js/state/stores/get-persistable"
import Lakes from "../../js/state/Lakes"
import {installExtensions} from "../../electron/extensions"
import {
  decodeSessionState,
  encodeSessionState,
} from "../../electron/session-state"
import {WindowManager} from "../../electron/windows/window-manager"
import * as zdeps from "../../electron/zdeps"
import {MainArgs, mainDefaults} from "../../electron/run-main/args"
import createSession, {Session} from "../../electron/session"
import {getAppMeta, AppMeta} from "../../electron/meta"
import {createMainStore} from "../../js/state/stores/create-main-store"
import {AppDispatch, State} from "../../js/state/types"
import {PathName, getPath} from "../../js/api/core/get-path"
import {Lake} from "src/models/lake"
import {getAuthToken} from "../../js/api/core/get-zealot"
import {Abortables} from "src/modules/abortables"
import * as zui from "src/zui"
import log from "electron-log"
import {ElectronZedClient} from "../electron-zed-client"
import {ElectronZedLake} from "../electron-zed-lake"

export class MainObject {
  public isQuitting = false
  abortables = new Abortables()
  emitter = new EventEmitter()

  static async boot(params: Partial<MainArgs> = {}) {
    const args = {...mainDefaults(), ...params}
    const session = createSession(args.appState)
    const data = decodeSessionState(await session.load())
    const windows = new WindowManager(data)
    const store = createMainStore(data?.globalState)
    const appMeta = await getAppMeta()
    const lake = new ElectronZedLake({
      root: args.lakeRoot,
      port: args.lakePort,
      logs: args.lakeLogs,
      bin: zdeps.zed,
      corsOrigins: ["*"],
    })
    return new MainObject(lake, windows, store, session, args, appMeta)
  }

  // Only call this from boot
  constructor(
    readonly lake: ElectronZedLake,
    readonly windows: WindowManager,
    readonly store: ReduxStore<State, any>,
    readonly session: Session,
    readonly args: MainArgs,
    readonly appMeta: AppMeta
  ) {}

  async start() {
    if (this.args.lake) {
      if (!(await this.lake.start())) {
        log.error("Failed to start lake process after 5 seconds")
      }
    }
    if (this.args.devtools) await installExtensions()
    await this.windows.init()
  }

  async stop() {
    await this.abortables.abortAll()
    await this.lake.stop()
  }

  async resetState() {
    // clear keys from secrets storage
    Lakes.all(this.store.getState()).forEach((l) => {
      if (l.authType !== "auth0") return
      keytar.deletePassword(toRefreshTokenKey(l.id), os.userInfo().username)
      keytar.deletePassword(toAccessTokenKey(l.id), os.userInfo().username)
    })
    await this.session.delete()
    app.relaunch()
    app.exit(0)
  }

  saveSession() {
    const windowState = this.windows.serialize()
    const mainState = getPersistedGlobalState(this.store.getState())
    this.session.saveSync(encodeSessionState(windowState, mainState))
  }

  onBeforeQuit() {
    if (this.isQuitting) return
    zui.app.emit("quit")
    this.saveSession()
    this.isQuitting = true
  }

  openUrl(uri: string) {
    const urlParts = url.parse(uri, true)
    const {code, state, error, error_description} = urlParts.query as {
      [key: string]: string
    }
    const {lakeId, windowId} = deserializeState(state)
    const win = this.windows.find(windowId)
    if (!win) {
      console.error("No Window Found")
    } else {
      win.ref.focus()
      win.ref.webContents.send("windows:authCallback", {
        code,
        lakeId,
        error,
        errorDesc: error_description,
      })
    }
  }

  get dispatch() {
    return this.store.dispatch as AppDispatch
  }

  getPath(name: PathName) {
    return getPath(name)
  }

  async createClient(lakeId: string) {
    const lakeData = Lakes.id(lakeId)(this.store.getState())
    const lake = new Lake(lakeData)
    const auth = await this.dispatch(getAuthToken(lake))
    return new ElectronZedClient(lake.getAddress(), {auth})
  }

  async createDefaultClient() {
    const port = this.args.lakePort
    const user = this.appMeta.userName
    const lake = Lakes.getDefaultLake(port, user)
    return this.createClient(lake.id)
  }
}
