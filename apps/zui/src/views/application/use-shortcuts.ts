import {useEffect} from "react"
import Mousetrap from "mousetrap"

import Modal from "../../js/state/Modal"
import Tabs from "../../js/state/Tabs"
import {useDispatch} from "src/app/core/state"

export default function () {
  const dispatch = useDispatch()
  useEffect(() => {
    const el = document.documentElement
    if (!el) throw new Error("No Document Element")
    const bindings = new Mousetrap(el)
      .bind("mod+t", () => dispatch(Tabs.createQuerySession()))
      .bind("mod+w", (e) => {
        e.preventDefault()
        dispatch(Tabs.closeActive())
      })
      .bind("ctrl+tab", () => dispatch(Tabs.activateNext()))
      .bind("ctrl+shift+tab", () => dispatch(Tabs.activatePrev()))
    for (let i = 0; i < 8; ++i) {
      bindings.bind(`mod+${i + 1}`, () => dispatch(Tabs.activateByIndex(i)))
    }
    bindings
      .bind("mod+9", () => dispatch(Tabs.activateLast()))
      .bind("mod+,", () => dispatch(Modal.show("settings")))

    return () => {
      bindings.reset()
    }
  }, [])
}
