/**
 * @jest-environment jsdom
 */

import {createRecord} from "@brimdata/zed-js"
import initTestStore from "src/test/unit/helpers/initTestStore"
import Tabs from "../Tabs"
import chart from "./"
import {Store} from "../types"
import dispatchAll from "src/test/unit/helpers/dispatchAll"

let store: Store, tabId: string
beforeEach(async () => {
  store = await initTestStore()
  tabId = Tabs.getActive(store.getState())
})

const records = [
  createRecord({ts: new Date(0), _path: "conn", count: 500}),
  createRecord({ts: new Date(100 * 1000), _path: "dns", count: 300}),
]

test("set search key", () => {
  const state = dispatchAll(store, [chart.setSearchKey(tabId, "testKey")])

  expect(chart.getSearchKey(state)).toBe("testKey")
})

test("chart records append", () => {
  store.dispatch(chart.setRecords(tabId, records))

  expect(chart.getData(store.getState())).toEqual({
    keys: ["conn", "dns"],
    table: {"0": {conn: 500}, "100000": {dns: 300}},
  })
})

test("chart records status", () => {
  const state = dispatchAll(store, [chart.setStatus(tabId, "SUCCESS")])

  expect(chart.getStatus(state)).toBe("SUCCESS")
})

test("chart records clear", () => {
  const state = dispatchAll(store, [
    chart.setRecords(tabId, records),
    chart.setStatus(tabId, "SUCCESS"),
    chart.clear(tabId),
  ])

  expect(chart.getStatus(state)).toBe("INIT")
  expect(chart.getData(state)).toEqual({keys: [], table: {}})
})
