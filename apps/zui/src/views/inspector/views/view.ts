import * as zed from "@brimdata/zed-js"
import {ReactNode} from "react"
import {zedTypeClassName} from "src/components/zed-type-class-name"
import {field} from "../templates/field"
import {InspectArgs, RenderMode} from "../types"

export class View<T = any> {
  static when(_args: InspectArgs) {
    return true
  }

  constructor(public args: InspectArgs) {}

  get ctx() {
    return this.args.ctx
  }

  get value(): T {
    return this.args.value as unknown as T
  }

  get type() {
    return this.args.type
  }

  get key() {
    return this.args.key
  }

  get id() {
    return this.args.indexPath.join(",")
  }

  get className() {
    return zedTypeClassName(this.value as any)
  }

  get showKey() {
    return !!this.args.key && !this.ctx.hideKeys
  }

  get showDecorator() {
    return !this.ctx.hideDecorators
  }

  get showSyntax() {
    return !this.ctx.hideSyntax
  }

  get isLast() {
    return this.args.last
  }

  get decorator() {
    console.log('I am in get decorator(). Here is this:')
    console.log(this)
    if (zed.isTypeAlias(this.type)) return this.type.name
    else return null
  }

  rowCount() {
    return 1
  }

  isExpanded() {
    return this.ctx.isExpanded(this.id)
  }

  render(_mode?: RenderMode): ReactNode {
    return this.value.toString()
  }

  inspect() {
    return this.ctx.push(field(this, "single"))
  }
}
