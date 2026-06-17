"use client";

import { useScrollReveal } from "./useScrollReveal";
import VerticalMarquee from "./VerticalMarquee";

interface Review {
  name: string;
  handle: string;
  body: string;
  subject: string;
  color: string;
}

/* Real ICSE student quotes, attributed for the testimonial cards */
const REVIEWS: Review[] = [
  { name: "Aarav S.", handle: "Class X · 92%", body: "It helped me score 85 and above in every subject.", subject: "All subjects", color: "#00D4FF" },
  { name: "Diya M.", handle: "Class X · 88%", body: "I wasn't prepared and boards were coming. This AI made me productive and I didn't waste a single day.", subject: "Smart Planner", color: "#3B82F6" },
  { name: "Kabir R.", handle: "Class X · 90%", body: "It gave me twisted questions which helped me tackle the same topics in a much harder way. That's what prepared me.", subject: "Flip the Question", color: "#F97316" },
  { name: "Ananya P.", handle: "Class X · 95%", body: "Helped me ace all my competency-based questions and MCQs. That section used to scare me.", subject: "Competency Test", color: "#00D4FF" },
  { name: "Vivaan T.", handle: "Class X · 87%", body: "They cleared all my doubts. Ask what didn't they help with instead.", subject: "AI Doubt Solver", color: "#22c55e" },
  { name: "Sara K.", handle: "Class X · 91%", body: "The best part is the affordable price with so many features. The only platform that thought about what students actually need.", subject: "Whole platform", color: "#A78BFA" },
];

function ReviewCard({ r }: { r: Review }) {
  return (
    <div
      data-cursor="hover"
      style={{
        width: "100%",
        padding: "20px 20px",
        borderRadius: 16,
        background: "var(--bg-surface)",
        border: "1px solid var(--bg-border)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        {/* avatar — initial tile, no external image dependency */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${r.color}1c`,
            border: `1px solid ${r.color}45`,
            color: r.color,
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {r.name[0]}
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            {r.name}
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>
            {r.handle}
          </span>
        </div>
      </div>

      <p style={{ margin: "13px 0 13px", fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
        {r.body}
      </p>

      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: r.color,
          background: `${r.color}14`,
          border: `1px solid ${r.color}33`,
          padding: "3px 8px",
          borderRadius: 6,
        }}
      >
        #{r.subject.replace(/\s+/g, "")}
      </span>
    </div>
  );
}

export default function Testimonials() {
  const ref = useScrollReveal<HTMLElement>(".sa-reveal", { y: 30, stagger: 0.07 });

  const cards = REVIEWS.map((r) => <ReviewCard key={r.handle} r={r} />);

  return (
    <section ref={ref} style={{ padding: "clamp(80px, 12vw, 130px) 0 clamp(32px, 5vw, 56px)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header — gradient glass text matching the toolkit section */}
        <div style={{ marginBottom: 48, maxWidth: 720 }}>
          <div className="sa-eyebrow sa-reveal" style={{ marginBottom: 20 }}>The receipts</div>
          <h2
            className="sa-grad-text sa-reveal"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 6vw, 64px)",
              letterSpacing: "-0.035em",
              margin: 0,
              lineHeight: 1.02,
              fontWeight: 800,
            }}
          >
            What students actually said.
          </h2>
        </div>
      </div>

      {/* Full-bleed marquee wall — spreads edge to edge, gentle tilt, big readable cards */}
      <div
        className="sa-reveal"
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(440px, 60vh, 600px)",
          marginBottom: 0,
          overflow: "hidden",
          perspective: "1400px",
        }}
      >
        <div
          className="sa-tmwall"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 20,
            width: "100%",
            height: "100%",
            padding: "0 clamp(16px, 4vw, 56px)",
            boxSizing: "border-box",
            transform: "rotateX(8deg) rotateZ(-2deg) scale(1.02)",
            transformOrigin: "center 40%",
          }}
        >
          <VerticalMarquee repeat={4} durationSec={46}>{cards}</VerticalMarquee>
          <VerticalMarquee reverse repeat={4} durationSec={52}>{cards}</VerticalMarquee>
          <VerticalMarquee repeat={4} durationSec={44}>{cards}</VerticalMarquee>
          <VerticalMarquee reverse repeat={4} durationSec={50} className="sa-hide-md">{cards}</VerticalMarquee>
          <VerticalMarquee repeat={4} durationSec={48} className="sa-hide-sm">{cards}</VerticalMarquee>
        </div>

        {/* edge fades into the page background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom, var(--bg-base), transparent 16%, transparent 84%, var(--bg-base))" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to right, var(--bg-base), transparent 10%, transparent 90%, var(--bg-base))" }} />
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .sa-tmwall { grid-template-columns: repeat(4, 1fr) !important; }
          .sa-tmwall .sa-hide-sm { display: none !important; }
        }
        @media (max-width: 820px) {
          .sa-tmwall { grid-template-columns: repeat(3, 1fr) !important; }
          .sa-tmwall .sa-hide-md { display: none !important; }
        }
        @media (max-width: 560px) {
          .sa-tmwall { grid-template-columns: repeat(2, 1fr) !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}
