import { crawl, parse } from './util'

const getImages = ($: CheerioStatic, selector: string) => {
  const images: string[] = $(selector)
    .get()
    .map(img => $(img).data('original'))
  const paid = images.length === 0

  return { images, paid }
}

const getIDByElement = (element: Cheerio) =>
  element.is('.disabled')
    ? null
    : parse(`http://wx.sosohaha.com${element.attr('href')}`)

export default async (mid: string, cid: string) => {
  const $ = await crawl('mobile', { mid, cid })
  const getIDBySelector = (selector: string) =>
    $(selector).length === 0 ? null : { mid, cid: $(selector).data('cid') }

  if ($('.recom-list').length === 0) {
    // Chapter is publicly available
    const name = $('.tip_left')
      .text()
      .replace('<', '')
      .trim()
    const { images, paid } = getImages($, '.img_container img')
    const prev = getIDBySelector('[data-index]:nth-child(2)')
    const next = getIDBySelector('[data-index]:last-child')

    return {
      mid,
      cid,
      name,
      paid,
      images,
      prev,
      next
    }
  }

  // Chapter is not publicly available
  const $$ = await crawl('wx', { mid, cid })

  const name = $$('.bar-top-cindex').text()
  const { images, paid } = getImages($$, '.img-wrapper img')
  const prev = getIDByElement($$('.chapter-ctrl-btn:first-of-type'))
  const next = getIDByElement($$('.chapter-ctrl-btn:last-of-type'))

  return {
    mid,
    cid,
    name,
    paid,
    images,
    prev,
    next
  }
}
