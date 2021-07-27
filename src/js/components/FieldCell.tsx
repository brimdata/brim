import {useZedFormatter} from "app/core/format"
import {typeClassNames} from "app/core/utils/type-class-names"
import classNames from "classnames"
import React from "react"
import {zed} from "zealot"

type Props = {field: zed.Field; record: zed.Record}

function getBackground(field, record) {
  if (field.name === "event_type" && field.data.toString() === "alert") {
    const severity = record.try("alert.severity")?.toString()
    return `alert-${severity}-bg-color`
  }
  if (field.name === "_path") {
    return `${field.data.toString()}-bg-color`
  }
}

export default function FieldCell({field, record}: Props) {
  const format = useZedFormatter()
  return (
    <div
      className={classNames(
        "field-cell",
        field.name,
        typeClassNames(field.data),
        getBackground(field, record)
      )}
    >
      {format(field.data as zed.Primitive)}
    </div>
  )
}
