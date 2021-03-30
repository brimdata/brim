/* @noflow */

const child_process = require("child_process")
const fs = require("fs-extra")
const got = require("got")
const path = require("path")
const tmp = require("tmp")
const extract = require("extract-zip")
const brimPackage = require("../../package.json")
const zqPackage = require("../../node_modules/zq/package.json")

const zdepsPath = path.resolve("zdeps")

const platformDefs = {
  darwin: {
    zqdBin: "zqd",
    zqBin: "zq",
    pcapBin: "pcap",
    zapiBin: "zapi",
    zarBin: "zar",
    osarch: "darwin-amd64"
  },
  linux: {
    zqdBin: "zqd",
    zqBin: "zq",
    pcapBin: "pcap",
    zapiBin: "zapi",
    zarBin: "zar",
    osarch: "linux-amd64"
  },
  win32: {
    zqdBin: "zqd.exe",
    zqBin: "zq.exe",
    pcapBin: "pcap.exe",
    zapiBin: "zapi.exe",
    zarBin: "zar.exe",
    osarch: "windows-amd64"
  }
}

async function download(url, targetfile) {
  await fs.mkdirp(path.dirname(targetfile))
  const writeStream = fs.createWriteStream(targetfile)
  return new Promise((resolve, reject) => {
    const gotStream = got.stream(url)
    gotStream.pipe(writeStream)
    gotStream.on("error", (err) => {
      if (writeStream.destroy) {
        writeStream.destroy(err)
      }
      reject(err)
    })
    writeStream.on("error", (err) => reject(err))
    writeStream.on("close", () => resolve())
  })
}

async function unzipTo(zipfile, dir) {
  await fs.mkdirp(dir)
  return new Promise((resolve, reject) => {
    extract(zipfile, {dir: dir}, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function zqdArtifactPaths(version) {
  const plat = platformDefs[process.platform]

  const artifactFile = `zq-${version}.${plat.osarch}.zip`
  const artifactUrl = `https://github.com/brimdata/zq/releases/download/${version}/${artifactFile}`
  const internalTopDir = `zq-${version}.${plat.osarch}`

  return {
    artifactFile,
    artifactUrl,
    internalTopDir
  }
}

// Download and extract the zqd binary for this platform to the specified
// directory. Returns the absolute path of the zqd binary file.
async function zqArtifactsDownload(version, destPath) {
  const plat = platformDefs[process.platform]
  const paths = zqdArtifactPaths(version)

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, paths.artifactFile)
    await download(paths.artifactUrl, destArchive)
    await unzipTo(destArchive, tmpdir.name)

    fs.mkdirpSync(destPath)

    for (let f of [
      plat.zqdBin,
      plat.zqBin,
      plat.pcapBin,
      plat.zapiBin,
      plat.zarBin
    ]) {
      fs.moveSync(
        path.join(tmpdir.name, paths.internalTopDir, f),
        path.join(destPath, f),
        {overwrite: true}
      )
    }
  } finally {
    tmpdir.removeCallback()
  }
}

async function zeekDownload(version, zdepsPath) {
  if (!(process.platform in platformDefs)) {
    throw new Error("unsupported platform")
  }
  const plat = platformDefs[process.platform]
  const zeekPath = path.join(zdepsPath, "zeek")

  const artifactFile = `zeek-${version}.${plat.osarch}.zip`
  const artifactUrl = `https://github.com/brimdata/zeek/releases/download/${version}/${artifactFile}`

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, artifactFile)
    await download(artifactUrl, destArchive)

    fs.removeSync(zeekPath)
    await unzipTo(destArchive, zdepsPath)
    if (!fs.pathExistsSync(zeekPath)) {
      throw new Error("zeek artifact zip file has unexpected layout")
    }
  } finally {
    tmpdir.removeCallback()
  }

  console.log("zeek " + version + " downloaded to " + zeekPath)
}

async function suricataDownload(version, zdepsPath) {
  if (!(process.platform in platformDefs)) {
    throw new Error("unsupported platform")
  }
  const plat = platformDefs[process.platform]
  const suricataPath = path.join(zdepsPath, "suricata")

  const artifactFile = `suricata-${version}.${plat.osarch}.zip`
  const artifactUrl = `https://github.com/brimdata/build-suricata/releases/download/${version}/${artifactFile}`

  const tmpdir = tmp.dirSync({unsafeCleanup: true})
  try {
    const destArchive = path.join(tmpdir.name, artifactFile)
    await download(artifactUrl, destArchive)

    fs.removeSync(suricataPath)
    await unzipTo(destArchive, zdepsPath)
    if (!fs.pathExistsSync(suricataPath)) {
      throw new Error("suricata artifact zip file has unexpected layout")
    }
  } finally {
    tmpdir.removeCallback()
  }

  console.log("suricata " + version + " downloaded to " + suricataPath)
}

// Build the zqd binary inside the node_modules/zq directory via "make build".
async function zqDevBuild(destPath) {
  if (!(process.platform in platformDefs)) {
    throw new Error("unsupported platform")
  }
  const plat = platformDefs[process.platform]

  const zqPackageDir = path.join(__dirname, "..", "..", "node_modules", "zq")

  for (let f of [
    plat.zqdBin,
    plat.zqBin,
    plat.pcapBin,
    plat.zapiBin,
    plat.zarBin
  ]) {
    fs.copyFileSync(path.join(zqPackageDir, "dist", f), path.join(destPath, f))
  }
}

async function main() {
  try {
    // We encode the versions here for now to avoid the unncessary
    // git clone if it were in package.json.
    const zeekVersion = zqPackage.brimDependencies.zeekTag
    const suricataVersion = zqPackage.brimDependencies.suricataTag
    await zeekDownload(zeekVersion, zdepsPath)
    await suricataDownload(suricataVersion, zdepsPath)

    // The zq dependency should be a git tag or commit. Any tag that
    // begins with "v*" is expected to be a released artifact, and will
    // be downloaded from the zq repo release artifacts. Otherwise,
    // attempt to build it (via "make build"); this assumes that go tooling
    // is available.
    const zqdVersion = brimPackage.dependencies.zq.split("#")[1]
    if (zqdVersion.startsWith("v")) {
      await zqArtifactsDownload(zqdVersion, zdepsPath)
      console.log("downloaded zq artifacts version " + zqdVersion)
    } else {
      await zqDevBuild(zdepsPath)
      // Print the version inside zq derived during prepack as
      // opposed to what's in package.json.
      let realZqVersion = child_process
        .execSync(path.join(zdepsPath, "zq") + " -version")
        .toString()
        .trim()
      console.log("copied zq artifacts " + realZqVersion)
    }
  } catch (err) {
    console.error("zdeps setup: ", err)
    process.exit(1)
  }
}

main()
