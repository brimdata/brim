import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {getQuerySource} from "../flows/get-query-source"
import {updateQuery} from "../flows/update-query"
import useEnterKey from "../../../js/components/hooks/useEnterKey"
import {AppDispatch} from "../../../js/state/types"
import DraftQueries from "src/js/state/DraftQueries"
import Queries from "src/js/state/Queries"
import useEscapeKey from "../../../js/components/hooks/useEscapeKey"
import {lakeQueryPath} from "../../router/utils/paths"
import tabHistory from "../../router/tab-history"
import Icon from "../../core/icon-temp"
import SearchBar from "src/js/state/SearchBar"
import AutosizeInput from "react-input-autosize"
import {cssVar} from "../../../js/lib/cssVar"
import BrimTooltip from "src/js/components/BrimTooltip"
import {showContextMenu} from "../../../js/lib/System"
import getQueryHeaderMenu from "./flows/get-query-header-menu"

const Row = styled.div`
  display: flex;
  align-items: center;
`

const TitleHeader = styled(Row)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 4px;
  width: 100%;
`

const StyledTitle = styled.h2<{hover: boolean}>`
  ${(props) => props.theme.typography.labelBold}
  margin: 0 0 3px 0;
  max-width: 100%;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 2px 6px;
  margin-left: -6px;
  margin-top: -2px;
  margin-bottom: 1px;

  ${(p) =>
    p.hover &&
    `
    &:hover {
      border-radius: 3px;
      background-color: var(--hover-light-bg);
    }
  `}
`
const SubTitle = styled.div<{isEnabled: boolean}>`
  ${(props) => props.theme.typography.labelNormal}
  display: flex;
  padding: 1px 6px;
  margin-left: -6px;
  margin-top: -1px;
  color: rgba(0, 0, 0, 0.5);
  text-transform: capitalize;
  ${({isEnabled}) =>
    isEnabled &&
    `
  &:hover {
    border-radius: 3px;
    background-color: var(--hover-light-bg);
  }
  `}
`

const StyledAnchor = styled.a<{isPrimary?: boolean; isIndented?: boolean}>`
  ${(props) => props.theme.typography.labelNormal}
  text-decoration: underline;
  color: ${(p) => (p.isPrimary ? "var(--havelock)" : "var(--slate)")};
  margin-left: ${(p) => (p.isIndented ? "10px" : "0")};
`

const StyledTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`

const IconChevronDown = styled(Icon).attrs({name: "chevron-down"})`
  width: 12px;
  height: 12px;
`

const StyledStatus = styled.span`
  display: flex;
  align-items: center;
  svg {
    width: 9px;
    height: 9px;
    opacity: 0.5;
    margin-right: 3px;
  }
`

const TitleInput = ({onCancel, onSubmit}) => {
  const inputRef = useRef(null)
  const query = useSelector(Current.getQuery)
  const [queryTitle, setQueryTitle] = useState(query?.name)

  const handleEdit = () => {
    if (!queryTitle) onCancel()
    else onSubmit(queryTitle)
  }

  useEnterKey(() => {
    handleEdit()
  })
  useEscapeKey(() => {
    onCancel()
  })
  useEffect(() => {
    setQueryTitle(query?.name)
  }, [query])
  useLayoutEffect(() => {
    inputRef.current && inputRef.current.select()
  }, [])

  return (
    <StyledTitleWrapper>
      <AutosizeInput
        ref={inputRef}
        onChange={(e) => setQueryTitle(e.target.value)}
        value={queryTitle || ""}
        style={{
          overflow: "hidden",
          background: cssVar("--input-background"),
          minWidth: "120px",
          borderRadius: "3px",
          padding: "2px 6px",
          margin: "-2px 0 1px -6px"
        }}
        inputStyle={{
          background: "transparent",
          margin: 0,
          padding: 0,
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: 0,
          lineHeight: "16px",
          display: "block",
          outline: "none",
          border: "none"
        }}
      />
      <StyledAnchor isPrimary isIndented onClick={handleEdit}>
        Save
      </StyledAnchor>
      <StyledAnchor isIndented onClick={onCancel}>
        Cancel
      </StyledAnchor>
    </StyledTitleWrapper>
  )
}

const QueryHeader = () => {
  const dispatch = useDispatch<AppDispatch>()
  const query = useSelector(Current.getQuery)
  const lakeId = useSelector(Current.getLakeId)
  const searchBar = useSelector(SearchBar.getSearchBar)
  const querySource = dispatch(getQuerySource(query?.id))
  const [isEditing, setIsEditing] = useState(false)
  const [isModified, setIsModified] = useState(false)

  useEffect(() => setIsEditing(false), [query?.id])
  useEffect(() => {
    if (query?.value !== searchBar.current) setIsModified(true)
    else setIsModified(false)
  }, [query, searchBar])

  const onSubmit = (newTitle) => {
    setIsEditing(false)
    if (newTitle !== "") {
      query.name = newTitle
      if (querySource === "draft") {
        dispatch(Queries.addItem(query.serialize(), "root"))
        dispatch(DraftQueries.remove({id: query.id}))
        dispatch(tabHistory.replace(lakeQueryPath(query.id, lakeId)))
      } else {
        dispatch(updateQuery(query))
      }
    }
  }

  const renderQueryStatus = () => {
    if (querySource === "draft" && !isEditing)
      return (
        <StyledAnchor isPrimary onClick={() => setIsEditing(true)}>
          Save
        </StyledAnchor>
      )
    let status = "Saved"
    if (isModified) status = "Modified"
    if (isEditing) status = "Renaming"
    if (query.isReadOnly) status = "Readonly"

    return (
      <>
        <StyledStatus>
          {query.isReadOnly && <Icon name="lock" />}
          {status}
        </StyledStatus>
        {!isEditing && <IconChevronDown />}
      </>
    )
  }

  const openMenu = () => {
    if (isEditing || querySource === "draft") return
    showContextMenu(
      dispatch(getQueryHeaderMenu({handleRename: () => setIsEditing(true)}))
    )
  }

  return (
    <TitleHeader>
      {isEditing ? (
        <TitleInput onSubmit={onSubmit} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <StyledTitle
            data-tip="query-title"
            data-for="query-title"
            data-place="bottom"
            data-effect="solid"
            data-delay-show={500}
            onClick={() => !query.isReadOnly && setIsEditing(true)}
            hover={!query.isReadOnly}
          >
            {query?.name}
          </StyledTitle>
          <BrimTooltip id="query-title" className="brim-tooltip-show-hover">
            {query?.name}
          </BrimTooltip>
        </>
      )}
      <SubTitle
        isEnabled={querySource !== "draft" && !isEditing}
        onClick={openMenu}
      >
        {querySource} &mdash;&nbsp;{renderQueryStatus()}
      </SubTitle>
    </TitleHeader>
  )
}

export default QueryHeader
