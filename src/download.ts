import * as fs from 'std/fs/mod.ts'
import * as path from 'std/path/mod.ts'

interface DownloadOptions {
    dest?: string
    overwrite?: boolean
}

export const download = async (url: string, options?: DownloadOptions) => {
    let { base } = path.parse(url)
    if (options?.dest) {
        base = `${options.dest}/${base}`
        fs.ensureDirSync(options.dest)
    }

    if (fs.existsSync(base) && !options?.overwrite) return

    const res = await fetch(url)
    const file = await Deno.create(base)
    return res.body!.pipeTo(file.writable)
}
