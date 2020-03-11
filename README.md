# Buka Saver

Buka Manga is disappointing. We need a saver!

Buka Saver can fetch manga/chapter info and download them.

**Disclaimer:** This project is for learning purposes only. We do not provide direct access to any copyright content.

## Usage example

We don't provide prebuilt version for the moment. You need to run `yarn build` before using.

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

- We don't always verify inputs. If you are seeing errors, please retry with the right inputs.
- In case you missed it, files will be downloaded to `down`.
- See Supported URL patterns [here](src/index.ts#L6-L11).
