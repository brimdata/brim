import {LoadFormat} from "@brimdata/zed-js"
import {LoadContext} from "../../domain/loads/load-context"

export type LoadOptions = {
  windowId: string
  lakeId: string
  poolId: string
  branch: string
  files: string[]
  shaper: string
  format?: LoadFormat
  author: string
  body: string
}

export interface Loader {
  when(context: LoadContext): PromiseLike<boolean> | boolean
  run(context: LoadContext): PromiseLike<void> | void
  rollback(context: LoadContext): PromiseLike<void> | void
}
