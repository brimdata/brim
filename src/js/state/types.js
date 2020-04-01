/* @flow */

import {type Store as ReduxStore} from "redux"

import type {BoomdState} from "./Boomd/types"
import type {ClustersState} from "./Clusters/types"
import type {ErrorsState} from "./Errors/types"
import type {HandlersState} from "./Handlers/types"
import type {InvestigationState} from "./Investigation/types"
import type {ModalState} from "./Modal/types"
import type {NoticeState} from "./Notice/types"
import type {PacketsState} from "./Packets/types"
import type {SpacesState} from "./Spaces/types"
import type {TabsState} from "./Tabs/types"
import type {ViewState} from "./View/types"
import BoomClient from "../services/BoomClient"

export type GetState = () => State
export type Thunk = (Dispatch, GetState, BoomClient) => any
export type Dispatch = Function
export type Action = Object
export type DispatchProps = {|dispatch: Dispatch|}
export type Store = ReduxStore<State, *>

export type State = {
  handlers: HandlersState,
  clusters: ClustersState,
  errors: ErrorsState,
  spaces: SpacesState,
  boomd: BoomdState,
  view: ViewState,
  investigation: InvestigationState,
  modal: ModalState,
  notice: NoticeState,
  tabs: TabsState,
  packets: PacketsState
}
