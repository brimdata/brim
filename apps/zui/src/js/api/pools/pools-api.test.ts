/**
 * @jest-environment jsdom
 */

import {renameGroup} from "src/app/commands/pools"
import {SystemTest} from "src/test/system"
import {PoolsApi} from "./pools-api"

const system = new SystemTest("pools-api")
let pools: PoolsApi

beforeEach(() => {
  pools = system.api.pools
})

// test("rename pool", async () => {
//   const id = await pools.create("backups/2022/jan")
//   await pools.update({
//     id,
//     changes: {name: "backups / 2023 / jan"},
//   })
//   expect(pools.find(id).name).toEqual("backups / 2023 / jan")
// })

test("rename group", async () => {
  for (let pool of pools.all) await pools.delete(pool.id)

  await pools.create("backups/2022/jan")
  await pools.create("backups/ 2022/ feb")
  await pools.create("backups/ 2022 / march")
  await pools.create("backups/2022 / april")
  await pools.create("staging/web / metrics")
  await pools.create("production /web / metrics")
  await pools.create("production/native / logs")
  await pools.create("root")

  await renameGroup.run(["backups", "2022"], "2023")
  await renameGroup.run(["production"], "prod")

  expect(pools.all.map((p) => p.name)).toEqual([
    "backups/ 2023 / march",
    "backups/ 2023/ feb",
    "backups/2023 / april",
    "backups/2023/jan",
    "prod /web / metrics",
    "prod/native / logs",
    "root",
    "staging/web / metrics",
  ])
})
