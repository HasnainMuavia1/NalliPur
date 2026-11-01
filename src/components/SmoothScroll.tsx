"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JUMP, markJumpDone, prefersReducedMotion, win } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const w = win()!;
    if (JUMP !== null) {
      // dev contract: land pre-scrolled, no smoothing, settle everything
      history.scrollRestoration = "manual";
      const go = () => {
        window.scrollTo(0, JUMP!);
        ScrollTrigger.refresh();
        ScrollTrigger.update();
        markJumpDone();
      };
      if (document.readyState === "complete") requestAnimationFrame(go);
      else window.addEventListener("load", () => requestAnimationFrame(go), { once: true });
      return;
    }
    if (prefersReducedMotion()) {
      w.__lenis = null;
      return;
    }

    const lenis = new Lenis({ lerp: 0.13, smoothWheel: true, wheelMultiplier: 1.1, touchMultiplier: 1.4 });
    w.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // in-page anchor links glide instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      lenis.scrollTo(id, { duration: 1.6 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      w.__lenis = null;
    };
  }, []);

  return null;
}
