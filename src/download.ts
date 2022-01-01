import fs from 'fs'
import got from 'got'
import path from 'path'
import stream from 'stream'
import util from 'util'

const pipeline = util.promisify(stream.pipeline)

interface DownloadOptions {
  dest?: string
  overwrite?: boolean
}

export const download = async (url: string, options?: DownloadOptions) => {
  let { base } = path.parse(url)
  if (options?.dest) {
    base = `${options.dest}/${base}`
    fs.mkdirSync(options.dest, { recursive: true })
  }

  if (fs.existsSync(base) && !options?.overwrite) return

  return pipeline(got.stream(url), fs.createWriteStream(base))
}
