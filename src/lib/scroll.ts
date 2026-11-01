"use client";

import type Lenis from "lenis";

/* Shared, framework-free scroll state. Films and UI read from here so no React
   re-render ever sits on the scroll hot path. */

type Win = Window & {
  __lenis?: Lenis | null;
  __ready?: boolean;
  __films?: Record<string, { ready: boolean }>;
};

export const win = () => (typeof window === "undefined" ? null : (window as Win));

export const JUMP: number | null = (() => {
  if (typeof window === "undefined") return null;
  const j = new URLSearchParams(window.location.search).get("jump");
  return j === null ? null : Number(j) || 0;
})();

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function scrollToTarget(target: string | number, offset = 0) {
  const w = win();
  if (!w) return;
  const lenis = w.__lenis;
  if (lenis) {
    lenis.scrollTo(target as string | number, { offset, duration: 1.6 });
    return;
  }
  const y =
    typeof target === "number"
      ? target
      : (document.querySelector(target)?.getBoundingClientRect().top ?? 0) + window.scrollY + offset;
  window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/* Films register here; __ready flips once every registered film reports ready. */
export function registerFilm(id: string) {
  const w = win();
  if (!w) return;
  w.__films = w.__films || {};
  w.__films[id] = { ready: false };
}
export function markFilmReady(id: string) {
  const w = win();
  if (!w?.__films?.[id]) return;
  w.__films[id].ready = true;
  checkReady();
}
let jumpDone = JUMP === null;
export function markJumpDone() {
  jumpDone = true;
  checkReady();
}
function checkReady() {
  const w = win();
  if (!w || w.__ready) return;
  const films = Object.values(w.__films || {});
  if (jumpDone && films.length && films.every((f) => f.ready)) {
    // two frames so every film has drawn its settled state
    requestAnimationFrame(() => requestAnimationFrame(() => (w.__ready = true)));
  }
}

/* Chapter readout store */
type Chapter = { index: string; title: string; progress: number };
let chapter: Chapter = { index: "01", title: "The Arrival", progress: 0 };
const subs = new Set<(c: Chapter) => void>();
export function setChapter(next: Chapter) {
  if (
    next.index === chapter.index &&
    Math.abs(next.progress - chapter.progress) < 0.004
  )
    return;
  chapter = next;
  subs.forEach((s) => s(chapter));
}
export function subscribeChapter(fn: (c: Chapter) => void) {
  subs.add(fn);
  fn(chapter);
  return () => {
    subs.delete(fn);
  };
}
