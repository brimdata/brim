import {compact} from "lodash"
import isEmpty from "lodash/isEmpty"
import {getUniqName} from "../../lib/uniqName"
import time from "../time"
import FileList, {FileListData} from "./fileList"

export type IngestParams = {
  name: string
  fileListData: FileListData
}

function generateDirName(now: Date = new Date()) {
  return "pool_" + time(now).format("YYYY-MM-DD_HH:mm:ss")
}

export function getPoolName(data: FileListData, existingNames: string[]) {
  const files = new FileList(data)
  let name: string
  if (files.oneFile()) {
    name = files.first().file.name
  } else if (files.inSameDir()) {
    name = isEmpty(compact(files.paths()))
      ? files.first().file.name
      : files.dirName()
  } else name = generateDirName()

  return getUniqName(name, existingNames)
}
