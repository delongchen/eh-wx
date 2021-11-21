import {AppConfig} from "../../types/AppConfig";

interface FileInfo {
  name: string
  fullName: string
  path: string
}

export interface SingleFileHandler {
  ends: string[]
  handle: (fileInfo: FileInfo, config: AppConfig) => Promise<void>
}
