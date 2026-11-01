"use client";

import { useEffect, useRef } from "react";
import { PosterFrame, Slap, step } from "./Poster";

/*
  The brand's poster characters, recreated as full-bleed scenes. Each panel is
  sticky, so the next one slides up over it like a stack of posters; the
  headline slaps in when the panel arrives.
*/

const STORIES = [
  {
    id: "gussa",
    img: "woman",
    alt: "A woman in a red dupatta guarding her thaal of beef nalli biryani",
    lines: [
      { text: "Menu gussa", tone: "pop-white" as const, r: -3 },
      { text: "odon hi aunda ae", r: 1 },
    ],
    tail: "jadon nalli share karni pave",
    en: "Nobody likes sharing their nalli.",
  },
  {
    id: "thaal",
    img: "man",
    alt: "A stern man in a white turban seated before a thaal of beef nalli biryani",
    lines: [
      { text: "Jis thaal wich", tone: "pop-white" as const, r: -2 },
      { text: "nalli biryani hove", r: 2 },
    ],
    tail: "uthon kadi nahi uthday",
    en: "Where there's nalli biryani, nobody gets up.",
  },
];

export default function Stories() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const beats = root.current!.querySelectorAll<HTMLElement>("[data-story]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          e.target.classList.toggle("is-on", e.isIntersecting);
          e.target.querySelectorAll(".beat").forEach((b) => b.classList.toggle("is-on", e.isIntersecting));
        }),
      { threshold: 0.55 }
    );
    beats.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} id="stories" className="relative z-10" aria-label="Nalli Pur stories">
      {STORIES.map((s, i) => (
        <section
          key={s.id}
          className="sticky top-0 h-[100svh] overflow-hidden bg-coal"
          style={{ zIndex: i + 1, boxShadow: i ? "0 -30px 60px rgba(0,0,0,.55)" : undefined }}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={`/stories/${s.img}-m.webp`} />
            <img src={`/stories/${s.img}.webp`} alt={s.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[70%_50%]" />
          </picture>
          <div className="copy-wash" />
          <div className="vignette" />
          <div data-story className="beat absolute inset-0">
            <PosterFrame />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-20 md:inset-y-0 md:left-0 md:right-auto md:flex md:max-w-[46rem] md:flex-col md:justify-center md:px-16 md:pb-0 lg:px-24">
              <Slap className="text-[clamp(2.8rem,6.4vw,6.4rem)]" lines={s.lines} />
              <p className="display pop-white rise mt-3 -rotate-1 text-[clamp(1.3rem,2.4vw,2.2rem)]" style={step(2)}>
                {s.tail}
              </p>
              <p className="rise mt-4 text-ivory/80" style={step(3)}>
                {s.en}
              </p>
              <div className="rise mt-7" style={step(4)}>
                <a href="#order" className="btn btn-yellow">
                  Apni nalli mangwao <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
