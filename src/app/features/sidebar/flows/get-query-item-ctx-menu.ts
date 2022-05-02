import {isRemoteLib, setRemoteQueries} from "./remote-queries"
import {isBrimLib} from "../../../../js/state/Queries/flows"
import Tabs from "../../../../js/state/Tabs"
import {lakeQueryPath} from "../../../router/utils/paths"
import {submitSearch} from "../../../../js/flows/submitSearch/mod"
import lib from "../../../../js/lib"
import toast from "react-hot-toast"
import {ipcRenderer, MenuItemConstructorOptions} from "electron"
import exportQueryLib from "../../../../js/flows/exportQueryLib"
import * as remote from "@electron/remote"
import {Query} from "../../../../js/state/Queries/types"
import Queries from "../../../../js/state/Queries"

const getQueryItemCtxMenu =
  ({data, tree, handlers, lakeId}) =>
  (dispatch, getState, {api}) => {
    const {value, id, isReadOnly} = data
    const isGroup = "items" in data
    const hasMultiSelected =
      tree.getSelectedIds().length > 1 &&
      !!tree.getSelectedIds().find((id) => id === data.id)
    const selected = hasMultiSelected ? tree.getSelectedIds() : [id]
    const isRemoteItem = dispatch(isRemoteLib([id]))
    const hasBrimItemSelected = dispatch(isBrimLib(selected))

    const runQuery = () => {
      dispatch(Tabs.activateUrl(lakeQueryPath(id, lakeId)))
      dispatch(submitSearch())
    }

    const handleDelete = () => {
      const selected = Array.from(new Set([...tree.getSelectedIds(), data.id]))
      return remote.dialog
        .showMessageBox({
          type: "warning",
          title: "Confirm Delete Query Window",
          message: `Are you sure you want to delete the ${
            hasMultiSelected ? selected.length : ""
          } selected item${hasMultiSelected ? "s" : ""}?`,
          buttons: ["OK", "Cancel"],
        })
        .then(({response}) => {
          if (response === 0) {
            if (isRemoteItem) {
              const remoteQueries = selected.map<Query>((id) => ({
                id,
                value: "",
                name: "",
                pins: {from: "", filters: []},
              }))
              dispatch(setRemoteQueries(remoteQueries, true))
              return
            }

            dispatch(Queries.removeItems(selected))
          }
        })
    }

    if (hasMultiSelected)
      return [
        {
          label: "Delete Selected",
          click: handleDelete,
        },
      ]

    return [
      {
        label: "Run Query",
        visible: !isGroup,
        click: () => runQuery(),
      },
      {
        label: "Copy Query",
        visible: !isGroup,
        click: () => {
          lib.doc.copyToClipboard(value)
          toast("Query copied to clipboard")
        },
      },
      {
        label: "Export Folder as JSON",
        visible: isGroup,
        click: async () => {
          const {canceled, filePath} = await ipcRenderer.invoke(
            "windows:showSaveDialog",
            {
              title: `Save Queries Folder as JSON`,
              buttonLabel: "Export",
              defaultPath: `${data.name}.json`,
              properties: ["createDirectory"],
              showsTagField: false,
            }
          )
          if (canceled) return
          toast.promise(
            dispatch(exportQueryLib(filePath, api.exportQueries(id))),
            {
              loading: "Exporting Queries...",
              success: "Export Complete",
              error: "Error Exporting Queries",
            }
          )
        },
      },
      {type: "separator"},
      {
        label: "Rename",
        enabled: !isReadOnly && !hasBrimItemSelected,
        click: () => handlers.edit(),
      },
      {type: "separator"},
      {
        label: "Delete",
        enabled: !hasBrimItemSelected,
        click: handleDelete,
      },
    ] as MenuItemConstructorOptions[]
  }

export default getQueryItemCtxMenu
