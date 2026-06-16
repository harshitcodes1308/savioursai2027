"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/* -----------------------------------------------------------------------------
 * Gooey morphing text — adapted from a 21st.dev effect. Cross-fades between
 * phrases with a blur-threshold "gooey" transition. Re-themed: uses our fonts
 * and colours via the `textStyle` prop, no Tailwind tokens.
 * -------------------------------------------------------------------------- */

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  textStyle?: CSSProperties;
  style?: CSSProperties;
}

export default function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 1.4,
  textStyle,
  style,
}: GooeyTextProps) {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    const setMorph = (fraction: number) => {
      if (!text1Ref.current || !text2Ref.current) return;
      text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inv = 1 - fraction;
      text1Ref.current.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      text1Ref.current.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      if (!text1Ref.current || !text2Ref.current) return;
      text2Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "100%";
      text1Ref.current.style.filter = "";
      text1Ref.current.style.opacity = "0%";
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      if (text1Ref.current && text2Ref.current) {
        text1Ref.current.textContent = texts[0];
        text1Ref.current.style.opacity = "100%";
        text2Ref.current.style.opacity = "0%";
      }
      return;
    }

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrement = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;
      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrement) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    };
    animate();

    return () => cancelAnimationFrame(rafRef.current);
  }, [texts, morphTime, cooldownTime]);

  return (
    <div style={{ position: "relative", ...style }}>
      <svg style={{ position: "absolute", height: 0, width: 0 }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="sa-gooey-threshold">
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
          alignItems: "center",
          justifyContent: "center",
          filter: "url(#sa-gooey-threshold)",
        }}
      >
        <span
          ref={text1Ref}
          style={{
            position: "absolute",
            display: "inline-block",
            userSelect: "none",
            textAlign: "center",
            whiteSpace: "nowrap",
            ...textStyle,
          }}
        />
        <span
          ref={text2Ref}
          style={{
            position: "absolute",
            display: "inline-block",
            userSelect: "none",
            textAlign: "center",
            whiteSpace: "nowrap",
            ...textStyle,
          }}
        />
      </div>
    </div>
  );
}
