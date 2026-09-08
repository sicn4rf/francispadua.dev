# assets

`og.svg` is the source for `public/og.png`, the Open Graph card.

It is a 1200×1200 canvas with the 1200×630 card centred in it — Quick Look
scales a non-square SVG to fill, which crops the content, so the square canvas
keeps the render 1:1. To regenerate:

```bash
qlmanage -t -s 1200 -o /tmp assets/og.svg
sips -c 630 1200 /tmp/og.svg.png --out public/og.png
```
