"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";

/* -----------------------------------------------------------------------------
 * Gooey word reveal — words morph in one by one through a blur-threshold filter
 * (the 21st.dev gooey-text look), assemble into the full line, hold for
 * `holdSeconds`, then blur back out and the cycle loops forever.
 * Re-themed: our fonts/colours via props.
 * -------------------------------------------------------------------------- */

interface GooeyWordRevealProps {
  text: string;
  holdSeconds?: number;
  startDelay?: number;
  style?: CSSProperties;
  wordStyle?: CSSProperties;
}

export default function GooeyWordReveal({
  text,
  holdSeconds = 4,
  startDelay = 0.6,
  style,
  wordStyle,
}: GooeyWordRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = text.split(" ");

  useEffect(() => {
    const els = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!els.length) return;

    if (prefersReducedMotion()) {
      els.forEach((e) => { e.style.opacity = "1"; e.style.filter = "blur(0px)"; });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(els, { opacity: 0, filter: "blur(18px)", scale: 0.92 });

      const tl = gsap.timeline({ repeat: -1, delay: startDelay });

      // Words morph in one by one — high blur start gives the gooey-merge look
      tl.to(els, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.62,
        ease: "power2.out",
        stagger: 0.24,
      });

      // Hold the complete sentence, then dissolve it all back into the goo
      tl.to(els, {
        opacity: 0,
        filter: "blur(18px)",
        scale: 0.96,
        duration: 0.8,
        ease: "power2.in",
        stagger: 0.04,
      }, `+=${holdSeconds}`);

      // brief beat before the loop restarts
      tl.to({}, { duration: 0.5 });
    }, containerRef);

    return () => ctx.revert();
  }, [text, holdSeconds, startDelay]);

  return (
    <div ref={containerRef} style={style}>
      <svg style={{ position: "absolute", height: 0, width: 0 }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="sa-gooey-hero">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.3em",
          filter: "url(#sa-gooey-hero)",
        }}
      >
        {words.map((w, i) => (
          <span
            key={i}
            ref={(el) => { wordRefs.current[i] = el; }}
            style={{ display: "inline-block", whiteSpace: "nowrap", ...wordStyle }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
