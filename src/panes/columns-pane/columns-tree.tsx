import React from "react"
import {columnListItemMenu} from "src/app/menus/column-list-item-menu"
import {ListItem} from "src/components/list-item"
import {ZedColumn} from "src/components/zed-table/column"
import {NodeRendererProps, Tree} from "react-arborist"
import {useResultsContext} from "src/app/query-home"
import {FillFlexParent} from "src/components/fill-flex-parent"
import classNames from "classnames"
import {Help} from "src/components/help"
import styled from "styled-components"

function Node(props: NodeRendererProps<ZedColumn>) {
  const {node} = props
  const column = node.data
  const menu = columnListItemMenu.build(column)

  return (
    <ListItem
      className={classNames({"columns-tree__item--hidden": !column.isVisible})}
      innerRef={props.dragHandle}
      indent={node.level}
      isOpen={node.isOpen}
      canToggle={column.isRecordType}
      onToggle={() => {
        node.isOpen ? column.collapse() : column.expand()
        node.toggle()
      }}
      menu={menu}
    >
      {column.name}
      <code
        className={classNames("columns-tree__type", getClassName(column.type))}
      >
        {"<" + getType(column.type) + ">"}
      </code>
    </ListItem>
  )
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export function ColumnsTree() {
  const {table} = useResultsContext()
  if (!table)
    return (
      <Wrap>
        <Help>Columns are shown in the table view.</Help>
      </Wrap>
    )

  return (
    <FillFlexParent>
      {({width, height}) => {
        return (
          <Tree
            className="columns-tree"
            rowHeight={28}
            width={width}
            height={height}
            data={table.baseColumns}
            openByDefault={false}
            initialOpenState={table.args.columnExpandedState.value}
            disableDrag
            disableDrop
            padding={10}
          >
            {Node}
          </Tree>
        )
      }}
    </FillFlexParent>
  )
}

function getClassName(type) {
  if (type.kind === "primitive") return "zed-" + type.name
  else return "zed-container"
}

function getType(type) {
  if (type.kind === "primitive") return type.name
  else return type.kind
}
