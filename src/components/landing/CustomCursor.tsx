"use client";

import { useEffect, useRef } from "react";

/**
 * Minimal custom cursor (desktop only): a small cyan dot that tracks the pointer
 * tightly, and a larger ring that lags slightly and scales up over interactive
 * elements. Disabled on touch devices and under prefers-reduced-motion (via CSS).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("sa-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      const size = ring.classList.contains("hovering") ? 28 : 16;
      ring.style.transform = `translate(${ringX - size}px, ${ringY - size}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const interactiveSel = "a, button, [data-cursor='hover'], input, textarea, select, [role='button']";
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(interactiveSel)) ring.classList.add("hovering");
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(interactiveSel)) ring.classList.remove("hovering");
    };
    const onLeave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };
    const onEnter = () => { dot.style.opacity = "1"; ring.style.opacity = "1"; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("sa-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="sa-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="sa-cursor-ring" aria-hidden="true" />
    </>
  );
}
