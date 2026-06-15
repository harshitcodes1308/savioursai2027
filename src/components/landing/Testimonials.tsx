"use client";

import { useScrollReveal } from "./useScrollReveal";
import { VIDEO_TESTIMONIALS } from "@/data/video-testimonials";
import VideoTestimonialCard from "./VideoTestimonialCard";

const QUOTES = [
  "It helped me score 85 and above in every subject.",
  "I was unable to plan my days. Boards were coming and I wasn't prepared. This AI made me productive and I didn't waste a single day.",
  "It gave me twisted questions which helped me tackle the same topics in a much harder way. That's what prepared me.",
  "Helped me ace all my competency-based questions and MCQs. That section used to scare me.",
  "They helped me in each and every way and cleared all my doubts. Ask what didn't they help instead.",
  "The best part is the affordable price with so many features. Genuinely the only platform that thought about what students actually need.",
];

export default function Testimonials() {
  const ref = useScrollReveal<HTMLElement>(".sa-reveal", { y: 30, stagger: 0.07 });

  return (
    <section ref={ref} style={{ padding: "clamp(80px, 12vw, 130px) 24px", position: "relative" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* Part A — text */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h2
            className="sa-reveal"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 5.5vw, 56px)",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: "0 0 12px",
              fontWeight: 700,
            }}
          >
            What students <span style={{ color: "var(--accent-gold)" }}>actually said.</span>
          </h2>
        </div>

        {/* Masonry-ish columns */}
        <div
          style={{
            columnGap: 18,
            columnCount: 1,
            marginBottom: 90,
          }}
          className="sa-quote-cols"
        >
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="sa-card sa-reveal"
              style={{
                breakInside: "avoid",
                marginBottom: 18,
                padding: "26px 26px",
                display: "inline-block",
                width: "100%",
              }}
            >
              <div style={{ color: "var(--accent-gold)", fontSize: 30, lineHeight: 1, fontFamily: "var(--font-tagline)", marginBottom: 10 }}>
                &ldquo;
              </div>
              <p
                style={{
                  fontFamily: "var(--font-tagline)",
                  fontStyle: "italic",
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "var(--text-primary)",
                  margin: "0 0 16px",
                }}
              >
                {q}
              </p>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                ICSE Class X Student
              </div>
            </div>
          ))}
        </div>

        {/* Part B — video */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p
            className="sa-reveal"
            style={{
              fontFamily: "var(--font-tagline)",
              fontStyle: "italic",
              fontSize: "clamp(18px, 3vw, 28px)",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            Hear it from them.
          </p>
        </div>

        <div className="sa-vrail sa-reveal" style={{ paddingLeft: 4, paddingRight: 4 }}>
          {VIDEO_TESTIMONIALS.map((vt) => (
            <VideoTestimonialCard key={vt.id} data={vt} />
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 700px) { .sa-quote-cols { column-count: 2; } }
        @media (min-width: 1040px) { .sa-quote-cols { column-count: 3; } }
      `}</style>
    </section>
  );
}
