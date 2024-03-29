import React, {HTMLProps} from "react"
import classNames from "classnames"
import {Icon, IconName} from "src/components/icon"
import styled from "styled-components"

type Props = {
  title: string
  removeTab: Function
  active: boolean
  preview: boolean
  isNew: boolean
  icon: IconName
} & HTMLProps<HTMLAnchorElement>

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 6px;
  margin-right: 6px;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  &:active {
    background: rgba(0, 0, 0, 0.12);
  }

  svg {
    width: 0.95rem;
    height: 0.95rem;
  }
`

const SearchTab = React.forwardRef<HTMLAnchorElement, Props>(function SearchTab(
  {icon, title, active, removeTab, isNew, preview, ...rest},
  ref
) {
  return (
    <a
      {...rest}
      ref={ref}
      role="tab"
      aria-selected={active}
      aria-controls="main-area"
      className={classNames("tab", {active, "is-new": isNew, preview})}
    >
      <div className="tab-content">
        <Icon className="icon" name={icon || "zui"} size="13px" />
        <p className="title">{title}</p>
        <CloseButton onClick={(e) => removeTab(e)} className="no-drag">
          <Icon name="close" className="no-drag" />
        </CloseButton>
      </div>
    </a>
  )
})

export default SearchTab
