import * as fs from 'fs'
import * as path from 'path'
import got from 'got'
import { chapterInfo, mangaInfo, Chapter } from '.'

const mkdir = (path: string) => {
  if (!fs.existsSync(path)) fs.mkdirSync(path)
}
const safePath = (...paths: string[]) =>
  path.join(...paths.map(path => path.replace(/\//g, ' ')))

const downChapter = async (
  mid: string,
  mangaTitle: string,
  chapter: Chapter
) => {
  const { title, cid } = chapter
  const { images, paid } = await chapterInfo(mid, cid)
  if (paid) return console.info('Paid chapter, skipping')

  mkdir(safePath('down', mangaTitle, title))

  images.forEach(async (image, index) => {
    console.info(`Downloading ${title} part ${index + 1}/${images.length}`)
    const file = safePath('down', mangaTitle, title, path.parse(image).base)
    if (fs.existsSync(file)) console.info('File exist, skipping')
    else {
      const buffer = await got(image).buffer()
      fs.writeFileSync(file, buffer)
    }
  })
}

export const down = async (mid: string, cid?: string) => {
  const { title, chapters } = await mangaInfo(mid)
  mkdir('down')
  mkdir(safePath('down', title))

  const todo = cid ? [chapters.find(chapter => chapter.cid === cid)!] : chapters
  todo.forEach((chapter, index) => {
    console.info(`Downloading ${title} chapter ${index + 1}/${chapters.length}`)
    downChapter(mid, title, chapter)
  })
}
