import {execSync} from "child_process"
import {join} from "path"
import data from "test/shared/data"
import {TypeValue} from "./zed"
import {ZedContext} from "./zed/context"

function zq(q, file) {
  const zed = join(__dirname, "../zdeps/zed")
  const cmd = `${zed} query -f zjson "${q}" ${file}`
  return execSync(cmd, {encoding: "utf-8"})
    .trim()
    .split("\n")
    .map((s) => JSON.parse(s))
}
const file = data.getPath("sample.zson")

test("decode, then encode", () => {
  const input = zq("*", file)
  const ctx = new ZedContext()
  const decoded = ctx.decode(input)
  const encoded = ctx.encode(decoded)

  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("decode, then encode a fused input", () => {
  const input = zq("fuse", file)
  const ctx = new ZedContext()
  const decoded = ctx.decode(input)
  const encoded = ctx.encode(decoded)

  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i])
  }
})

test("decode, encode with type values", () => {
  const input = zq("* | count() by typeof(.) | sort count, typeof", file)
  const ctx = new ZedContext()

  expect(ctx.encode(ctx.decode(input))).toEqual(input)
})

test("types from one search are the same", () => {
  const ctx = new ZedContext()
  const groupBy = zq("* | count() by typeof(.) | sort count, typeof", file)
  const list = zq("*", file)

  const [row1] = ctx.decode(groupBy)
  const accessType = row1.get<TypeValue>("typeof").value

  const rows = ctx.decode(list)
  const accessRecords = rows.filter((r) => r.type === accessType)

  expect(accessRecords.map((r) => r.toString())).toEqual([
    "{info:Access List Example,nets:[10.1.1.0/24,10.1.2.0/24]}"
  ])
})

test("encode decode a field", () => {
  const input = zq("*", file)
  const ctx = new ZedContext()
  const records = ctx.decode(input)
  expect.assertions(238)

  records.forEach((rec) => {
    rec.flatColumns.forEach((column) => {
      const field = rec.getField(column)
      const after = ctx.decodeField(ctx.encodeField(field))
      expect(field).toEqual(after)
      expect(field.value.type === after.value.type).toBe(true)
    })
  })
})

test("encode decode a typeof value", () => {
  const input = zq("count() by typeof(this) | sort typeof", file)
  const ctx = new ZedContext()
  const records = ctx.decode(input)
  expect.assertions(36)

  records.forEach((rec) => {
    rec.flatColumns.forEach((column) => {
      const field = rec.getField(column)
      const after = ctx.decodeField(ctx.encodeField(field))
      expect(field).toEqual(after)
      expect(field.value.type === after.value.type).toBe(true)
    })
  })
})
