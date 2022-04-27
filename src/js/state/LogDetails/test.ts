/**
 * @jest-environment jsdom
 */

import {createRecord} from "src/test/shared/factories/zed-factory"
import initTestStore from "src/test/unit/helpers/initTestStore"
import LogDetails from "./"

const record = createRecord({_td: "1", letter: "a"})
const record2 = createRecord({_td: "1", letter: "b"})
const record3 = createRecord({_td: "1", letter: "c"})

let store
beforeEach(() => {
  store = initTestStore()
})

test("viewing a log detail", () => {
  const state = store.dispatchAll([LogDetails.push(record)])
  const log = LogDetails.build(state)

  expect(log && log.get("letter").toString()).toEqual("a")
})

test("viewing 2 logs", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
  ])

  const log = LogDetails.build(state)
  expect(log && log.get("letter").toString()).toBe("b")
})

test("going back to the first log", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
    LogDetails.back(),
  ])

  const log = LogDetails.build(state)
  expect(log && log.get("letter").toString()).toBe("a")
})

test("going back and then forward", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
    LogDetails.back(),
    LogDetails.forward(),
  ])

  const log = LogDetails.build(state)
  expect(log && log.get("letter").toString()).toBe("b")
})

test("going back, then push, then back", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
    LogDetails.back(),
    LogDetails.push(record3),
    LogDetails.back(),
  ])

  expect(LogDetails.build(state).get("letter").toString()).toBe("a")
})

test("updating the current log detail", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.updateUidLogs([record, record2]),
  ])

  expect(LogDetails.getUidLogs(state)).toEqual([record, record2])
  const log = LogDetails.build(state)
  expect(log && log.get("letter").toString()).toBe("a")

  store.dispatch(LogDetails.updateUidStatus("FETCHING"))

  expect(LogDetails.getUidStatus(store.getState())).toBe("FETCHING")
})
