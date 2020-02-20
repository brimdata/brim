/* @flow */
import type {WindowName} from "../tron/windowManager"
import type {WindowParams} from "../tron/window"

export type IpcMsg =
  | WindowsRedirectMsg
  | WindowsCloseMsg
  | ZqdIngestMsg
  | ZqdInfoMsg
  | ZqdSubscribeMsg
  | GlobalStoreInitMsg
  | GlobalStoreDispatchMsg

export type WindowsRedirectMsg = {
  channel: "windows:redirect",
  name: WindowName,
  params: WindowParams
}

export type WindowsCloseMsg = {
  channel: "windows:close"
}

export type ZqdIngestMsg = {
  channel: "zqd:ingest",
  space: string,
  paths: string[]
}

export type ZqdInfoMsg = {
  channel: "zqd:info"
}

export type ZqdSubscribeMsg = {
  channel: "zqd:subscribe"
}

export type GlobalStoreInitMsg = {
  channel: "globalStore:init"
}

export type GlobalStoreDispatchMsg = {
  channel: "globalStore:dispatch"
}
