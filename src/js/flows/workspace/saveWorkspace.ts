import tabHistory from "app/router/tab-history"
import {BrimWorkspace} from "../../brim"
import Lakes from "../../state/Lakes"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import {WorkspaceStatus} from "../../state/WorkspaceStatuses/types"
import refreshPoolNames from "../refreshPoolNames"

export const saveWorkspace = (ws: BrimWorkspace, status: WorkspaceStatus) => (
  dispatch,
  _gs
): void => {
  dispatch(Lakes.add(ws.serialize()))
  dispatch(WorkspaceStatuses.set(ws.id, status))
  dispatch(Lakes.add(ws.serialize()))
  dispatch(tabHistory.push(`/workspaces/${ws.id}`))
  dispatch(refreshPoolNames())
}
