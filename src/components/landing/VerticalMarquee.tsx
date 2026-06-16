"use client";

import { type ReactNode } from "react";

/* -----------------------------------------------------------------------------
 * Vertical marquee — adapted from the 21st.dev 3d-testimonials Marquee.
 * Re-themed to inline styles + our landing.css keyframes. Loops `children`
 * vertically; `reverse` flips direction, `pauseOnHover` halts on hover.
 * -------------------------------------------------------------------------- */

interface VMarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  repeat?: number;
  durationSec?: number;
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
}

export default function VerticalMarquee({
  children,
  reverse = false,
  repeat = 3,
  durationSec = 40,
  pauseOnHover = true,
  gap = 16,
  className = "",
}: VMarqueeProps) {
  return (
    <div
      className={`sa-vmarquee ${pauseOnHover ? "sa-vmarquee-wrap" : ""} ${className}`}
      style={{ ["--sa-vgap" as string]: `${gap}px`, ["--sa-vdur" as string]: `${durationSec}s` }}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div key={i} className={`sa-vmarquee-track ${reverse ? "reverse" : ""}`}>
          {children}
        </div>
      ))}
    </div>
  );
}
