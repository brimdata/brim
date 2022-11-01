import BrimApi from "src/js/api"
import brim from "src/js/brim"

export function activate(api: BrimApi) {
  api.configs.add({
    name: "pools",
    title: "Pools",
    properties: {
      nameDelimeter: {
        name: "nameDelimeter",
        label: "Group Pools By",
        type: "string",
        defaultValue: "/",
      },
    },
  })
  api.configs.add({
    name: "display",
    title: "Display",
    properties: {
      timeZone: {
        name: "timeZone",
        label: "Timezone",
        type: "string",
        defaultValue: "UTC",
        enum: brim.time.getZoneNames(),
      },
      timeFormat: {
        name: "timeFormat",
        label: "Time Format",
        type: "string",
        defaultValue: "",
        helpLink: {
          label: "docs",
          url: "https://momentjs.com/docs/#/displaying/format/",
        },
      },
      thousandsSeparator: {
        name: "thousandsSeparator",
        label: "Thousands Separator",
        type: "string",
        defaultValue: ",",
      },
      decimal: {
        name: "decimal",
        label: "Decimal",
        type: "string",
        defaultValue: ".",
      },
    },
  })
}

export function deactivate() {}
