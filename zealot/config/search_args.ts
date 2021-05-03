import {SearchArgs} from "../types"

export function getDefaultSearchArgs(): SearchArgs {
  return {
    from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days
    to: new Date(),
    poolId: "default",
    format: "zjson",
    controlMessages: true,
    enhancers: []
  }
}
