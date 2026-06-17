"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./useScrollReveal";

/**
 * Wraps the landing page in Lenis smooth scroll, synced to GSAP's ticker and
 * ScrollTrigger so scroll-driven animations stay perfectly in lockstep with the
 * smoothed scroll position (this is the key to no jank). framer-motion's
 * useScroll reads the same scroll position, so it rides the smoothing too.
 *
 * Scoped to the landing route ONLY — never mount this around /dashboard.
 * Respects prefers-reduced-motion: native scroll, no Lenis.
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      lerp: 0.1,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Single rAF: GSAP ticker drives Lenis, Lenis scroll updates ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
