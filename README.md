# Buka Saver

**Buka Manga is disappointing. We need a saver!**

Buka Saver can fetch manga/chapter info and download them from Buka Manga.

**Disclaimer:** This project is for learning purposes only. We do not provide direct access to any copyright content.

## Usage Example

You need to run `yarn build` first.

```
# View manga info
yarn cli --mid 221735
# View Chapter info
yarn cli --mid 221735 --cid 65537
# Download manga
yarn cli --mid 221735 --down
# Download manga chapter
yarn cli -m 221735 -c 65537 -d
# Works with URL too
yarn cli http://www.buka.cn/view/221735/65537.html -d
```

## Notes

- Incorrect inputs and downloads are not completely handled. If you are seeing errors, please try again.
- Files will be downloaded into `down` directory.
- See Supported URL patterns [here](src/index.ts#L6-L11).
