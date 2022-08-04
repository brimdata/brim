import React, {ButtonHTMLAttributes} from "react"
import Icon, {IconName} from "src/app/core/icon-temp"
import styled from "styled-components"

const Button = styled.button`
  background: white;
  border: none;
  height: 22px;
  width: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: var(--button-background);
  }
  &:active {
    background: var(--button-background-active);
  }

  &:disabled {
    opacity: 0.2;
  }
`

type Props = {
  icon: IconName
  size?: number
} & ButtonHTMLAttributes<HTMLButtonElement>

export const IconButton = React.forwardRef<HTMLButtonElement, Props>(
  function IconButton({icon, size, ...rest}: Props, ref) {
    return (
      <Button ref={ref} {...rest}>
        <Icon name={icon} size={size || 18} />
      </Button>
    )
  }
)
