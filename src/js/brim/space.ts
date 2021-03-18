import {isNumber} from "../lib/is"
import {Space} from "../state/Spaces/types"
import brim, {Span} from "./"

export default function space(info: Space) {
  return {
    ...info,
    isArchive() {
      return this.getType() === "archive"
    },
    hasIndex() {
      return info.storage_kind !== "filestore"
    },
    getType() {
      if (info.storage_kind === "filestore") return "space"
      if (info.parent_id) return "subspace"
      return "archive"
    },
    defaultSpanArgs() {
      return this.everythingSpan()
    },
    empty() {
      if (!info.min_time || !info.max_time) return true
      return (
        info.min_time.sec === 0 &&
        info.min_time.ns === 0 &&
        info.max_time.sec === 0 &&
        info.max_time.ns === 0
      )
    },
    minTs() {
      return info.min_time
    },
    maxTs() {
      return info.max_time
    },
    everythingSpan(): Span {
      const {min_time, max_time} = info
      const from = brim.time(min_time).toTs()
      const to = brim
        .time(max_time)
        .add(1, "ms")
        .toTs()
      return [from, to]
    },
    ingesting() {
      return isNumber(info.ingest.progress)
    },
    ingestProgress() {
      return isNumber(info.ingest.progress) ? info.ingest.progress : 0
    },
    queryable() {
      return !(this.ingesting() && this.empty())
    }
  }
}
