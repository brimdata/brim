import {spawn} from "child_process"

class Sub {
  constructor(bin, args) {
    this.bin = bin
    this.args = args
    this.p = spawn(bin, [args], {
      shell: true,
    })
    this.p.stdout.on("data", (data) => {
      if (this.silent) return
      if (this.waiting) return
      process.stdout.write(data.toString())
    })
    this.p.stdout.on("error", (e) => {
      if (this.waiting) return
      console.log(e)
    })
    this.p.stderr.on("data", (data) => {
      if (this.waiting) return
      process.stderr.write(data.toString())
    })
  }

  silence() {
    this.silent = true
    return this
  }

  waitForOutput(pattern, debug) {
    this.waiting = true
    return new Promise((res, rej) => {
      this.p.stdout.on("data", (d) => {
        if (debug) console.log(d.toString())
        if (pattern.test(d.toString())) res()
      })
      this.p.stderr.on("data", (buffer) => {
        console.log(buffer.toString())
      })
      this.p.on("close", () => {
        rej("The process \"" + this.bin + " " + this.args + "\" closed before receiving expected output: " + pattern)
      })
    }).finally(() => {
      this.waiting = false
    })
  }

  kill() {
    process.kill(this.p.pid)
  }
}

export default (bin, args) => new Sub(bin, args)
