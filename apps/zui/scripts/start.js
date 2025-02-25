import sub  from "./util/sub.js"
import log  from "./util/log.js"
import fs from "fs-extra"

async function start() {
  fs.removeSync("dist")
  const electronArgs = process.argv.splice(2).join(" ")
  log("Compiling...")
  const main = sub("yarn", `start:main`)
  const renderer = sub("yarn", `start:renderer`)
  await Promise.all([
    main.waitForOutput(/watching for changes/),
    renderer.waitForOutput(/started server on/),
  ])
  log("Launching...")
  sub("yarn", `start:electron ${electronArgs}`).p.on("exit", () => {
    main.kill()
    renderer.kill()
  })
}

process.on("SIGINT", () => process.exit(0))
try {
  await start()
} catch (e) {
  console.error(e)
  process.exit(1)
}
