import {AppConfig} from "../types/AppConfig";
import { load } from 'js-yaml'
import { readFileSync } from 'fs'

const rawConfig = readFileSync('src/config/config.yml', 'utf-8')
const config = <AppConfig>load(rawConfig)

export {
  config
}
