# Nalli Pur — Biryani & Pulao

Cinematic, scroll-driven website for Nalli Pur (Lahore). Scrolling plays a food film — rice cascades onto a platter, beef nalli lands, the camera orbits — then moves through charcoal BBQ and a full feast, into the menu, Mini Daig and ordering.

Built with Next.js (App Router) + TypeScript, Tailwind CSS v4, Lenis smooth scroll and a React Three Fiber heat-haze pass on the BBQ chapter. Footage and imagery were generated with Higgsfield (Seedance 2.5, Nano Banana, GPT Image).

## Run

```bash
npm install
npm run dev      # http://localhost:3000 (writes to .next-dev)
npm run build && npm start
```

## How the film works

- Frames are pre-extracted WebP images in `public/film/<chapter>/{d,m}/` (desktop 16:9, mobile portrait crop).
- `src/components/FrameFilm.tsx` fetches them as compressed blobs and decodes only a small window around the playhead into `ImageBitmap`s, so memory stays low and scrubbing stays smooth.
- Dev hooks: `?jump=<scrollY>` lands pre-scrolled; `window.__ready` flips once the page is settled.

## Rebuilding frames

Raw clips and keyframes are kept outside the repo in `../media` (too large for git). With that folder present:

```bash
python3 scripts/build_frames.py   # needs ffmpeg, Pillow, numpy
```

It regenerates `public/film`, `public/dishes` and `src/lib/films.ts`.

## Content

Menu, prices, phone (0305-9555838) and branch addresses are transcribed from [@nallipurbiryanipulao](https://www.instagram.com/nallipurbiryanipulao/). Prices may change — update `src/lib/brand.ts`.
