import {EhItem} from "../../types/EhItems";
import {readFile, writeFile} from "fs/promises";
import {dump, load} from "js-yaml";
import {config} from "../../config";
import {createLogger} from "bunyan";
import { dirtyPkgMap, addPkg } from "../../core/store";
import {fmtDirName} from "../../utils/util";

const { stDir, infoFileName } = config
const EMPTY_PKG = dump({ link: '', dirty: true })
const log = createLogger({ name: 'DirHandler', stream: process.stdout })

export async function handleDir(dirName: string) {
  log.info(`new pkg ${fmtDirName(dirName)}`)
  const info = await readPkgInfoFile(dirName)
  if (info) {
    addPkg(info)
  } else {
    dirtyPkgMap.set(dirName, '')
  }
}

export async function readPkgInfoFile(dirName: string): Promise<EhItem | undefined> {
  const pkgInfoFile = stDir + dirName + infoFileName

  try {
    const rawInfo = await readFile(pkgInfoFile, 'utf-8')
    return <EhItem>load(rawInfo)
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await createEmptyPkg(pkgInfoFile)
    }
  }
}

function createEmptyPkg(filePath: string) {
  return writeFile(filePath, EMPTY_PKG, 'utf-8')
    .catch(log.error)
}
