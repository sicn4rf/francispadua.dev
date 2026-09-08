# public/images

Drop the files below in and they appear in the side pane automatically. Until
then each one falls back to a dashed placeholder — `ImageWithFallback` in
`SidePanel.tsx` swaps on the image's `error` event, so a missing file never
shows a broken-image icon.

| File | Where it shows |
|---|---|
| `about-profile.jpg` | `about` — the header image |
| `about-sf.jpg` | `about` → Photos |
| `about-night.jpg` | `about` → Photos |
| `matcha-1.jpg` … `matcha-3.jpg` | `about` → Matcha Collection |
| `antalmanac-preview.png` | `experience` → AntAlmanac |
| `northstar-preview.png` | `projects` → Northstar |
| `hypernova-preview.png` | `projects` → Hypernova |
| `resmed.jpg` | `experience` → Resmed |

Cyber@UCI, WRCCDC, the book cover and the anime covers are hotlinked to third
parties in `panelData.ts`; if any of those start refusing hotlinks they will
fall back the same way, and the fix is to save a copy here and point at it.

Galleries render at 150px tall and covers cap at 220px, both `object-fit:
cover` — so roughly 3:2 landscape crops read best, portrait covers fine.
