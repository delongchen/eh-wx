import {HTMLParser} from "./HTMLParser";
import {EhDownloadInfo} from "../types/EhItems";

export class EhTorrentParser extends HTMLParser<EhDownloadInfo[]> {
  async parse(): Promise<EhDownloadInfo[] | undefined> {
    const [err, $] = await this.getHtml()

    if ($) {
      return $('table').map((index, element): EhDownloadInfo | null => {
        const link = $('a', element).attr('href')
        if (!link) return null

        const tds = $('td', element)
        const temp: Record<string, string> = Object.create(null)

        tds.map((_, td) => {
          const tdText = $(td).text()
          if (tdText.length !== 0) {
            const tokens = tdText.split(':')
            if (tokens.length === 1) {
              temp['fileName'] = tokens[0].trim()
            }
            if (tokens.length === 2) {
              temp[tokens[0].toLowerCase()] = tokens[1].trim()
            } else if (tokens.length === 3) {
              temp[tokens[0].toLowerCase()] = [tokens[1], tokens[2]].join(':').trim()
            }
          }
        })

        const { posted, size, seeds, downloads, uploader, fileName } = temp
        const [n, t] = size.split(' ')

        return {
          posted: new Date(posted).getTime(),
          size: {n: +n, t},
          seeds: +seeds,
          up: uploader,
          downloads: +downloads,
          link,
          fileName,
          index
        }
      }).get()
    }
  }
}
