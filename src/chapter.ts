import { crawl } from './util'

const getImages = ($: CheerioStatic, selector: string) => {
  const images: string[] = $(selector)
    .get()
    .map(img => $(img).data('original'))
  const paid = images.length === 0

  return { images, paid }
}

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
  return {
    mid,
    cid,
  }
}
