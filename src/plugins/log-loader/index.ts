import BrimApi from "src/js/api"
import {IngestParams} from "src/js/brim/ingest/getParams"
import {forEach, get} from "lodash"
import {Readable} from "stream"
import {LoadFormat} from "packages/zealot/src"

export const activate = (api: BrimApi) => {
  const load = async (
    params: IngestParams & {
      poolId: string
      branch: string
      format?: LoadFormat
    },
    onProgressUpdate: (value: number) => void,
    onWarning: (warning: string) => void,
    onDetailUpdate: () => Promise<void>,
    signal?: AbortSignal
  ): Promise<void> => {
    const files = params.fileListData.map((f) => f.file)
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
    const zealot = await api.getZealot()
    let readBytes = 0
    onProgressUpdate(0)
    for (const file of files) {
      const progressUpdateTransformStream = new TransformStream({
        transform(chunk, ctrl) {
          ctrl.enqueue(chunk)
          readBytes += chunk.byteLength
          onProgressUpdate(readBytes / totalBytes)
        },
      })
      const stream = file.stream().pipeThrough(progressUpdateTransformStream)
      const data = nodeJSReadableStreamFromReadableStream(stream)
      const res = await zealot.load(data, {
        pool: params.poolId,
        branch: params.branch,
        format: params.format,
        message: {
          author: "brim",
          body: "automatic import of " + file.path,
        },
        signal,
      })
      forEach(get(res, ["value", "warnings"], []), onWarning)
    }
    await onDetailUpdate()
    onProgressUpdate(1)
  }

  api.loaders.add({
    load,
    match: "log",
  })
}

function nodeJSReadableStreamFromReadableStream(
  stream: ReadableStream
): NodeJS.ReadableStream {
  const reader = stream.getReader()
  return new Readable({
    read(_size) {
      reader.read().then(({done, value}) => {
        this.push(done ? null : value)
      })
    },
  })
}

export const deactivate = () => {}
