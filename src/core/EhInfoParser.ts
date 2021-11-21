import {HTMLParser} from "./HTMLParser";
import {EhItem, EhPublished, EhTag} from "../types/EhItems";
import {Cheerio, CheerioAPI, Element} from "cheerio";
import {parseStyle} from "../utils/html";

const getLastChildrenText = (ce: Cheerio<Element>): string => ce.children().last().text()

function parseCoverUrl($: CheerioAPI): string {
  const rawStyle = $('#gd1')
    .children()
    .last()
    .attr('style')

  const style = parseStyle(rawStyle)
  const url = style['background'][1]
  return url.slice(4, url.length - 1) //url(xxx)
}

function getDownloadUrl($: CheerioAPI): string {
  const raw = $("#gd5 p").eq(2).children('a').attr('onclick')
  if (raw) {
    const click = raw.split("'")
    if (click.length === 3) {
      return click[1]
    }
  }
  return ''
}

function parsePublished($: CheerioAPI): EhPublished {
  const up = $('#gdn').children().first().text()

  const gdt = $('#gdd tr')
  const posted = new Date(getLastChildrenText(gdt.eq(0))).getTime()
  const language = getLastChildrenText(gdt.eq(3)).trim()
  const fileSize = getLastChildrenText(gdt.eq(4))
  const len = +(getLastChildrenText(gdt.eq(5)).split(' ')[0])
  const favorite = +(getLastChildrenText(gdt.eq(6)).split(' ')[0])
  const rating = +$('#rating_label').text().split(' ')[1]

  const title = $('#gn').text()
  const origTitle = $('#gj').text()

  return {
    up,
    language,
    posted,
    fileSize,
    len,
    favorite,
    rating,
    title,
    origTitle
  }
}

function parseTags($: CheerioAPI) {
  const tagList = $('#taglist tr')
  const result: Record<string, string[]> = Object.create(null)

  tagList.each((i, el) => {
    const tr = $(el).children()
    const key = tr.first().text()
    const values = tr.last().children()
    const tags: string[] = []

    values.each((_, td) => {
      tags.push(getLastChildrenText($(td)))
    })
    result[key.slice(0, key.length - 1)] = tags
  })

  return result
}

export class EhInfoParser extends HTMLParser<EhItem>{
  async parse(): Promise<EhItem | undefined> {
    const [err, $] = await this.getHtml()

    if ($) {
      const coverUrl = parseCoverUrl($)

      return {
        link: this.url,
        getTime: Date.now(),
        download: getDownloadUrl($),
        coverUrl,
        t: <EhTag>getLastChildrenText($("#gdc")),
        published: parsePublished($),
        id: +(this.url.split('/')[4]),
        tags: parseTags($)
      }
    }

    return
  }
}
