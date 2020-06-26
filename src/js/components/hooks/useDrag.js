/* @flow */
import lib from "../../lib"

export default function useDrag(handler: Function) {
  return (args: Object) => {
    let startX = 0
    let startY = 0

    function onMouseDown(event: MouseEvent) {
      startX = event.clientX
      startY = event.clientY
      handler({
        event,
        args,
        dx: 0,
        dy: 0,
        type: "down"
      })
      lib.on("mousemove", onMove)
      lib.on("mouseup", onUp)
    }

    function onMove(event) {
      let res = handler({
        event,
        args,
        dx: event.clientX - startX,
        dy: event.clientY - startY,
        type: "move"
      })
      if (res === false) {
        lib.off("mousemove", onMove)
        lib.off("mouseup", onUp)
      }
    }

    function onUp(event) {
      handler({
        event,
        args,
        dx: event.clientX - startX,
        dy: event.clientY - startY,
        type: "up"
      })
      lib.off("mousemove", onMove)
      lib.off("mouseup", onUp)
    }

    return {
      onMouseDown
    }
  }
}
