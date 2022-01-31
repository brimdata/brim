import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import {annotateQuery} from "./search/mod"

export const inspectSearch = (): Thunk<Promise<string>> => async (
  dispatch,
  getState
) => {
  const zealot = await dispatch(getZealot())
  const program = SearchBar.getSearchProgram(getState())
  const [from, to] = Tab.getSpan(getState())
  const poolId = Current.getPoolId(getState())

  return zealot.curl(annotateQuery(program, {from, to, poolId}), {
    format: "zson"
  })
}
