"use client";

interface MarqueeProps {
  items: { label: string; color?: string }[];
  reverse?: boolean;
}

/** Infinite horizontal scroll strip. Duplicates content for a seamless loop. */
export default function Marquee({ items, reverse = false }: MarqueeProps) {
  const sequence = (
    <>
      {items.map((it, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 4vw, 42px)",
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: it.color ?? "var(--text-secondary)",
              padding: "0 28px",
              whiteSpace: "nowrap",
            }}
          >
            {it.label}
          </span>
          <span style={{ color: "var(--accent-gold)", fontSize: "clamp(14px, 2vw, 22px)", opacity: 0.7 }}>
            ·
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div
      className="sa-marquee-wrap"
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--bg-border)",
        borderBottom: "1px solid var(--bg-border)",
        padding: "26px 0",
        background: "var(--bg-base)",
      }}
    >
      <div className={`sa-marquee-track ${reverse ? "reverse" : ""}`}>
        {sequence}
        {sequence}
      </div>
    </div>
  );
}
