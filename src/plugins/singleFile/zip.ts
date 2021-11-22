import {SingleFileHandler} from "./SingleFileHandler";
import AdmZip from 'adm-zip'
import { logger } from "./logger";
import { rename } from 'fs/promises'
import {fmtDirName} from "../../utils/util";


export const zipHandler: SingleFileHandler = {
  ends: ['zip'],
  handle: async ({path, name, fullName}, config) => {
    logger.info(`new zip ${fmtDirName(name)}`)
    const { stDir } = config
    const zip = new AdmZip(path)
    zip.extractAllTo(stDir + name)
    const newPath = `${stDir}.zips/${fullName}`
    await rename(path, newPath)
  }
}
