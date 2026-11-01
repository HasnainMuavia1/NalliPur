"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import FrameFilm from "./FrameFilm";
import { PosterFrame, Slap, step } from "./Poster";
import { FILM_SERVE } from "@/lib/films";
import { FLAVORS, WHATSAPP } from "@/lib/brand";
import { scrollToTarget, setChapter } from "@/lib/scroll";

/*
  Chapters 01–04 share one sticky stage:
  01 arrival (the empty plate, light comes up) · 02 rice cascade
  03 nalli lands + orbit · 04 four flavors (matched stills)
  The orbit's last frame is the beef-biryani still, so the hand-off to the
  dish selector is invisible.
*/

const P = {
  arrive: 0.05,
  riceEnd: 0.3,
  nalliEnd: 0.48,
  orbitEnd: 0.64, // film ends; flavors begin
  flavorsEnd: 0.97,
};
const { riceFrac, nalliFrac } = FILM_SERVE.segments;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

function frameMap(p: number) {
  if (p < P.arrive) return 0;
  if (p < P.riceEnd) return lerp(0, riceFrac, seg(p, P.arrive, P.riceEnd));
  if (p < P.nalliEnd) return lerp(riceFrac, nalliFrac, seg(p, P.riceEnd, P.nalliEnd));
  return lerp(nalliFrac, 1, seg(p, P.nalliEnd, P.orbitEnd));
}
// the plate emerges from darkness; at the very end the stage sinks to black for the fire
const blackout = (p: number) => (p < P.arrive ? lerp(0.55, 0, seg(p, 0, P.arrive)) : seg(p, P.flavorsEnd, 1));

const FLAVOR_SPAN = (P.flavorsEnd - P.orbitEnd) / FLAVORS.length;
const flavorAt = (p: number) => Math.min(FLAVORS.length - 1, Math.max(0, Math.floor((p - P.orbitEnd) / FLAVOR_SPAN)));

const CHAPTERS = [
  { until: 0.09, index: "01", title: "The Arrival", from: 0 },
  { until: P.riceEnd, index: "02", title: "The Rice Cascade", from: 0.09 },
  { until: P.orbitEnd, index: "03", title: "The Signature Nalli", from: P.riceEnd },
  { until: 1, index: "04", title: "The Four Flavors", from: P.orbitEnd },
];

const COPY_LEFT =
  "beat absolute inset-x-0 bottom-0 px-6 pb-24 md:inset-y-0 md:left-0 md:right-auto md:flex md:flex-col md:justify-center md:px-16 md:pb-0 lg:px-24";

export default function ServeFilm() {
  const [active, setActive] = useState(0);
  const [flavorsOn, setFlavorsOn] = useState(false);
  const activeRef = useRef(0);
  const onRef = useRef(false);
  const sinkRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((p: number, pinned: boolean) => {
    // the dish stills sit above the film's own blackout, so sink them here
    if (sinkRef.current) sinkRef.current.style.opacity = String(seg(p, P.flavorsEnd, 1));
    const on = p >= P.orbitEnd - 0.002;
    if (on !== onRef.current) {
      onRef.current = on;
      setFlavorsOn(on);
    }
    const i = on ? flavorAt(p) : 0;
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
    }
    if (!pinned) return;
    const c = CHAPTERS.find((c) => p < c.until) ?? CHAPTERS[3];
    setChapter({ index: c.index, title: c.title, progress: seg(p, c.from, c.until) });
  }, []);

  const goToFlavor = (i: number) => {
    const el = document.getElementById("serve");
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    scrollToTarget(el.offsetTop + (P.orbitEnd + FLAVOR_SPAN * (i + 0.5)) * span);
  };

  const dish = FLAVORS[active];

  return (
    <FrameFilm
      id="serve"
      sectionId="serve"
      label="Scroll to serve: a platter of nalli biryani assembles"
      desktop={FILM_SERVE.desktop}
      mobile={FILM_SERVE.mobile}
      heightVh={760}
      focalX={0.6}
      frameMap={frameMap}
      blackout={blackout}
      onProgress={onProgress}
      eager
    >
      {/* 04 — matched dish stills, same platter as the film's last frame */}
      <div aria-hidden={!flavorsOn} className="absolute inset-0 transition-opacity duration-700 ease-out [--fx:50%] md:[--fx:60%]" style={{ opacity: flavorsOn ? 1 : 0 }}>
        {FLAVORS.map((f, i) => (
          <picture key={f.id}>
            <source media="(max-width: 767px)" srcSet={`/dishes/${f.image}-m.webp`} />
            <img
              src={`/dishes/${f.image}.webp`}
              alt={i === active ? `${f.name} on a matte-black platter` : ""}
              className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out"
              style={{
                objectPosition: "var(--fx) 50%",
                opacity: i === active ? 1 : 0,
                transform: i === active ? "none" : "scale(1.03)",
              }}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </picture>
        ))}
      </div>

      <div className="copy-wash" />
      <div className="vignette" />
      <PosterFrame />

      {/* 01 — arrival */}
      <div data-beat data-in="-1" data-out="0.085" className={COPY_LEFT}>
        <p className="eyebrow rise mb-4" style={step(0)}>
          Nalli Pur · Asli Karachi swaad · Lahore
        </p>
        <Slap
          as="h1"
          className="text-[clamp(3.4rem,8.4vw,8.6rem)]"
          lines={[
            { text: "Nalli di", tone: "pop-white", r: -4 },
            { text: "gall hi", tone: "pop-white", r: 1 },
            { text: "wakhri ae!", r: -3 },
          ]}
        />
        <p className="rise mt-6 max-w-md text-base text-ivory/85 md:text-lg" style={step(3)}>
          <strong className="font-semibold text-ivory">Bone-deep flavor.</strong> Biryani. Pulao. BBQ. A feast worth
          discovering.
        </p>
      </div>

      {/* urdu wordmark stamp */}
      <div
        data-beat
        data-in="-1"
        data-out="0.085"
        className="beat pointer-events-none absolute right-[6%] top-[16%] hidden md:block"
        aria-hidden="true"
      >
        <span className="urdu stamp pop block text-[clamp(4rem,8vw,8rem)]" style={{ "--i": 4, "--r": "8deg" } as CSSProperties}>
          نلی پور
        </span>
      </div>

      {/* scroll cue */}
      <div data-beat data-in="-1" data-out="0.03" className="beat absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-10">
        <span
          className="rise cue flex items-center gap-3 rounded-full border-2 border-black bg-yellow px-4 py-2 font-[family-name:var(--font-display)] text-sm uppercase tracking-wide text-black shadow-[3px_3px_0_#000]"
          style={step(5)}
        >
          Scroll to serve <span aria-hidden="true">↓</span>
        </span>
      </div>

      {/* 02 — rice cascade */}
      <div data-beat data-in="0.1" data-out="0.28" className={COPY_LEFT}>
        <p className="eyebrow rise mb-4">02 — The rice cascade</p>
        <Slap
          className="text-[clamp(3rem,6.6vw,6.6rem)]"
          lines={[
            { text: "Daana daana,", tone: "pop-white", r: -3 },
            { text: "swaad naal", r: 2 },
            { text: "bhareya!", r: -2 },
          ]}
        />
        <p className="rise mt-5 max-w-sm text-ivory/80" style={step(3)}>
          Every grain loaded with flavour — long basmati, streaked saffron-gold and white.
        </p>
      </div>

      {/* 03 — the signature nalli */}
      <div data-beat data-in="0.42" data-out="0.625" className={COPY_LEFT}>
        <p className="eyebrow rise mb-4">03 — The legend is served</p>
        <Slap
          className="text-[clamp(3rem,7vw,7rem)]"
          lines={[
            { text: "Nalli aa gayi,", tone: "pop-white", r: -3 },
            { text: "hun gall", r: 2 },
            { text: "mukk gayi!", r: -2 },
          ]}
        />
        <p className="rise mt-5 max-w-sm text-ivory/80" style={step(3)}>
          Thick cross-cut beef marrow bones — the nalli — on Karachi-style biryani.
        </p>
        <div className="rise mt-8" style={step(4)}>
          <a href="#menu" className="btn btn-yellow" data-menu-tab="nalli">
            Explore Nalli Biryani <span className="arrow">→</span>
          </a>
        </div>
      </div>

      {/* 04 — the four flavors */}
      <div
        className="absolute inset-x-0 bottom-0 px-4 pb-5 transition-opacity duration-300 md:inset-y-0 md:left-0 md:right-auto md:flex md:w-[min(36rem,44vw)] md:flex-col md:justify-center md:px-16 md:pb-0 lg:px-24"
        style={{ opacity: flavorsOn ? 1 : 0, pointerEvents: flavorsOn ? "auto" : "none" }}
        aria-hidden={!flavorsOn}
        inert={!flavorsOn}
      >
        <h2 className="display pop mb-4 -rotate-2 text-[clamp(2.2rem,4.4vw,4rem)]">Kehri khaani ae?</h2>
        <div role="tablist" aria-label="Choose a dish" className="mb-4 flex flex-wrap gap-2">
          {FLAVORS.map((f, i) => (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls="flavor-panel"
              onClick={() => goToFlavor(i)}
              className={`rounded-full border-2 border-black px-3.5 py-1.5 font-[family-name:var(--font-display)] text-sm uppercase tracking-wide transition-transform duration-200 md:text-base ${
                i === active
                  ? "-rotate-2 bg-yellow text-black shadow-[3px_3px_0_#000]"
                  : "bg-ivory/90 text-black/80 hover:-rotate-1 hover:bg-ivory"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* the dish card: a cream sticker with a red header band */}
        <div
          id="flavor-panel"
          role="tabpanel"
          aria-live="polite"
          key={dish.id}
          className="max-w-md origin-bottom-left animate-[fadeUp_.45s_cubic-bezier(.34,1.56,.64,1)] overflow-hidden rounded-2xl border-[2.5px] border-black bg-ivory text-black shadow-[6px_6px_0_#000]"
        >
          <div className="flex items-center justify-between bg-brand-red px-5 py-2.5 text-ivory">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em]">{dish.kicker}</span>
            <span className="display text-yellow">from Rs {dish.from}</span>
          </div>
          <div className="px-5 pb-5 pt-4">
            <h3 className="display text-[clamp(2rem,3.4vw,3rem)] text-black">{dish.name}</h3>
            <p className="mt-2 hidden text-sm leading-relaxed text-black/75 sm:block">{dish.body}</p>
            <p className="mt-3 text-sm font-semibold">Rs {dish.prices}</p>
            <p className="text-xs text-black/60">{dish.extra}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href={`${WHATSAPP}?text=${encodeURIComponent(`Assalam o Alaikum, I'd like to order ${dish.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-yellow !py-2.5 !text-base"
              >
                Order now <span className="arrow">→</span>
              </a>
              <a href="#menu" className="btn btn-white !py-2.5 !text-base">
                Full menu
              </a>
            </div>
          </div>
        </div>
      </div>

      <div ref={sinkRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-coal" style={{ opacity: 0 }} />

      {/* ember glow rising as the stage sinks to black — the hand-off to the fire */}
      <div
        data-beat
        data-in="0.955"
        data-out="2"
        aria-hidden="true"
        className="beat pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 60% at 55% 115%, rgba(248,108,0,0.55) 0%, rgba(200,0,10,0.25) 35%, transparent 70%)",
        }}
      />
    </FrameFilm>
  );
}
