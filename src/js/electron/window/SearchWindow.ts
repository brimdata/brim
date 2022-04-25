import {BrowserWindow, ipcMain, screen} from "electron"
import randomHash from "../../brim/randomHash"
import {BrimWindow, WindowName} from "../tron/window-manager"
import {Dimens, getWindowDimens} from "./dimens"
import {enable} from "@electron/remote/main"
import env from "src/app/core/env"

const DEFAULT_DIMENS = {
  x: undefined,
  y: undefined,
  width: 1250,
  height: 750,
}

const getDisplays = () => screen.getAllDisplays().map((s) => s.workArea)

export class SearchWindow implements BrimWindow {
  name: WindowName = "search"
  id: string
  ref: BrowserWindow
  lastFocused: number
  initialState: any
  query: object | undefined

  constructor(
    dimens: Partial<Dimens>,
    query: object | undefined,
    initialState: object | undefined,
    id: string, // to be removed later, we'll generate our own
    screens: Electron.Rectangle[] = getDisplays()
  ) {
    this.id = id
    this.initialState = initialState
    this.query = query
    this.touchLastFocused()
    this.ref = new BrowserWindow({
      ...getWindowDimens(dimens, DEFAULT_DIMENS, screens),
      titleBarStyle: env.isMac ? "hidden" : undefined,
      resizable: true,
      minWidth: 480,
      minHeight: 100,
      webPreferences: {
        nodeIntegration: true,
        experimentalFeatures: true,
        contextIsolation: false,
      },
    })
    enable(this.ref.webContents)
    this.ref.on("focus", () => {
      this.touchLastFocused()
    })
    this.ref.on("close", async (e: any) => {
      e.preventDefault()
      if (await this.confirmClose()) {
        await this.prepareClose()
        this.close()
      }
    })
  }

  async load() {
    await this.ref.loadFile("search.html", {
      query: {...this.query, id: this.id},
    })
  }

  touchLastFocused() {
    this.lastFocused = new Date().getTime()
  }

  getDimens(): Dimens {
    const [width, height] = this.ref.getSize()
    const [x, y] = this.ref.getPosition()
    return {x, y, width, height}
  }

  async serialize() {
    this.initialState = await this.getStateFromWebContents()
    return {
      id: this.id,
      name: this.name,
      lastFocused: this.lastFocused,
      position: this.ref.getPosition() as [number, number],
      size: this.ref.getSize() as [number, number],
      state: this.initialState,
    }
  }

  getStateFromWebContents() {
    const replyChannel = randomHash()
    return new Promise((resolve, reject) => {
      const safety = setTimeout(() => reject(new Error("Timeout")), 1000)
      this.ref.webContents.send("getState", replyChannel)
      ipcMain.once(replyChannel, (event, state) => {
        clearTimeout(safety)
        resolve(state)
      })
    }).finally(() => ipcMain.removeAllListeners(replyChannel))
  }

  async confirmClose() {
    const replyChannel = randomHash()
    return new Promise<boolean>((resolve) => {
      this.ref.webContents.send("confirmClose", replyChannel)
      ipcMain.once(replyChannel, (e, confirmed: boolean) => resolve(confirmed))
    })
  }

  async prepareClose() {
    const replyChannel = randomHash()
    return new Promise<void>((resolve) => {
      this.ref.webContents.send("prepareClose", replyChannel)
      ipcMain.once(replyChannel, () => resolve())
    })
  }

  close() {
    this.ref.destroy()
  }
}
