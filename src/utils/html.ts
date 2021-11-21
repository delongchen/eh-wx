import { promisify } from 'node:util'
import stream from 'node:stream'
import { createWriteStream } from 'fs'
import {defHeaders, requests} from "../core/requests";
import got from "got";

const pipeline = promisify(stream.pipeline)

export const parseStyle = (s: string | undefined): Record<string, string[]> => {
  const result = Object.create(null)
  if (!s) return result

  const attrs = s.split(';')
  if (attrs.length) {
    for (const attr of attrs) {
      const rawKv = attr.split(':')

      if (rawKv.length >= 2) {
        const k = rawKv.shift()
        if (k) {
          const rawV = rawKv.join(":")
          result[k.trim()] = rawV.split(' ')
        }
      }
    }
  }
  return result
}

export async function download(url: string, file: string) {
  await pipeline(
    got.stream(url, { timeout: 10000, headers: defHeaders }),
    createWriteStream(file)
  )
}
