"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./useScrollReveal";
import MagneticButton from "./MagneticButton";

const VIDEO_URL = "https://res.cloudinary.com/dv0w2nfnw/video/upload/v1774898701/videoplayback_tgdakw.mp4";

const HEADLINE_WORDS = ["Your", "AI-powered", "academic", "OS", "for", "ICSE", "success."];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const diamondRef = useRef<SVGSVGElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) { v.playbackRate = 1.4; v.play().catch(() => {}); }

    const reduced = prefersReducedMotion();
    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];

    if (reduced) {
      // Show everything immediately
      words.forEach((w) => { w.style.opacity = "1"; w.style.transform = "none"; });
      [chipRef, taglineRef, ctaRef].forEach((r) => {
        if (r.current) { r.current.style.opacity = "1"; r.current.style.transform = "none"; }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Diamond stroke trace
      const paths = diamondRef.current?.querySelectorAll("path");
      if (paths) {
        paths.forEach((p) => {
          const len = (p as SVGPathElement).getTotalLength?.() ?? 200;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        });
        gsap.to(paths, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.15 });
      }

      const tl = gsap.timeline({ delay: 0.5 });
      tl.from(chipRef.current, { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" })
        .from(words, {
          opacity: 0,
          y: 48,
          rotateX: -40,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.07,
        }, "-=0.2")
        .from(taglineRef.current, { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "-=0.4");

      // Scroll parallax: video zooms + fades, content drifts up
      gsap.to(videoRef.current, {
        scale: 1.18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".sa-hero-content", {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -40 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "0 24px",
      }}
    >
      {/* Ambient video backdrop */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "grayscale(100%) brightness(0.32)",
          opacity: 0.4,
          zIndex: 0,
        }}
      />
      {/* Darkening + vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(13,13,26,0.55) 0%, rgba(13,13,26,0.9) 100%)",
          zIndex: 1,
        }}
      />
      {/* Glow orb */}
      <div
        className="sa-orb"
        style={{
          width: 620,
          height: 620,
          background: "var(--accent-gold-glow)",
          top: "12%",
          left: "50%",
          marginLeft: -310,
          animation: "saOrbDrift 16s ease-in-out infinite",
        }}
      />

      <div
        className="sa-hero-content"
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: 980,
          width: "100%",
        }}
      >
        {/* Diamond */}
        <svg
          ref={diamondRef}
          width="56"
          height="56"
          viewBox="0 0 48 48"
          fill="none"
          style={{ margin: "0 auto 28px", display: "block" }}
          aria-hidden="true"
        >
          <path d="M24 4L44 18L24 44L4 18L24 4Z" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />
          <path d="M4 18L24 32L44 18" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.6" />
        </svg>

        {/* Chip */}
        <div ref={chipRef} style={{ marginBottom: 26 }}>
          <span
            className="chip-gold"
            style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}
          >
            Class X · ICSE · 2027 Boards
          </span>
        </div>

        {/* Headline with per-word reveal */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(38px, 8vw, 80px)",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            margin: "0 0 22px",
            fontWeight: 700,
            perspective: 800,
          }}
        >
          {HEADLINE_WORDS.map((word, i) => {
            const accent = word === "ICSE" || word === "success.";
            return (
              <span
                key={i}
                ref={(el) => { wordsRef.current[i] = el; }}
                style={{
                  display: "inline-block",
                  marginRight: "0.28em",
                  color: accent ? "var(--accent-gold)" : "var(--text-primary)",
                  transformStyle: "preserve-3d",
                }}
              >
                {word}
              </span>
            );
          })}
        </h1>

        {/* Tagline */}
        <div
          ref={taglineRef}
          style={{
            fontFamily: "var(--font-tagline)",
            fontStyle: "italic",
            fontSize: "clamp(17px, 2.6vw, 26px)",
            color: "var(--text-secondary)",
            marginBottom: 40,
            letterSpacing: "0.01em",
          }}
        >
          Every great board result starts with one decision.
        </div>

        {/* CTAs */}
        <div
          ref={ctaRef}
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <MagneticButton
            href="/signup"
            className="btn-gold"
            style={{
              fontSize: 15,
              padding: "15px 32px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
            ariaLabel="Start free"
          >
            Start Free →
          </MagneticButton>
          <button
            onClick={scrollToFeatures}
            className="btn-ghost"
            style={{ fontSize: 15, padding: "15px 28px", cursor: "pointer" }}
            data-cursor="hover"
          >
            See what&apos;s inside ↓
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 1,
            height: 36,
            background: "linear-gradient(to bottom, transparent, var(--accent-gold))",
            animation: "float 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
