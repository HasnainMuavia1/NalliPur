"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { JUMP, markFilmReady, prefersReducedMotion, registerFilm } from "@/lib/scroll";

/*
  Scroll-scrubbed film: pre-extracted JPEG frames drawn to a sticky canvas.

  Memory is the constraint that matters (a decoded 1280px frame is ~4MB):
  - frames are fetched as compressed WebP Blobs (~60KB each) and never kept as <img>
  - only a small window around the playhead is decoded to ImageBitmaps, already
    resized to the canvas, and everything outside it is closed immediately
  - a film that scrolls out of range releases all of its bitmaps
  Loading is progressive (coarse stride first) so the scrub works early.
*/

export type FrameSet = { dir: string; count: number };

type Props = {
  id: string;
  desktop: FrameSet;
  mobile: FrameSet;
  /** total scroll length of the section, in viewport heights */
  heightVh: number;
  /** horizontal focal point (0..1) kept in view when a desktop frame is cover-cropped */
  focalX?: number;
  /** maps section progress (0..1) to film position (0..1) */
  frameMap?: (p: number) => number;
  /** black overlay alpha as a function of progress */
  blackout?: (p: number) => number;
  /** p = section progress; pinned = the stage currently fills the viewport */
  onProgress?: (p: number, pinned: boolean) => void;
  /** pull the section up by one viewport so its stage pins exactly as the
      previous film's stage releases (both must meet on black) */
  overlapPrev?: boolean;
  /** load immediately instead of when the section approaches */
  eager?: boolean;
  /** expose the drawing canvas (e.g. for a WebGL pass) */
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  /** called after each draw, so a WebGL layer can upload the new frame */
  onDraw?: () => void;
  hideCanvas?: boolean;
  label: string;
  children?: ReactNode;
  className?: string;
  sectionId?: string;
};

const AHEAD = 8;
const KEEP = 12;
const MAX_FETCH = 6;
const MAX_DECODE = 3;

const pad = (n: number) => String(n).padStart(4, "0");

// dev contract (?jump only): expose which frame each film wants vs. has drawn,
// so the recording/screenshot harness can wait for exact frames
type FilmState = { shown?: number; want?: number; near?: boolean };
function filmState(id: string, patch: FilmState) {
  const w = window as unknown as { __filmState?: Record<string, FilmState> };
  w.__filmState = w.__filmState || {};
  w.__filmState[id] = { ...w.__filmState[id], ...patch };
}

export default function FrameFilm({
  id,
  desktop,
  mobile,
  heightVh,
  focalX = 0.5,
  frameMap = (p) => p,
  blackout,
  onProgress,
  overlapPrev = false,
  eager = false,
  canvasRef: externalCanvasRef,
  onDraw,
  hideCanvas = false,
  label,
  children,
  className = "",
  sectionId,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ownCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef ?? ownCanvasRef;
  const blackRef = useRef<HTMLDivElement>(null);

  const cb = useRef({ frameMap, blackout, onProgress, onDraw });
  cb.current = { frameMap, blackout, onProgress, onDraw };

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const reduced = prefersReducedMotion();
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const set = isMobile ? mobile : desktop;
    const COUNT = set.count;
    const fx = isMobile ? 0.5 : focalX; // mobile frames are pre-cropped around the subject
    const src = (i: number) => `${set.dir}/f_${pad(i + 1)}.webp`;

    if (eager || JUMP !== null) registerFilm(id);

    const blobs: (Blob | undefined)[] = new Array(COUNT);
    let blobCount = 0;
    const bitmaps = new Map<number, ImageBitmap>();
    const decoding = new Set<number>();
    let decodeInflight = 0;
    let center = 0;
    let drawnBitmap: ImageBitmap | null = null;
    let current = 0;
    let lastP = -1;
    let lastPinned = false;
    let lastShown = true;
    let forceDraw = true;
    let running = false;
    let started = false;
    let near = false;
    let raf = 0;
    let dead = false;
    let cw = 0;
    let ch = 0;
    let srcW = 0;
    let srcH = 0;

    // ---- fetch: progressive order (0, last, then halving strides)
    const order: number[] = [];
    const seen = new Uint8Array(COUNT);
    const push = (i: number) => {
      if (i >= 0 && i < COUNT && !seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    };
    push(0);
    push(COUNT - 1);
    for (let s = 16; s >= 1; s >>= 1) for (let i = 0; i < COUNT; i += s) push(i);
    let cursor = 0;
    let fetching = 0;
    const pump = () => {
      while (!dead && fetching < MAX_FETCH && cursor < order.length) {
        const i = order[cursor++];
        fetching++;
        fetch(src(i))
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
          .then((b) => {
            blobs[i] = b;
            blobCount++;
            if (blobCount === COUNT || (JUMP === null && blobCount >= Math.min(COUNT, 20))) markFilmReady(id);
            schedule();
          })
          .catch(() => {})
          .finally(() => {
            fetching--;
            pump();
          });
      }
    };
    const startLoading = () => {
      if (started) return;
      started = true;
      pump();
    };

    // ---- decode a window around the playhead, resized to the canvas
    const coverSize = (): ImageBitmapOptions => {
      if (!srcW || !cw) return {};
      const s = Math.max(cw / srcW, ch / srcH);
      return { resizeWidth: Math.round(srcW * s), resizeHeight: Math.round(srcH * s), resizeQuality: "medium" };
    };
    const decode = (i: number) => {
      decoding.add(i);
      decodeInflight++;
      const b = blobs[i]!;
      createImageBitmap(b, coverSize())
        .catch(() => createImageBitmap(b))
        .then((bmp) => {
          if (dead || !near || Math.abs(i - center) > KEEP) bmp.close();
          else {
            bitmaps.get(i)?.close();
            bitmaps.set(i, bmp);
            if (Math.abs(i - Math.round(current)) <= 2) forceDraw = true;
          }
        })
        .catch(() => {})
        .finally(() => {
          decoding.delete(i);
          decodeInflight--;
          schedule();
        });
    };
    function schedule() {
      if (!near || !cw) return;
      for (let d = 0; d <= AHEAD && decodeInflight < MAX_DECODE; d++) {
        for (const i of d === 0 ? [center] : [center + d, center - d]) {
          if (decodeInflight >= MAX_DECODE) return;
          if (i < 0 || i >= COUNT || bitmaps.has(i) || decoding.has(i) || !blobs[i]) continue;
          decode(i);
        }
      }
    }
    const evict = () => {
      for (const [k, b] of bitmaps) {
        if (Math.abs(k - center) > KEEP && b !== drawnBitmap) {
          b.close();
          bitmaps.delete(k);
        }
      }
    };
    const releaseAll = () => {
      for (const [k, b] of bitmaps) {
        if (b !== drawnBitmap) {
          b.close();
          bitmaps.delete(k);
        }
      }
    };

    const nearestBitmap = (idx: number): [number, ImageBitmap] | null => {
      const hit = bitmaps.get(idx);
      if (hit) return [idx, hit];
      for (let d = 1; d <= KEEP * 2; d++) {
        const a = bitmaps.get(idx - d);
        if (a) return [idx - d, a];
        const b = bitmaps.get(idx + d);
        if (b) return [idx + d, b];
      }
      return null;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 1.25);
      cw = Math.round(stage.clientWidth * dpr);
      ch = Math.round(stage.clientHeight * dpr);
      canvas.width = cw;
      canvas.height = ch;
      // bitmaps were sized for the previous canvas; keep the drawn one as a stopgap
      releaseAll();
      forceDraw = true;
      schedule();
    };

    // pos is fractional: the next frame is blended in by the remainder, so the
    // scrub stays continuous even when a scroll step is smaller than one frame
    let drawnPos = -1;
    const draw = (pos: number) => {
      const i0 = Math.floor(pos);
      const f = pos - i0;
      const hit = nearestBitmap(i0);
      if (!hit) return;
      const [at, bmp] = hit;
      const s = Math.max(cw / bmp.width, ch / bmp.height);
      const dw = bmp.width * s;
      const dh = bmp.height * s;
      const dx = (cw - dw) * fx;
      const dy = (ch - dh) / 2;
      ctx.globalAlpha = 1;
      ctx.drawImage(bmp, dx, dy, dw, dh);
      const next = f > 0.02 && at === i0 ? bitmaps.get(i0 + 1) : undefined;
      if (next) {
        ctx.globalAlpha = f;
        ctx.drawImage(next, dx, dy, dw, dh);
        ctx.globalAlpha = 1;
      }
      if (drawnBitmap && drawnBitmap !== bmp && ![...bitmaps.values()].includes(drawnBitmap)) drawnBitmap.close();
      drawnBitmap = bmp;
      // exact = the wanted frame (and its blend partner, if any) were really drawn
      drawnPos = at === i0 && (f <= 0.02 || next || i0 + 1 >= COUNT) ? pos : -1;
      if (JUMP !== null) filmState(id, { shown: drawnPos === pos ? i0 : -1 });
      cb.current.onDraw?.();
    };

    const beats = Array.from(stage.querySelectorAll<HTMLElement>("[data-beat]"));
    const beatState = beats.map(() => -1);

    const tick = () => {
      if (dead) return;
      const r = section.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span <= 0 ? 0 : Math.max(0, Math.min(1, -r.top / span));
      const pinned = r.top <= 1 && r.bottom >= window.innerHeight - 1;
      if (overlapPrev) {
        const shown = r.top <= 1; // invisible while sliding in over the previous film
        if (shown !== lastShown) {
          lastShown = shown;
          stage.style.opacity = shown ? "1" : "0";
        }
      }
      const fm = Math.max(0, Math.min(1, cb.current.frameMap(p)));
      let target = fm * (COUNT - 1);
      if (reduced) {
        target = (Math.round(fm * 4) / 4) * (COUNT - 1); // a few held key frames, no in-betweens
        current = target;
      } else if (JUMP !== null) current = target;
      else {
        current += (target - current) * 0.3;
        if (Math.abs(target - current) < 0.02) current = target;
      }
      const idx = Math.round(current);
      if (JUMP !== null) filmState(id, { want: Math.floor(current), near });
      if (idx !== center) {
        center = idx;
        evict();
        schedule();
      }
      if (Math.abs(current - drawnPos) > 0.01 || forceDraw) {
        forceDraw = false;
        draw(current);
      }

      if (p !== lastP || pinned !== lastPinned) {
        lastP = p;
        lastPinned = pinned;
        if (blackRef.current && cb.current.blackout) blackRef.current.style.opacity = String(cb.current.blackout(p));
        // beats are class-toggled: CSS runs the entrance/exit, the scroll tick only flips state
        beats.forEach((el, i) => {
          const on = p >= parseFloat(el.dataset.in!) && p <= parseFloat(el.dataset.out!) ? 1 : 0;
          if (on !== beatState[i]) {
            beatState[i] = on;
            el.classList.toggle("is-on", !!on);
            el.toggleAttribute("inert", !on);
          }
        });
        cb.current.onProgress?.(p, pinned);
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // learn the source size from frame 0 and show it immediately
    fetch(src(0))
      .then((r) => r.blob())
      .then((b) => createImageBitmap(b))
      .then((bmp) => {
        srcW = bmp.width;
        srcH = bmp.height;
        if (dead || bitmaps.has(0)) return bmp.close();
        bitmaps.set(0, bmp);
        forceDraw = true;
        if (!running) tick();
      })
      .catch(() => {});

    resize();
    window.addEventListener("resize", resize);

    const loadIO = new IntersectionObserver((e) => e[0].isIntersecting && startLoading(), {
      rootMargin: "150% 0px 150% 0px",
    });
    const runIO = new IntersectionObserver(
      (e) => {
        near = e[0].isIntersecting;
        if (near) {
          start();
          schedule();
        } else {
          stop();
          releaseAll();
        }
      },
      { rootMargin: "60% 0px 60% 0px" }
    );
    loadIO.observe(section);
    runIO.observe(section);
    if (eager || JUMP !== null) startLoading();
    requestAnimationFrame(() => {
      const was = running;
      running = false;
      tick();
      running = was;
    });

    return () => {
      dead = true;
      stop();
      loadIO.disconnect();
      runIO.disconnect();
      window.removeEventListener("resize", resize);
      for (const b of bitmaps.values()) b.close();
      bitmaps.clear();
    };
    // the engine is configured once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      aria-label={label}
      className={`relative ${className}`}
      style={{ height: `${heightVh}vh`, marginTop: overlapPrev ? "-100vh" : undefined }}
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-coal">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ visibility: hideCanvas ? "hidden" : "visible" }}
        />
        {blackout && (
          <div ref={blackRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-coal" style={{ opacity: 0 }} />
        )}
        {children}
      </div>
    </section>
  );
}
