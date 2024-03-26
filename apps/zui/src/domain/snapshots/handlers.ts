import {createHandler} from "src/core/handlers"
import {Active} from "src/models/active"
import {EditorSnapshot} from "src/models/editor-snapshot"
import {NamedQuery} from "src/models/named-query"
import {Session} from "src/models/session"

/**
 * This is called when you click on a session history entry.
 */

type Args = {
  sessionId: string
  namedQueryId?: string
  snapshotId: string
}

export const show = createHandler((ctx, args: Args) => {
  const {session} = Active
  const namedQuery = NamedQuery.find(args.namedQueryId)
  const snapshot = EditorSnapshot.find(session.id, args.snapshotId)
  Active.session.navigate(snapshot, namedQuery)
})

export const createAndShow = createHandler(
  (ctx, args: Partial<EditorSnapshot["attrs"]>) => {
    Session.activateLastFocused()
    Active.session.navigate(new EditorSnapshot(args))
  }
)
