import styled from "styled-components"

export const Right = styled.div`
  display: flex;
`

export const Left = styled.div`
  display: flex;
`

export const PaneBody = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

export const PaneHeader = styled.header`
  user-select: none;
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  margin-top: 8px;
`

export const EmptyText = styled.p`
  padding: var(--gutter-space);
  opacity: 0.5;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`
