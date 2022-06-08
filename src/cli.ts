import arg from 'arg'
import ProgressBar from 'progress'
import { red, blue } from 'std/fmt/colors.ts'
import sanitize from 'sanitize-filename'
import chapterInfo from './chapter.ts'
import { download } from './download.ts'
import mangaInfo from './manga.ts'
import { parse } from './util.ts'

const downloader = async (mid: string, cid?: string) => {
    const { name: mangaName, chapters } = await mangaInfo(mid)
    if (!chapters)
        return console.error(red(`Skipping unavailable manga ${mangaName}`))

    console.info(blue(`Downloading ${mangaName}`))
    const cids = cid ? [cid] : chapters.map((chapter) => chapter.cid)

    for (const cid of cids) {
        const { name, images, paid } = await chapterInfo(mid, cid)
        if (!name || !images)
            return console.error(red(`Skipping unavailable chapter ${cid}`))
        if (paid) return console.error(red(`Skipping paid chapter ${name}`))

        let completed = 0
        const bar = new ProgressBar({ title: name, total: images.length })

        for (const image of images) {
            await download(image, {
                dest: `down/${sanitize(mangaName)}/${sanitize(name)}`,
            })
            bar.render(++completed)
        }
    }
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
    '-d': '--download',
})
;(async () => {
    const { mid, cid } = args['--url']
        ? parse(args['--url'])
        : { mid: args['--mid'], cid: args['--cid'] }

    if (!mid) return console.error(red('`mid` not found!'))

    if (args['--download']) return cid ? downloader(mid, cid) : downloader(mid)

    console.log(await (cid ? chapterInfo(mid, cid) : mangaInfo(mid)))
})()
