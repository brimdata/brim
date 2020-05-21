/* @flow */
import {useEffect} from "react"

import {ipcRenderer} from "electron"

export default function useIpcListener(
  channel: string,
  func: Function,
  deps?: *[]
) {
  useEffect(() => {
    ipcRenderer.on(channel, func)
    return () => ipcRenderer.removeListener(channel, func)
  }, deps)
}
