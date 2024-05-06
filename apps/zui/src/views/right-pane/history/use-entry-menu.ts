import {useDispatch} from "react-redux"
import useSelect from "src/util/hooks/use-select"
import {showContextMenu} from "src/core/menu"
import Current from "src/js/state/Current"
import SessionHistories from "src/js/state/SessionHistories"

export function useEntryMenu(index: number) {
  const dispatch = useDispatch()
  const select = useSelect()

  function onContextMenu() {
    const sessionId = select(Current.getSessionId)
    showContextMenu([
      {
        label: "Remove",
        click: () => {
          dispatch(SessionHistories.deleteEntry({sessionId, index}))
        },
      },
    ])
  }

  return onContextMenu
}
