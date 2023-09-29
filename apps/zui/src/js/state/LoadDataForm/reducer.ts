import {LoadFormat} from "@brimdata/zed-js"
import {PayloadAction, createSlice} from "@reduxjs/toolkit"
import {bounded} from "src/util/bounded"

const slice = createSlice({
  name: "LOAD_DATA_FORM",
  initialState: {
    format: "auto" as LoadFormat,
    files: [] as string[],
    shaper: "// Transform the data here before loading it.\n",
    editorSize: 200,
    sidebarSize: 360,
    resultsRatio: 0.5,
    poolId: null,
    show: false,
  },
  reducers: {
    setShow: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload
    },
    setPoolId: (state, action: PayloadAction<string>) => {
      state.poolId = action.payload
    },
    setFiles: (state, action: PayloadAction<string[]>) => {
      state.files = action.payload
    },
    addFiles: (state, action: PayloadAction<string[]>) => {
      state.files = [...state.files, ...action.payload]
    },
    setShaper: (state, action: PayloadAction<string>) => {
      state.shaper = action.payload
    },
    setEditorSize: (state, action: PayloadAction<number>) => {
      state.editorSize = bounded(action.payload, [100, Infinity])
    },
    setSidebarSize: (state, action: PayloadAction<number>) => {
      state.sidebarSize = bounded(action.payload, [100, Infinity])
    },
    setFormat: (state, action: PayloadAction<LoadFormat>) => {
      state.format = action.payload
    },
    setResultsRatio: (state, action: PayloadAction<number>) => {
      state.resultsRatio = action.payload
    },
    reset: (state) => {
      state.show = false
      state.format = "auto"
      state.files = []
      state.shaper = ""
      state.poolId = null
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
