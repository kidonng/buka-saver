import { crawl } from './util'

export default async (mid: string) => {
  const $ = await crawl('mobile', { mid })

  const name = $('.mangadir-glass-name').text()
  const author = $('.mangadir-glass-author').text()
  const cover = $('.mangadir-glass-img img')
    .attr('src')!
    // Larger
    .replace('32h', '32x')
  const update = $('.top-title-right')

  if (update.length) {
    // Manga is publicly available
    const description = $('.description_intro')
      .text()
      .trim()
    const updateAt = update.text().trim()
    const chapters = $('.chapter-link')
      .get()
      .map(chapter => {
        const cid = String($(chapter).data('cid'))
        const name = $(chapter)
          .text()
          .replace('￥', '')
          .trim()
        const paid = $(chapter).children('.money').length !== 0

        return {
          cid,
          name,
          paid
        }
      })

    return {
      mid,
      name,
      author,
      cover,
      description,
      updateAt,
      chapters
    }
  }

  // Manga is not publicly available
  return {
    mid,
    name,
    author,
    cover,
  }
}
