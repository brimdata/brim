import React from "react"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import styled from "styled-components"

const Loader = styled.div`
  &,
  &:after {
    border-radius: 50%;
    width: 1em;
    height: 1em;
  }
  & {
    position: relative;
    text-indent: -9999em;
    border-top: 0.2em solid rgba(0, 0, 0, 0.1);
    border-right: 0.2em solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.2em solid rgba(0, 0, 0, 0.1);
    border-left: 0.2em solid var(--foreground-color);
    transform: translateZ(0);
    animation: load8 1.1s infinite linear;
  }
  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`

const Span = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`

export function QueryProgress() {
  const status = useSelector(Results.getStatus)
  const count = useSelector(Results.getCount)
  if (status === "FETCHING") {
    return (
      <Span>
        Fetching
        <Loader />
      </Span>
    )
  } else if (status === "COMPLETE") {
    return <span>Results: {count}</span>
  } else if (status === "INCOMPLETE") {
    return <span>Results: First {count}</span>
  } else if (status === "LIMIT") {
    return <span>Results: Limited to first {count}</span>
  }
}
