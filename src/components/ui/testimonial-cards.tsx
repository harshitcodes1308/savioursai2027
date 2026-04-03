'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

interface Testimonial {
  id: number;
  testimonial: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    testimonial:
      "Boards were coming near and I was not well prepared. But due to this AI I became very productive, didn't waste any time, got my tasks and focused to complete them. It really helped me.",
    author: 'Sparsh — ICSE Class 10',
  },
  {
    id: 2,
    testimonial:
      "What they didn't help with? Ask that. They helped me in each and every way and also cleared all my doubts.",
    author: 'Abhyang Salve — ICSE Class 10',
  },
  {
    id: 3,
    testimonial:
      'It helped me specifically in History, Geography and Maths. The only teaching community who really thought about our needs. Great efforts by the team.',
    author: 'Sarthak Mehta — ICSE Class 10',
  },
  {
    id: 4,
    testimonial:
      'It helped me really well with my boards — and my boards went really well.',
    author: 'Ishika Sagar — ICSE Class 10',
  },
  {
    id: 5,
    testimonial:
      'It gave me twisted questions which helped me do the same topics in a more difficult manner. That made all the difference.',
    author: 'Manntrra Pawar — ICSE Class 10',
  },
];

// Instagram-style default avatar — white silhouette on light grey
function DefaultAvatar({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      style={{ borderRadius: '50%', display: 'block', margin: '0 auto' }}
    >
      <rect width="96" height="96" rx="48" fill="#DBDBDB" />
      <circle cx="48" cy="36" r="14" fill="#FFFFFF" />
      <ellipse cx="48" cy="72" rx="24" ry="18" fill="#FFFFFF" />
    </svg>
  );
}

// Semi-circle arc positions for 5 cards
// Each card gets an angle along a downward arc, with overlap via tight spacing
function getArcPosition(index: number, total: number, isMobile: boolean) {
  // Arc spans from -70° to 70° (bottom semi-circle)
  const startAngle = -70;
  const endAngle = 70;
  const angle = startAngle + (endAngle - startAngle) * (index / (total - 1));
  const rad = (angle * Math.PI) / 180;

  // Radius of the arc — cards fan out from a center point
  const radius = isMobile ? 160 : 280;

  // Center of arc is above the card cluster
  const x = Math.sin(rad) * radius;
  const y = Math.cos(rad) * radius * 0.35; // flatten the arc vertically

  // Rotation: cards tilt to follow the arc
  const rotate = angle * 0.3;

  return { x, y, rotate };
}

export default function ShuffleCards({
  onContinue,
  isMobile = false,
}: {
  onContinue: () => void;
  isMobile?: boolean;
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const cardW = isMobile ? 240 : 300;
  const cardH = isMobile ? 340 : 400;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Title */}
      <p
        style={{
          fontFamily: 'Coolvetica, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: isMobile ? 12 : 20,
          position: 'relative',
          zIndex: 20,
        }}
      >
        What students are saying
      </p>

      {/* Semi-circle card fan */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isMobile ? '400px' : '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {testimonials.map((card, i) => {
          const pos = getArcPosition(i, testimonials.length, isMobile);
          const isHovered = hoveredId === card.id;
          const someoneHovered = hoveredId !== null;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 60, scale: 0.85 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: cardW,
                height: cardH,
                marginLeft: -cardW / 2 + pos.x,
                marginTop: -cardH / 2 + pos.y,
                zIndex: isHovered ? 50 : 10 - Math.abs(i - 2),
                transform: isHovered
                  ? `rotate(0deg) scale(1.1)`
                  : `rotate(${pos.rotate}deg) scale(${someoneHovered ? 0.92 : 1})`,
                filter: someoneHovered && !isHovered ? 'blur(3px) brightness(0.6)' : 'none',
                transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
              }}
            >
              {/* Card */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: isHovered
                    ? 'linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))'
                    : 'var(--bg-surface)',
                  border: isHovered
                    ? '1.5px solid var(--accent-gold-border)'
                    : '1.5px solid var(--bg-border)',
                  borderRadius: '20px',
                  padding: isMobile ? '24px 20px' : '32px 28px',
                  backdropFilter: 'blur(14px)',
                  boxShadow: isHovered
                    ? '0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,212,255,0.1)'
                    : '0 8px 32px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isMobile ? 14 : 18,
                  userSelect: 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                }}
              >
                <DefaultAvatar size={isMobile ? 56 : 72} />

                <p
                  style={{
                    fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
                    fontSize: isMobile ? '13px' : '15px',
                    lineHeight: '1.65',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    margin: 0,
                    opacity: isHovered ? 1 : 0.75,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  &ldquo;{card.testimonial}&rdquo;
                </p>

                <p
                  style={{
                    fontFamily: 'Coolvetica, sans-serif',
                    fontSize: isMobile ? '11px' : '13px',
                    letterSpacing: '0.04em',
                    color: 'var(--accent-gold)',
                    textAlign: 'center',
                    margin: 0,
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {card.author}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hover hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredId ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          fontFamily: 'var(--font-tagline)',
          fontSize: '13px',
          fontStyle: 'italic',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: isMobile ? 8 : 16,
          opacity: 0.5,
          position: 'relative',
          zIndex: 20,
        }}
      >
        Hover over the reviews to read them
      </motion.p>

      {/* Continue button */}
      <button
        onClick={onContinue}
        style={{
          marginTop: isMobile ? 16 : 24,
          background: 'var(--accent-gold)',
          color: '#0A0A0F',
          fontFamily: 'Coolvetica, sans-serif',
          fontSize: '16px',
          letterSpacing: '0.04em',
          padding: '13px 36px',
          borderRadius: '100px',
          border: 'none',
          cursor: 'pointer',
          display: 'block',
          position: 'relative',
          zIndex: 20,
        }}
      >
        Looks good, let&apos;s go &rarr;
      </button>
    </motion.div>
  );
}
