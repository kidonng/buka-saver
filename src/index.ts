import got from 'got'
import { load } from 'cheerio'

export const parseID = (url: string) => {
  try {
    // Supported patterns:
    // http://www.buka.cn/detail/221735.html
    // http://www.buka.cn/view/221735/65537.html
    // http://m.buka.cn/m/1969
    // http://m.buka.cn/read/1969/196661
    // http://wx.sosohaha.com/chapter?mid=221597&cid=65537
    const { hostname, pathname, searchParams } = new URL(url)
    let mid: string
    let cid: string

    if (hostname === 'wx.sosohaha.com') {
      mid = searchParams.get('mid')!
      cid = searchParams.get('cid')!
    } else [, , mid, cid] = pathname.replace(/\.html/, '').split('/')

    return { mid, cid }
  } catch (e) {
    console.error(`Invalid URL: ${url}`)

    return {}
  }
}

interface Manga {
  mid: string
  title: string
  author: string
  description: string
  cover: string
  update: string
  // TODO: Seperate Main and Extra chapters
  chapters: Chapter[]
}

export interface Chapter {
  title: string
  cid: string
  paid: boolean
}

const headers = {
  'User-Agent':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
}

export const mangaInfo = async (mid: string) => {
  const html = await got(`http://m.buka.cn/m/${mid}`, {
    headers
  }).text()
  const $ = load(html)

  const update = $('.top-title-right')
  // @ts-ignore
  const props: Manga = {
    mid,
    title: $('.mangadir-glass-name').text(),
    author: $('.mangadir-glass-author').text(),
    cover: $('.mangadir-glass-img img')
      .attr('src')!
      // Higher quality
      .replace('32h', '32x')
  }

  if (update.length) {
    props.description = $('.description_intro')
      .text()
      .trim()
    props.update = update.text().trim()
    props.chapters = $('.chapter-link')
      .get()
      .map(chapter => {
        const $chapter = $(chapter)
        const money = $chapter.children('.money')
        const paid = money.length !== 0
        if (paid) money.remove()

        return {
          title: $chapter.text().trim(),
          cid: String($chapter.data('cid')),
          paid
        }
      })
  } else {
    const html2 = await got(`http://wx.sosohaha.com/manga/${mid}`).text()
    const $2 = load(html2)

    props.description = $2('.detail-intro-center').text()
    props.update = $2('.detail-lastup').text()
    props.chapters = $2('.chapter-items a')
      .get()
      .map(chapter => {
        const $chapter = $(chapter)

        return {
          title: $chapter.text().trim(),
          cid: String($chapter.data('cid')),
          paid: $chapter.data('status') === 'lock'
        }
      })
  }

  return props
}

export const chapterInfo = async (mid: string, cid: string) => {
  const html = await got(`http://m.buka.cn/read/${mid}/${cid}`, {
    headers
  }).text()
  const $ = load(html)

  if ($('.recom-list').length === 0) {
    const images: string[] = $('.img_container  img')
      .get()
      .map(img => $(img).data('original'))
    const getID = (element: Cheerio) => ({
      mid: element.data('mid'),
      cid: element.data('cid')
    })

    return {
      title: $('.tip_left')
        .text()
        .replace('<', '')
        .trim(),
      images,
      paid: images.length === 0,
      prev: getID($('[data-index]:nth-child(2)')),
      next: getID($('[data-index]:last-child'))
    }
  } else {
    const html2 = await got(
      `http://wx.sosohaha.com/chapter?mid=${mid}&cid=${cid}`
    ).text()
    const $2 = load(html2)

    const images: string[] = $2('.img-wrapper img')
      .get()
      .map(img => $2(img).data('original'))
    const getID = (order: number) => {
      const element = $2(`.chapter-ctrl-btn:nth-of-type(${order})`)
      if (!element.is('.disabled'))
        return parseID(`http://wx.sosohaha.com${element.attr('href')}`)
    }

    return {
      title: $2('.bar-top-cindex').text(),
      images,
      paid: images.length === 0,
      prev: getID(1),
      next: getID(2)
    }
  }
}
