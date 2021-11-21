import {init} from "./core/init";
import {startWatch} from "./core/fileWatcher";
import {startAsyncDownload} from "./core/ehPkg";
import { app } from "./app";
import {config} from "./config";

async function start() {
  startAsyncDownload()
  await init()
  await startWatch()
  app.listen(config.port)
}

start()
