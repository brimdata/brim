import {ModalName} from "../../state/Modal/types"
import {RefAttributes} from "react"
import * as React from "react"

export type ModalButton = {
  label: string
  click: Function
  icon?: React.ReactNode
  disabled?: boolean
}
export type ModalButtonTemplate = void | string | ModalButton[]
export type ModalBoxProps = {
  children: any
  title: string
  name: ModalName
  className?: string
  buttons: ModalButtonTemplate
  onClose?: Function
}

export type ModalContentsProps = {
  children: any
  title: string
  className?: string
  buttons: ModalButtonTemplate
  onClose?: Function
} & RefAttributes<HTMLDivElement>
