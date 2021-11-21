import watch  from 'node-watch'
import {config} from "../config";
import {handleOnePkg, nowHandle} from "./ehPkg";
import {removePkg} from "./store";
import { basename } from 'path'

let fileWatcher = null

function startWatch() {
  return new Promise<void>((resolve, reject) => {
    fileWatcher = watch(config.stDir, {
      recursive: false,
      filter(f, skip) {
        const ends = f.split('/').pop()
        if (ends && [
          '.DS_Store',
          nowHandle.update,
          nowHandle.remove,
          '.zips'
        ].includes(ends)) return skip

        return true
      }
    })

    fileWatcher.on('change', (evt, name) => {
      const ends = basename(String(name))
      if (evt === 'remove' && ends) {
        const toRemoveId = +ends
        if (toRemoveId !== Number.NaN) {
          removePkg(toRemoveId)
        }
      }

      if (evt === 'update' && ends) {
        console.log('up')
        handleOnePkg(ends)
      }
    })

    fileWatcher.on('ready', resolve)

    fileWatcher.on('error', reject)
  })
}

export {
  startWatch
}
