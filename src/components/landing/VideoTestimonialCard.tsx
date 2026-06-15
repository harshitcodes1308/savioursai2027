"use client";

import { useRef, useState, useEffect } from "react";
import type { VideoTestimonial } from "@/data/video-testimonials";

/** A 9:16 vertical video card. Autoplays muted on hover (desktop), tap-to-play
 *  on mobile. Lazy: video source is only attached once the card nears the viewport. */
export default function VideoTestimonialCard({ data }: { data: VideoTestimonial }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hasVideo = Boolean(data.videoSrc);

  const onEnter = () => {
    if (!hasVideo || !videoRef.current) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
  };
  const onLeave = () => {
    if (!hasVideo || !videoRef.current) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setPlaying(false);
  };
  const onTap = () => {
    if (!hasVideo || !videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return (
    <div
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onTap}
      data-cursor="hover"
      style={{
        width: "clamp(200px, 60vw, 260px)",
        aspectRatio: "9 / 16",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        background: "var(--bg-elevated)",
        border: "1px solid var(--bg-border)",
        cursor: "pointer",
      }}
    >
      {hasVideo && inView ? (
        <video
          ref={videoRef}
          src={data.videoSrc!}
          poster={data.posterSrc ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        // Placeholder state (no video uploaded yet)
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            background: "linear-gradient(160deg, var(--bg-elevated), var(--bg-surface))",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              border: "1.5px solid var(--accent-gold-border)",
              background: "var(--accent-gold-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)",
              fontSize: 18,
              paddingLeft: 3,
            }}
          >
            ▶
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
            Video coming soon
          </span>
        </div>
      )}

      {/* gradient + caption */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(13,13,26,0.85) 0%, transparent 45%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", left: 16, bottom: 16, right: 16, pointerEvents: "none" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text-primary)", fontWeight: 600 }}>
          {data.name}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--accent-gold)", marginTop: 2 }}>
          {data.subject}
        </div>
      </div>
    </div>
  );
}
