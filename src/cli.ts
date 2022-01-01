import arg from 'arg'
import cliProgress from 'cli-progress'
import { red, blue } from 'colorette'
import sanitize from 'sanitize-filename'
import chapterInfo from './chapter'
import { download } from './download'
import mangaInfo from './manga'
import { parse } from './util'

const downloader = async (mid: string, cid?: string) => {
  const { name: mangaName, chapters } = await mangaInfo(mid)
  if (!chapters) return console.error(red(`Skipping unavailable manga ${mangaName}`))

  console.info(blue(`Downloading ${mangaName}`))
  const cids = cid ? [cid] : chapters.map(chapter => chapter.cid)

  const multibar = new cliProgress.MultiBar({
    format: '{name} {bar} {percentage}% | ETA: {eta}s | {value}/{total}'
  })

  for (const cid of cids) {
    const { name, images, paid } = await chapterInfo(mid, cid)
    if (!name || !images) return console.error(red(`Skipping unavailable chapter ${cid}`))
    if (paid) return console.error(red(`Skipping paid chapter ${name}`))

    const bar = multibar.create(images.length, 0, { name })

    for (const image of images) {
      await download(image, { dest: `down/${sanitize(mangaName)}/${sanitize(name)}` })
      bar.increment()
    }
  }
  multibar.stop()
  console.info(blue(`Download ${mangaName} complete`))
}

const args = arg({
  '--mid': String,
  '--cid': String,
  '--url': String,
  '--download': Boolean,
  '-m': '--mid',
  '-c': '--cid',
  '-u': '--url',
  '-d': '--download'
})
;(async () => {
  const { mid, cid } = args['--url']
    ? parse(args['--url'])
    : { mid: args['--mid'], cid: args['--cid'] }

  if (!mid) return console.error(red('`mid` not found!'))

  if (args['--download']) return cid ? downloader(mid, cid) : downloader(mid)

  console.log(await (cid ? chapterInfo(mid, cid) : mangaInfo(mid)))
})()
