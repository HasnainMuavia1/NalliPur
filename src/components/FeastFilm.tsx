"use client";

import { useCallback } from "react";
import FrameFilm from "./FrameFilm";
import { PosterFrame, Slap, step } from "./Poster";
import { FILM_FEAST } from "@/lib/films";
import { setChapter } from "@/lib/scroll";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const COPY_LEFT =
  "beat absolute inset-x-0 bottom-0 px-6 pb-16 md:inset-y-0 md:left-0 md:right-auto md:flex md:flex-col md:justify-center md:px-16 md:pb-0 lg:px-24";

export default function FeastFilm() {
  const onProgress = useCallback((p: number, pinned: boolean) => {
    if (pinned) setChapter({ index: "06", title: "The Feast", progress: p });
  }, []);

  return (
    <FrameFilm
      id="feast"
      sectionId="feast"
      label="The feast: a full spread of biryani, pulao and BBQ"
      desktop={FILM_FEAST.desktop}
      mobile={FILM_FEAST.mobile}
      heightVh={340}
      focalX={0.62}
      frameMap={(p) => clamp01((p - 0.03) / 0.69)}
      blackout={(p) => 1 - clamp01(p / 0.07)}
      overlapPrev
      onProgress={onProgress}
      className="z-20"
    >
      <div className="copy-wash" />
      <div className="vignette" />
      <PosterFrame />

      <div data-beat data-in="0.08" data-out="0.55" className={COPY_LEFT + " md:max-w-[44rem]"}>
        <p className="eyebrow rise mb-4">06 — The feast</p>
        <Slap
          className="text-[clamp(2.8rem,6vw,6rem)]"
          lines={[
            { text: "Sab nu bulao,", tone: "pop-white", r: -3 },
            { text: "daawat shuru!", r: 2 },
          ]}
        />
        <p className="rise mt-5 max-w-sm text-ivory/80" style={step(3)}>
          Nalli biryani, pulao and BBQ, with raita, chutney, salad and naan on the side.
        </p>
      </div>

      <div data-beat data-in="0.68" data-out="2" className={COPY_LEFT + " md:max-w-[46rem]"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.webp"
          alt="Nalli Pur — Biryani & Pulao"
          width={867}
          height={384}
          className="stamp mb-5 h-auto w-44 drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)] md:w-56"
          style={{ "--r": "-3deg" } as React.CSSProperties}
        />
        <Slap
          className="text-[clamp(3.2rem,min(8vw,13vh),7.4rem)]"
          lines={[
            { text: "Daawat", tone: "pop-white", r: -4 },
            { text: "tayyar ae!", r: 2 },
          ]}
        />
        <p className="rise mt-4 text-lg font-semibold text-ivory" style={step(2)}>
          Your feast is ready.
        </p>
        <div className="rise mt-7 flex flex-wrap gap-3" style={step(3)}>
          <a href="#order" className="btn btn-yellow">
            Order now <span className="arrow">→</span>
          </a>
          <a href="#menu" className="btn btn-white">
            Explore full menu
          </a>
        </div>
      </div>
    </FrameFilm>
  );
}
