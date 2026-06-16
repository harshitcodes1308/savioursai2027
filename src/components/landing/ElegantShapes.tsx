"use client";

import { motion } from "motion/react";

/* -----------------------------------------------------------------------------
 * Elegant floating shapes — adapted from the 21st.dev shape-landing-hero.
 * Re-themed to the Saviours palette (cyan / blue / violet gradients on the dark
 * base) and used as an ambient backdrop for the proof section. Pointer-events
 * none. framer-motion is available as `motion/react` (project convention).
 * -------------------------------------------------------------------------- */

function ElegantShape({
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "rgba(0,212,255,0.14)",
  style,
}: {
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      style={{ position: "absolute", ...style }}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height, position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9999,
            background: `linear-gradient(to right, ${gradient}, transparent)`,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            border: "2px solid rgba(255,255,255,0.10)",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ElegantShapes() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }} aria-hidden="true">
      <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="rgba(0,212,255,0.15)" style={{ left: "-6%", top: "14%" }} />
      <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="rgba(96,165,250,0.14)" style={{ right: "-3%", top: "68%" }} />
      <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="rgba(139,92,246,0.14)" style={{ left: "8%", bottom: "6%" }} />
      <ElegantShape delay={0.6} width={200} height={60} rotate={20} gradient="rgba(0,212,255,0.12)" style={{ right: "16%", top: "10%" }} />
      <ElegantShape delay={0.7} width={150} height={40} rotate={-25} gradient="rgba(20,184,166,0.13)" style={{ left: "22%", top: "6%" }} />
    </div>
  );
}
