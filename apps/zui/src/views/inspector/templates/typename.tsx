import React from "react"

export function typename(name: string) {
  console.log("Here is the name value: " + name)
  return [
    <span key="alias-1" className="zed-syntax">
      {" "}
      (
    </span>,
    <span key="alias-2" className="zed-annotation">
      {name}
    </span>,
    <span key="alias-3" className="zed-syntax">
      )
    </span>,
  ]
}
