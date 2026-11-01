"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, win } from "@/lib/scroll";

/* Tilted poster ribbon. Drifts on its own; scrolling pushes it faster and skews
   it in the direction of travel, then it springs back. */

const WORDS = [
  "نلی پور",
  "Nalli di gall hi wakhri ae",
  "Asli tay nasli",
  "Karachi da swaad, Lahore vich",
  "بریانی · پلاؤ",
  "Koylay di aag",
  "Daawat tayyar ae",
];

export default function Ticker({ tone = "yellow", tilt = -2.5 }: { tone?: "yellow" | "red"; tilt?: number }) {
  const track = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let x = 0;
    let skew = 0;
    let raf = 0;
    let visible = false;
    let lastY = window.scrollY;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(wrap.current!);
    function loop() {
      if (!visible) return;
      const lenis = win()?.__lenis;
      const y = window.scrollY;
      const v = lenis ? lenis.velocity : y - lastY;
      lastY = y;
      x -= 0.6 + Math.min(Math.abs(v) * 0.35, 14);
      const half = track.current!.scrollWidth / 2;
      if (-x >= half) x += half;
      skew += (Math.max(-12, Math.min(12, v * 0.4)) - skew) * 0.12;
      track.current!.style.transform = `translate3d(${x}px,0,0) skewX(${-skew}deg)`;
      raf = requestAnimationFrame(loop);
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const items = [...WORDS, ...WORDS];
  return (
    // the ribbon is tilted and scaled past the edges; this wrapper clips it to the page width
    <div className="relative z-30 -my-6 overflow-x-clip py-6">
    <div
      ref={wrap}
      aria-hidden="true"
      className={`relative overflow-hidden border-y-[3px] border-black py-3 ${
        tone === "yellow" ? "bg-yellow text-black" : "bg-brand-red text-ivory"
      }`}
      style={{ transform: `rotate(${tilt}deg) scale(1.05)` }}
    >
      <div ref={track} className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className={`${/[؀-ۿ]/.test(w) ? "urdu text-3xl md:text-4xl" : "display text-2xl md:text-3xl"}`}>{w}</span>
            <span className="text-xl" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
    </div>
  );
}
