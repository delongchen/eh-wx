import { mkdir } from 'fs/promises'

export async function mkDir(path: string) {
  try {
    await mkdir(path)
  } catch (e: any) {
    if (e.code === 'EEXIST') {
      return
    } else {
      throw e
    }
  }
}
