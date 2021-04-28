import path from "path"

import {getUniqName} from "../../lib/uniqName"
import fileList, {FileListData} from "./fileList"
import lib from "../../lib"
import time from "../time"

export type IngestParams = {
  name: string
  dataDir: string
  fileListData: FileListData
}

export type IngestParamsError = {
  error: string
}

export default function getParams(
  data: FileListData,
  dataDir?: string,
  existingNames: string[] = [],
  now: Date = new Date()
): IngestParams | IngestParamsError {
  const files = fileList(data)

  function getDataDir() {
    return dataDir ? path.join(dataDir, getSpaceName()) : ""
  }

  function getSpaceName() {
    let name
    if (files.oneFile()) name = lib.file(files.first().file.path).fileName()
    else if (files.inSameDir()) name = files.dirName()
    else name = generateDirName(now)

    return getUniqName(name, existingNames)
  }

  return {
    name: getSpaceName(),
    dataDir: getDataDir(),
    fileListData: data
  }
}

function generateDirName(now) {
  return "zeek_" + time(now).format("YYYY-MM-DD_HH:mm:ss")
}
