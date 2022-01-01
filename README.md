# Buka Saver

**Disclaimer: This project is for learning purposes only. We do not provide access to any copyright content.**

Buka Manga is **absolutely** doomed. We need a saver!

Buka Saver can fetch manga/chapter info and download them from Buka Manga.

## Usage

Make sure you have installed dependencies (via `yarn`) and built the program (via `yarn build`) first.

- `--mid`, `-m`: specify `mid`
- `--cid`, `-c`: specify `cid`
- `--url`, `-u`: parse `mid` and/or `cid` from URL
- `--download`, `-d`: download manga/chapter into `./down`

```sh
# View manga info
node dist/cli.js --mid 216955
# View chapter info
node dist/cli.js -m 216955 -c 65637
# Download manga
node dist/cli.js -m 216955 -d
# Using URL
node dist/cli.js -u http://www.buka.cn/view/216955/65637.html -d
```

## Related Projects

- https://github.com/gumblex/refine-buka
