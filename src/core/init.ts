import { opendir } from 'fs/promises'
import {config} from "../config";
import {handleOnePkg} from "./ehPkg";
import {mkDir} from "../utils/files";
import {createLogger} from "bunyan";

const { stDir } = config
const log = createLogger({ name: 'init', stream: process.stdout })

const whiteList = new Set<string>([
  '.zips'
])
export async function init() {
  log.info('creating .zips dir')
  await mkDir(stDir + '.zips')
  const dir = await opendir(stDir)

  for await (const dirent of dir) {
    if (!whiteList.has(dirent.name))
      await handleOnePkg(dirent.name)
  }
}
