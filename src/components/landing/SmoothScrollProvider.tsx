"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Wraps the landing page in Lenis smooth scroll.
 * Scoped to the landing route ONLY — never mount this around /dashboard,
 * it interferes with internal scroll containers there.
 *
 * Respects prefers-reduced-motion: when set, Lenis is not initialised and
 * the browser's native scroll is used.
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // Expose so GSAP ScrollTrigger can sync if needed
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
