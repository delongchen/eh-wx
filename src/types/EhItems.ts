export enum EhTag {
  'dou' = 'Doujinshi',
  'man' = 'Manga',
  'acg' = 'Artist CG',
  'gcg' = 'Gama CG',
  'wes' = 'Western',
  'noh' = 'Non-H',
  'img' = 'Image Set',
  'cos' = 'Cosplay',
  'asi' = 'Asian Porn',
  'misc' = 'Misc'
}

export interface EhPublished {
  posted: number
  rating: number
  language: string
  fileSize: string
  title: string
  origTitle: string
  len: number
  favorite: number
  up: string
}

export interface EhItem {
  published: EhPublished
  coverUrl: string
  t: EhTag
  link: string
  download: string
  getTime: number
  id: number
  tags: Record<string, string[]>

  dirty?: boolean
  pkgName?: string
  torrents?: EhDownloadInfo[]
  pics?: {
    lcp: string,
    data: string[]
  }
}

export interface EhDownloadInfo {
  posted: number
  size: {
    n: number
    t: string
  }
  seeds: number
  downloads: number
  up: string
  link: string
  fileName: string
  index: number
}
