import {app, protocol} from "electron"
import path from "path"

export function runProtocolHandlers() {
  app.whenReady().then(() => {
    protocol.interceptFileProtocol("file", (request, callback) => {
      const url = new URL(request.url)
      const rootPath = path.join(__dirname, "..", "out")
      const relPath = url.pathname
      const absPath = path.join(rootPath, relPath)
      callback(absPath)
    })
  })
}
