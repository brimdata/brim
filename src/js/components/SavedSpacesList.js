/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import FileFill from "../icons/FileFill"
import Search from "../state/Search"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default function SavedSpacesList() {
  let dispatch = useDispatch()
  let clusterId = useSelector(Tab.clusterId)
  let spaces = useSelector(Spaces.names(clusterId))

  useEffect(() => {
    dispatch(refreshSpaceNames())
  }, [])

  function onClick(space) {
    dispatch(Search.setSpace(space))
  }

  return (
    <div className="saved-spaces-list">
      {spaces.map((s) => (
        <a onClick={() => onClick(s)} key={s} href="#">
          <FileFill />
          <span className="name">{s}</span>
          <div className="line" />
        </a>
      ))}
    </div>
  )
}
