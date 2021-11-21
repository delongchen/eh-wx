import {SingleFileHandler} from "./SingleFileHandler";
import AdmZip from 'adm-zip'
import { logger } from "./logger";
import { rename } from 'fs/promises'

const log = (msg: any) => ({ handler: 'zipHandler', msg })

export const zipHandler: SingleFileHandler = {
  ends: ['zip'],
  handle: async ({path, name, fullName}, config) => {
    const { stDir } = config
    const zip = new AdmZip(path)
    logger.info(log(`new zip ${name}`))
    zip.extractAllToAsync(
      stDir + name,
      true,
      error => {
        if (error) logger.error(log(error))
        const newPath = `${stDir}\\.zips\\${fullName}`
        logger.info(newPath)
        rename(path, newPath)
      })
  }
}
