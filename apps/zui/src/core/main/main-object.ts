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
import {encodeSessionState} from "../../electron/session-state"
import {WindowManager} from "../../electron/windows/window-manager"
import * as zdeps from "../../electron/zdeps"
import {MainArgs, mainDefaults} from "../../electron/run-main/args"
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
import {DefaultLake} from "src/models/default-lake"
import {DomainModel} from "../domain-model"
import {AppState} from "src/electron/app-state"

export class MainObject {
  public isQuitting = false
  abortables = new Abortables()
  emitter = new EventEmitter()
  lake: ElectronZedLake

  static async boot(params: Partial<MainArgs> = {}) {
    const args = {...mainDefaults(), ...params}
    const appState = new AppState({
      path: args.appState,
      backupDir: args.backupDir,
    })
    const data = appState.data
    const windows = new WindowManager(data)
    const store = createMainStore(data?.globalState)
    DomainModel.store = store
    const appMeta = await getAppMeta()
    return new MainObject(windows, store, appState, args, appMeta)
  }

  // Only call this from boot
  constructor(
    readonly windows: WindowManager,
    readonly store: ReduxStore<State, any>,
    readonly appState: AppState,
    readonly args: MainArgs,
    readonly appMeta: AppMeta
  ) {
    this.lake = this.initLake()
  }

  async stopLake() {
    const result = await this.lake.stop()
    if (result) {
      log.info("Lake stopped:", this.lake.asJSON())
    } else {
      log.error("Failed to stop lake: ", this.lake.asJSON())
    }
    return result
  }

  startLake() {
    this.lake = this.initLake()
    const result = this.lake.start()
    if (result) {
      log.info("Lake started:", this.lake.asJSON())
    } else {
      log.error("Failed to start lake:", this.lake.asJSON())
    }
    return result
  }

  initLake() {
    return new ElectronZedLake({
      root: this.args.lakeRoot,
      addr: DefaultLake.listenAddr,
      port: this.args.lakePort,
      logs: this.args.lakeLogs,
      bin: zdeps.superdb,
      corsOrigins: ["*"],
    })
  }

  async start() {
    if (this.args.lake) await this.startLake()
    await this.windows.init()
  }

  async stop() {
    await this.abortables.abortAll()
    await this.stopLake()
  }

  async resetState() {
    // clear keys from secrets storage
    Lakes.all(this.store.getState()).forEach((l) => {
      if (l.authType !== "auth0") return
      keytar.deletePassword(toRefreshTokenKey(l.id), os.userInfo().username)
      keytar.deletePassword(toAccessTokenKey(l.id), os.userInfo().username)
    })
    await this.appState.reset()
    app.relaunch()
    app.exit(0)
  }

  saveSession() {
    this.appState.save(this.appStateData)
  }

  get appStateData() {
    const windowState = this.windows.serialize()
    const mainState = getPersistedGlobalState(this.store.getState())
    return encodeSessionState(windowState, mainState)
  }

  onBeforeQuit() {
    if (this.isQuitting) return
    zui.app.emit("quit")
    this.saveSession()
    this.isQuitting = true
  }

  openUrl(uri: string) {
    // This is written to handle an auth0 url
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
    const lake = Lakes.getDefaultLake(port)
    return this.createClient(lake.id)
  }
}
