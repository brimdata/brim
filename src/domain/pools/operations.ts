import {createOperation} from "src/core/operations"

import {CreatePoolOpts, LoadOpts} from "@brimdata/zed-js"
import {lake} from "src/zui"

export const create = createOperation(
  "pools.create",
  async (
    {main},
    lakeId: string,
    name: string,
    opts: Partial<CreatePoolOpts>
  ) => {
    const client = await main.createClient(lakeId)
    const {pool} = await client.createPool(name, opts)
    return pool.id as string
  }
)

export const update = createOperation(
  "pools.update",
  async ({main}, lakeId, update) => {
    const client = await main.createClient(lakeId)
    for (let {id, changes} of Array.isArray(update) ? update : [update]) {
      await client.updatePool(id, changes)
    }
  }
)

export const load = createOperation(
  "pools.load",
  async (_, poolId: string, data: string, options: Partial<LoadOpts>) => {
    return lake.client.load(data, {
      pool: poolId,
      ...options,
    })
  }
)
