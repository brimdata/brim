import {parse as parseAst} from "zed/compiler/parser/parser"
import {fieldExprToName} from "src/js/models/ast"
import {toFieldPath} from "src/js/zed-script/toZedScript"

export class ZedAst {
  public tree: any

  constructor(public script: string) {
    this.tree = parseAst(script)
  }

  get poolName() {
    const from = this.from
    if (!from) return null
    const trunk = from.trunks.find((t) => t.source.kind === "Pool")
    if (!trunk) return null
    const name = trunk.source.spec.pool?.text
    if (!name) return null
    return name
  }

  get from() {
    return this.ops.find((o) => o.kind === "From")
  }

  get pools() {
    const trunks = this.from?.trunks || []
    return trunks.filter((t) => t.source.kind === "Pool").map((t) => t.source)
  }

  private _ops: any[]
  get ops() {
    if (this._ops) return this._ops
    if (!this.tree || this.tree.error) return []
    const list = []

    function collectOps(op, list) {
      if (Array.isArray(op)) {
        for (const o of op) collectOps(o, list)
        return
      }
      list.push(op)
      if (op.kind === PARALLEL_PROC) {
        for (const p of op.paths) collectOps(p, list)
      } else if (op.kind === OP_EXPR_PROC) {
        collectOps(op.expr, list)
      }
    }

    collectOps(this.tree, list)
    return (this._ops = list)
  }

  get sorts(): Record<string, "asc" | "desc"> {
    const ops = this.ops.filter((o) => o.kind === "Sort") ?? []
    let sorts = {}
    for (let op of ops) {
      if (!op.args) continue
      const name = fieldExprToName(op.args[0])
      const column = Array.isArray(name) ? name : [name]
      const fieldPath = toFieldPath(column)
      sorts[fieldPath] = op.order
    }
    return sorts
  }

  get isSummarized() {
    return !!this.ops.find((op) => op.kind === "Summarize")
  }
}

export const OP_EXPR_PROC = "OpExpr"
export const PARALLEL_PROC = "Parallel"
