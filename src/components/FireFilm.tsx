"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import FrameFilm from "./FrameFilm";
import { PosterFrame, Slap, step } from "./Poster";
import { FILM_FIRE } from "@/lib/films";
import { prefersReducedMotion, setChapter } from "@/lib/scroll";

const HeatLayer = dynamic(() => import("./HeatLayer"), { ssr: false });

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// rises out of black, sinks back into black for the feast
const blackout = (p: number) => Math.max(1 - clamp01(p / 0.08), clamp01((p - 0.94) / 0.06));

const HIGHLIGHTS = [
  ["Chicken Behari Tikka", "House special"],
  ["Special Beef Behari Boti", "Highlight of Karachi"],
  ["Beef Seekh Kebab", "Koylay pe"],
  ["Chicken Malai Boti", "Boneless"],
];

const COPY_LEFT =
  "beat absolute inset-x-0 bottom-0 px-6 pb-20 md:inset-y-0 md:left-0 md:right-auto md:flex md:flex-col md:justify-center md:px-16 md:pb-0 lg:px-24";

export default function FireFilm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirty = useRef(true);
  const [gl, setGl] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  useEffect(() => {
    // the heat pass is a desktop enhancement: skip on phones, reduced motion or without WebGL
    if (prefersReducedMotion() || window.matchMedia("(max-width: 1023px)").matches) return;
    try {
      const c = document.createElement("canvas");
      if (c.getContext("webgl2") || c.getContext("webgl")) setWebgl(true);
    } catch {
      /* the plain film is shown */
    }
  }, []);

  const onProgress = useCallback((p: number, pinned: boolean) => {
    const on = pinned && p > 0.02 && p < 0.99;
    if (on !== activeRef.current) {
      activeRef.current = on;
      setActive(on);
    }
    if (pinned) setChapter({ index: "05", title: "The Fire", progress: p });
  }, []);

  return (
    <FrameFilm
      id="fire"
      sectionId="bbq"
      label="Born from fire: Karachi-style charcoal BBQ"
      desktop={FILM_FIRE.desktop}
      mobile={FILM_FIRE.mobile}
      heightVh={320}
      overlapPrev
      className="z-10"
      focalX={0.45}
      frameMap={(p) => clamp01((p - 0.02) / 0.94)}
      blackout={blackout}
      onProgress={onProgress}
      canvasRef={canvasRef}
      onDraw={() => (dirty.current = true)}
      hideCanvas={gl}
    >
      {webgl && <HeatLayer source={canvasRef} dirty={dirty} active={active} onReady={() => setGl(true)} />}
      <div className="copy-wash" />
      <div className="vignette" />
      <PosterFrame />

      <div data-beat data-in="0.08" data-out="0.5" className={COPY_LEFT}>
        <p className="eyebrow rise mb-4">05 — Born from fire</p>
        <Slap
          className="text-[clamp(3.2rem,8vw,8.4rem)]"
          lines={[
            { text: "Koylay di aag,", tone: "pop-white", r: -3 },
            { text: "Karachi da", r: 2 },
            { text: "swaad!", tone: "orange", r: -4 },
          ]}
        />
        <p className="rise mt-6 max-w-sm text-ivory/80" style={step(3)}>
          Authentic Karachi-style BBQ — tikka, kebab and boti over glowing charcoal.
        </p>
      </div>

      <div data-beat data-in="0.5" data-out="0.93" className={COPY_LEFT + " md:w-[min(34rem,44vw)]"}>
        <h2 className="display pop rise mb-5 -rotate-2 text-[clamp(2.2rem,4vw,3.6rem)]">BBQ di list</h2>
        <ul className="space-y-2.5">
          {HIGHLIGHTS.map(([name, note], i) => (
            <li
              key={name}
              className="rise flex items-center justify-between gap-4 rounded-full border-2 border-black bg-ivory py-2 pl-5 pr-2 text-black shadow-[4px_4px_0_#000]"
              style={{ ...step(i + 1), rotate: `${i % 2 ? 1 : -1}deg` }}
            >
              <span className="display text-[clamp(1.1rem,1.8vw,1.6rem)]">{name}</span>
              <span className="shrink-0 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-ivory">{note}</span>
            </li>
          ))}
        </ul>
        <div className="rise mt-7" style={step(6)}>
          <a href="#menu" className="btn btn-yellow" data-menu-tab="bbq">
            Poora BBQ menu <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </FrameFilm>
  );
}
