import fs from "fs-extra"
import glob from "glob"

fs.removeSync("out")
fs.removeSync(".next")
fs.removeSync("dist")
// These are broken symlinks that electron leaves around when it
// forcefully exists and can't clean them up. Babel tries to call
// stat on the broken symlinks and blows up.
glob.sync("run/**/SingletonCookie").forEach((file) => fs.removeSync(file))
glob.sync("run/**/SingletonLock").forEach((file) => fs.removeSync(file))
glob.sync("run/SS").forEach((file) => fs.removeSync(file))
