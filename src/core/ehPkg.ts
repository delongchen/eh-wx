import {mkdir, rename, rm, writeFile, stat} from 'fs/promises'
import {config} from "../config";
import {dump} from 'js-yaml'
import {EhInfoParser} from "./EhInfoParser";
import {download} from "../utils/html";
import {EhTorrentParser} from "./EhTorrentParser";
import {sleep, readPicAndSort} from "../utils/util";
import {addPkg, dirtyPkgMap} from "./store";
import { createLogger } from 'bunyan'
import {handleSingleFile} from "../plugins/singleFile";
import {handleDir, readPkgInfoFile} from "../plugins/dir";
import {EhItem} from "../types/EhItems";

const { infoFileName, stDir } = config
const logger = createLogger({name: 'eh-pkg', stream: process.stdout})
export const nowHandle = {
  update: '.',
  remove: '.'
}

async function downloadImmediately(dirtyPkg: [string, string]) {
  const [name, link] = dirtyPkg
  let newPkg: EhItem | undefined = undefined

  if (link) {
    newPkg = await downloadPkg(link, name)
  } else {
    const pkgInfo = await readPkgInfoFile(name)
    if (pkgInfo && pkgInfo.link) {
      newPkg = await downloadPkg(pkgInfo.link, name)
    }
  }

  if (newPkg) {
    addPkg(newPkg)
    dirtyPkgMap.delete(name)
    await sleep(1000 * 20)
  }
}

export async function startAsyncDownload() {
  for (;;) {
    if (dirtyPkgMap.size) {
      logger.info(`${dirtyPkgMap.size} pkg need link`)
      for (const dirtyPkg of dirtyPkgMap) {
        await downloadImmediately(dirtyPkg)
      }
    }

    await sleep(1000 * 60) //10 mines
  }
}

async function downloadPkg(link: string, dirName: string) {
  const dirPath = stDir + dirName
  const pkgInfoFile = dirPath + infoFileName

  logger.info(`start download ${dirName}`)
  const parser = new EhInfoParser(link)
  const res = await parser.parse()

  if (res) {
    const newDir = stDir + res.id + '/'
    nowHandle.update = res.id + ''
    await mkdir(newDir)

    const ehTorrentParser = new EhTorrentParser(res.download)
    logger.info(`start download torrent ${res.id}`)
    const torrents = await ehTorrentParser.parse()
    if (torrents && torrents.length) {
      res.torrents = torrents
      const torrentDir = newDir + 'torrents/'
      await mkdir(torrentDir)
      for (const t of torrents) {
        await download(t.link, `${torrentDir}${t.index}.torrent`)
      }
    }

    await rm(pkgInfoFile)
    const [lcp, data] = await readPicAndSort(dirPath)
    res.pics = { lcp, data }
    nowHandle.remove = dirName
    await rename(dirPath, newDir + 'pic')
    res.pkgName = dirName
    await download(res.coverUrl, newDir + 'cover.jpg')
    await writeFile(newDir + infoFileName, dump(res))
  }

  return res
}

/*
* 处理单个文件
* 分为目录和文件两个情况
* */
export async function handleOnePkg(dirName: string) {
  const fileStat = await stat(stDir + dirName)
  if (fileStat.isDirectory()) {
    await handleDir(dirName)
  }
  else if (fileStat.isFile()) {
    handleSingleFile(dirName)
  }
}
