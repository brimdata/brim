import createTestBrim from "itest/lib/createTestBrim"
import {currentPoolItem} from "src/js/test/locators"

describe("deleting a pool", () => {
  const brim = createTestBrim("delete-pool.test")

  test("delete a pool that is open", async () => {
    await brim.ingest("sample.zng")
    await brim.rightClick(currentPoolItem)
    await brim.clickContextMenuItem("Delete")
    await brim.hook("pool-deleted")
  })
})
