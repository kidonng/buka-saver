import fs from 'fs'
import got from 'got'
import path from 'path'
import sanitize from 'sanitize-filename'
import stream from 'stream'
import util from 'util'

const mkdir = (paths: string[]) =>
  fs.mkdirSync(path.join(...paths), {
    recursive: true
  })

const pipeline = util.promisify(stream.pipeline)

const sanitizePath = (paths: string[]) => paths.map(path => sanitize(path))

interface DownloadOptions {
  dest?: string[]
  overwrite?: boolean
}

export const download = async (url: string, options?: DownloadOptions) => {
  let { base } = path.parse(url)
  if (options?.dest) {
    const dest = sanitizePath(options.dest)
    base = path.join(...dest, base)
    mkdir(dest)
  }

  if (fs.existsSync(base) && !options?.overwrite) return

  return pipeline(got.stream(url), fs.createWriteStream(base))
}
