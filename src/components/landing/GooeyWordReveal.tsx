"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";

/* -----------------------------------------------------------------------------
 * Gooey word reveal — words blur/morph in one by one (gooey threshold filter),
 * assemble into a full line, hold for `holdSeconds`, then the cycle repeats.
 * Re-themed from the 21st.dev gooey-text effect; our fonts/colours via props.
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
      els.forEach((e) => { e.style.opacity = "1"; e.style.filter = "none"; });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(els, { opacity: 0, filter: "blur(14px)" });
      const tl = gsap.timeline({ repeat: -1, delay: startDelay });
      // reveal word by word
      tl.to(els, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.26,
      });
      // hold the full line, then blur it all back out
      tl.to(els, {
        opacity: 0,
        filter: "blur(14px)",
        duration: 0.7,
        ease: "power2.in",
        stagger: 0.05,
      }, `+=${holdSeconds}`);
      // brief beat before the cycle repeats
      tl.to({}, { duration: 0.45 });
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
          gap: "0.32em",
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
