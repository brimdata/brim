import {
  lakeImportPath,
  lakeQueryPath,
  lakesPath,
} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import {newDraftQuery} from "src/app/query-home/flows/new-draft-query"

export const newTab = (): Thunk => (dispatch, getState) => {
  const lakeId = Current.getLakeId(getState())
  const poolIds = Pools.ids(lakeId)(getState())
  let url: string
  if (!lakeId) {
    url = lakesPath()
  } else if (poolIds.length === 0) {
    url = lakeImportPath(lakeId)
  } else {
    url = lakeQueryPath(dispatch(newDraftQuery()).id, lakeId)
  }
  dispatch(Tabs.create(url))
}
