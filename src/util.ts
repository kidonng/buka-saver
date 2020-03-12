import cheerio from 'cheerio'
import got from 'got'

interface RenderOptions {
  mid: string
  cid?: string
}

const render = {
  pc(options: RenderOptions) {
    return options.cid
      ? `http://www.buka.cn/view/${options.mid}/${options.cid}`
      : `http://www.buka.cn/detail/${options.mid}`
  },
  mobile(options: RenderOptions) {
    return options.cid
      ? `http://m.buka.cn/read/${options.mid}/${options.cid}`
      : `http://m.buka.cn/m/${options.mid}`
  },
  wx(options: RenderOptions) {
    return options.cid
      ? `http://wx.sosohaha.com/chapter?mid=${options.mid}&cid=${options.cid}`
      : `http://wx.sosohaha.com/manga/${options.mid}`
  }
}

export const parse = (url: string) => {
  const { hostname, pathname, searchParams } = new URL(url)
  const [, , mid, cid] = pathname.replace('.html', '').split('/')

  if (hostname === 'wx.sosohaha.com') {
    if (pathname === '/chapter')
      return {
        mid: searchParams.get('mid'),
        cid: searchParams.get('cid')
      }

    return { mid }
  }

  return { mid, cid }
}

const headers = {
  'User-Agent':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
}

type Mode = keyof typeof render

export const crawl = async (mode: Mode, options: RenderOptions) => {
  const html = await got(
    render[mode](options),
    mode === 'mobile' ? { headers } : {}
  ).text()
  return cheerio.load(html)
}
