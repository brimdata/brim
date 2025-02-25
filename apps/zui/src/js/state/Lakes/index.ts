import {reducer, actions} from "./reducer"
import selectors from "./selectors"
import {LakeAttrs} from "./types"

const getDefaultLake = (port: string): LakeAttrs => {
  return {
    host: "http://localhost",
    port,
    id: `localhost:${port}`,
    name: `Local Server`,
    authType: "none",
  }
}

export default {
  ...actions,
  ...selectors,
  getDefaultLake,
  reducer,
}
