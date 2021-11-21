import { SingleFileHandler } from "./SingleFileHandler";
import {zipHandler} from "./zip";
import {config} from "../../config";

const handlers: SingleFileHandler[] = [
  zipHandler
]

const handlerMap = new Map<string, SingleFileHandler>()
for (const handler of handlers) {
  handler.ends.forEach(
    v => void handlerMap.set(v, handler)
  )
}

export function handleSingleFile(fileName: string) {
  const names = fileName.split('.')
  if (names.length === 2) {
    const handler = handlerMap.get(names[1])
    if (handler) {
      handler.handle({
        name: names[0],
        fullName: fileName,
        path: config.stDir + fileName
      }, config)
    }
  }
}
