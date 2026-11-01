"use client";

import { useEffect, useRef, useState } from "react";
import { PHONE_TEL } from "@/lib/brand";
import { subscribeChapter } from "@/lib/scroll";

const NAV = [
  { href: "#serve", label: "Signature" },
  { href: "#bbq", label: "BBQ" },
  { href: "#menu", label: "Menu" },
  { href: "#daig", label: "Mini Daig" },
  { href: "#visit", label: "Visit" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#menu"
        className="sr-only z-[60] bg-ivory px-4 py-2 text-coal focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to menu
      </a>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-none absolute inset-0 h-32 bg-gradient-to-b from-coal/80 via-coal/30 to-transparent" />
        <div className="relative flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
          <a href="#serve" aria-label="Nalli Pur — back to top" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.webp" alt="Nalli Pur — Biryani & Pulao" width={867} height={384} className="h-9 w-auto md:h-11" />
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-[family-name:var(--font-display)] text-base uppercase tracking-wide text-ivory/85 transition-colors hover:text-yellow"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="#order" className="btn btn-yellow !px-4 !py-2 !text-sm md:!px-5 md:!text-base">
              Order now
            </a>
            <button
              ref={menuBtn}
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`h-px w-6 bg-ivory transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-6 bg-ivory transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-brand-red px-8 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="display pop-white block text-6xl"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={PHONE_TEL} tabIndex={open ? 0 : -1} className="btn btn-yellow mt-10">
            Call 0305-9555838
          </a>
        </nav>
      </div>

      <ChapterReadout />
    </>
  );
}

function ChapterReadout() {
  const idx = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeChapter((c) => {
      if (idx.current) idx.current.textContent = c.index;
      if (title.current) title.current.textContent = c.title;
      if (bar.current) bar.current.style.transform = `scaleX(${c.progress})`;
    });
    // hide once the film is over
    const menu = document.getElementById("stories") ?? document.getElementById("menu");
    const io = new IntersectionObserver(
      ([e]) => {
        if (wrap.current) wrap.current.style.opacity = e.boundingClientRect.top < window.innerHeight ? "0" : "1";
      },
      { threshold: [0, 0.01] }
    );
    if (menu) io.observe(menu);
    return () => {
      unsub();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-8 right-8 z-30 hidden items-center gap-3 rounded-full border-[2.5px] border-black bg-ivory py-1.5 pl-2 pr-5 text-black shadow-[4px_4px_0_#000] transition-opacity duration-500 md:flex"
    >
      <span ref={idx} className="display grid h-9 w-9 place-items-center rounded-full bg-brand-red text-lg text-yellow">
        01
      </span>
      <span className="flex flex-col gap-1.5">
        <span ref={title} className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/80">
          The Arrival
        </span>
        <span className="block h-1 w-28 overflow-hidden rounded-full bg-black/15">
          <span ref={bar} className="block h-1 w-full origin-left bg-brand-red" style={{ transform: "scaleX(0)" }} />
        </span>
      </span>
    </div>
  );
}
