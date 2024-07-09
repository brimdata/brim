import React, {useMemo} from "react"
import VersionItem from "./version-item"
import {Tree} from "react-arborist"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {QueryModel} from "src/js/models/query-model"
import {EmptyText} from "src/components/empty-text"
import {FillFlexParent} from "src/components/fill-flex-parent"
import {TREE_ITEM_HEIGHT} from "../sidebar/item"
import {NamedQueries} from "src/domain/handlers"

const EmptyMessage = () => {
  return <EmptyText>Open a saved query to see the previous versions.</EmptyText>
}

const VersionsSection = () => {
  const active = useSelector(Current.getActiveQuery)
  if (active.isAnonymous()) {
    return <EmptyMessage />
  } else {
    return <VersionsList query={active.query} />
  }
}

const VersionsList = ({query}: {query: QueryModel}) => {
  const data = useMemo(() => {
    return query.versions
      .map((v) => ({...v, id: v.version}))
      .sort((a, b) => (a.ts < b.ts ? 1 : -1))
  }, [query])

  const currentId = useSelector(Current.getVersion)?.version ?? null
  return (
    <FillFlexParent>
      {(dimens) => {
        return (
          <Tree
            {...dimens}
            disableDrag
            indent={16}
            rowHeight={TREE_ITEM_HEIGHT}
            padding={8}
            data={data}
            selection={currentId}
            onActivate={(node) => NamedQueries.show(query.id, node.id)}
          >
            {VersionItem}
          </Tree>
        )
      }}
    </FillFlexParent>
  )
}

export default VersionsSection
