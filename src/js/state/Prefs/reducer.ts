import {PrefsAction, PrefsState} from "./types"

const init: PrefsState = {
  timeFormat: "",
  suricataRunner: "",
  suricataUpdater: "",
  zeekRunner: "",
  dataDir: ""
}

export default function reducer(
  state: PrefsState = init,
  action: PrefsAction
): PrefsState {
  switch (action.type) {
    case "$PREFS_TIME_FORMAT_SET":
      return {
        ...state,
        timeFormat: action.format
      }
    case "$PREFS_SURICATA_RUNNER_SET":
      return {
        ...state,
        suricataRunner: action.suricataRunner
      }
    case "$PREFS_SURICATA_UPDATER_SET":
      return {
        ...state,
        suricataUpdater: action.suricataUpdater
      }
    case "$PREFS_ZEEK_RUNNER_SET":
      return {
        ...state,
        zeekRunner: action.zeekRunner
      }
    case "$PREFS_DATA_DIR_SET":
      return {
        ...state,
        dataDir: action.dataDir
      }
    default:
      return state
  }
}
