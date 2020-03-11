import arg from 'arg'
import { parseID, chapterInfo, mangaInfo } from '.'
import { down } from './down'

const args = arg({
  '--down': Boolean,
  '--mid': String,
  '--cid': String,
  '-d': '--down',
  '-m': '--mid',
  '-c': '--cid'
})

let mid
let cid

try {
  const [url] = args._
  new URL(url)
  ;({ mid, cid } = parseID(url))
} catch {
  mid = args['--mid']
  cid = args['--cid']
}

if (!mid) console.error('Please at least provide mid')
else if (args['--down']) {
  if (cid) down(mid, cid)
  else down(mid)
} else
  (async () => {
    if (cid) console.log(await chapterInfo(mid, cid))
    else console.log(await mangaInfo(mid))
  })()
