import {Client} from "@brimdata/zed-node"
import nodeFetch from "node-fetch"

export class ElectronZedClient extends Client {
  fetch = nodeFetch
}
