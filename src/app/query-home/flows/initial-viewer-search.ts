import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import Viewer from "src/js/state/Viewer"
import Tabs from "src/js/state/Tabs"
import {viewerSearch} from "./viewer-search"
import {Thunk} from "src/js/state/types"
import Current from "src/js/state/Current"

/**
 * Initial search to fill the viewer, as opposed to the "next-page"
 * search which allows for the inifinite scroll behavior.
 */

const initialViewerSearch = (): Thunk<any> => (dispatch, getState) => {
  const query = Current.getQuery(getState())
  if (!query) return
  const perPage = query.hasAnalytics() ? ANALYTIC_MAX_RESULTS : PER_PAGE
  if (query.hasHeadFilter) query.addFilterPin(`| head ${perPage}`)
  const tabId = Tabs.getActive(getState())
  const history = global.tabHistories.get(tabId)
  const {key} = history.location
  dispatch(Viewer.setSearchKey(tabId, key))

  return dispatch(viewerSearch({query}))
}

export default initialViewerSearch
