import {LoadFormat} from "@brimdata/zed-js"
import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import LoadDataForm from "src/js/state/LoadDataForm"

export type LoadFormState = ReturnType<typeof useLoadFormState>
export function useLoadFormState() {
  const dispatch = useDispatch()
  const pools = useSelector(Current.getPools)
  const lake = useSelector(Current.getLake)
  const files = useSelector(LoadDataForm.getFiles)
  const poolId = useSelector(LoadDataForm.getPoolId) || "new"
  const format = useSelector(LoadDataForm.getFormat)
  const defaultUser = globalThis.appMeta.userName
  const defaultMessage = "Import from SuperDB Desktop"
  const [error, setError] = useState(null)
  const newPool = poolId === "new"

  return {
    files,
    addFiles: (paths: string[]) => dispatch(LoadDataForm.addFiles(paths)),
    setFiles: (paths: string[]) => dispatch(LoadDataForm.setFiles(paths)),
    format,
    setFormat: (f: LoadFormat) => dispatch(LoadDataForm.setFormat(f)),
    pools,
    lake,
    poolId: poolId || "new",
    setPoolId: (id: string) => dispatch(LoadDataForm.setPoolId(id)),
    newPool,
    defaultUser,
    defaultMessage,
    error,
    setError,
  }
}
