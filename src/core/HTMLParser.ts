import { CheerioAPI, load } from 'cheerio'
import { requests } from "./requests";

export class HTMLParser<T> {
  protected readonly url: string

  constructor(url: string) {
    this.url = url
  }

  protected async getHtml(): Promise<[err: unknown, $: CheerioAPI | undefined]> {
    try {
      const response = await requests(this.url)
      return [undefined, load(response.body)]
    } catch (err) {
      return [err, undefined]
    }
  }

  async parse(): Promise<T | undefined> {
    return
  }
}
