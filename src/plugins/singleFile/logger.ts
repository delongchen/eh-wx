import {createLogger} from "bunyan";

export const logger = createLogger({
  name: 'singleFileHandler',
  stream: process.stdout
})
