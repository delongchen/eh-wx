import {opendir} from "fs/promises";

export const sleep = (n: number) => new Promise<void>(resolve => {
  setTimeout(resolve, n)
})

export function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 1) {
    return strs[0]
  }

  let result = strs[0]
  for (let i = 1; i < strs.length; i++) {
    result = twoWordsLCP(result, strs[i])
  }

  return result
}

export const twoWordsLCP = (a: string, b: string): string => {
  const n = Math.min(a.length, b.length)
  if (n === 0) return ''
  const result: string[] = []

  for (let i = 0; i < n; i++) {
    if (a[i] === b[i]) {
      result.push(a[i])
    } else break
  }

  return result.join('')
}

/*
* 读取一个装满色图的文件夹
* 允许的后缀在whitePicSet里
* 然后获取他们的最长公共前缀
* 再排序输出
* */
const whitePicSet = new Set<string>(['jpg', 'jpeg', 'png'])

export async function readPicAndSort(path: string): Promise<[string, string[]]> {
  const dir = await opendir(path)
  const pics: ({name: string, fullName: string})[] = []

  for await (const dirent of dir) {
    if (dirent.isFile()) {
      const names = dirent.name.split('.')
      if (names.length === 2) {
        if (whitePicSet.has(names[1])) {
          pics.push({name: names[0], fullName: dirent.name})
        }
      }
    }
  }

  const lcp = longestCommonPrefix(pics.map(v => v.name))
  if (lcp) {
    pics.forEach(v => {
      v.name = v.name.slice(lcp.length)
      v.fullName = v.fullName.slice(lcp.length)
    })
  }
  pics.sort((a, b) => {
    if (a.name > b.name) return 1
    else return -1
  })
  return [lcp, pics.map(v => v.fullName)]
}

const limit = 10
export function fmtDirName(s: string): string {
  if (s.length > limit) {
    return s.slice(0, limit) + '...'
  }
  return s
}
