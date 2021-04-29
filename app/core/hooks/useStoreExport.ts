/*
useStoreExport listens to redux store state changes and 'exports' that data via brim-commands
 */
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import LogDetails from "src/js/state/LogDetails"
import Viewer from "src/js/state/Viewer"
import {executeCommand} from "../../../src/js/flows/executeCommand"

const useStoreExport = () => {
  const currentData = useSelector(LogDetails.build)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(executeCommand("data-detail:current", currentData?.serialize()))
  }, [currentData])

  const selectedData = useSelector(Viewer.getSelectedRecords)
  useEffect(() => {
    dispatch(
      executeCommand(
        "data-detail:selected",
        selectedData.length > 0 ? selectedData[0] : null
      )
    )
  }, [selectedData])
}

export default useStoreExport
