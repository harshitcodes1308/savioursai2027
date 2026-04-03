'use client';

import { useEffect, useRef, useCallback } from 'react';

interface VapourTextProps {
  text: string;
  font?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
  };
  color?: string;
  /** How long the text takes to fade in (seconds) */
  fadeInDuration?: number;
  /** How long to hold the solid text before disintegrating (seconds) */
  holdDuration?: number;
  /** How long the disintegration takes (seconds) */
  disintegrateDuration?: number;
  spread?: number;
  density?: number;
  width?: number;
  height?: number;
  /** Called when the full animation (fade-in + hold + disintegrate) finishes */
  onComplete?: () => void;
}

interface Particle {
  // Where the particle sits when forming the text
  homeX: number;
  homeY: number;
  // Current position
  x: number;
  y: number;
  // Disintegration drift velocity
  driftX: number;
  driftY: number;
  alpha: number;
  targetAlpha: number;
  size: number;
  // Staggered delay for fade-in (left-to-right)
  fadeInDelay: number;
  // Staggered delay for disintegration (random)
  disintegrateDelay: number;
}

export default function VapourText({
  text,
  font = { fontFamily: 'ScotchDisplay, serif', fontSize: '52px', fontWeight: 700 },
  color = 'rgb(245, 240, 232)',
  fadeInDuration = 1.0,
  holdDuration = 1.0,
  disintegrateDuration = 1.2,
  spread = 4,
  density = 6,
  width,
  height,
  onComplete,
}: VapourTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const completedRef = useRef(false);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Draw text to sample pixels
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.font = `${font.fontWeight || 700} ${font.fontSize || '52px'} ${font.fontFamily || 'serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);

    const imageData = ctx.getImageData(0, 0, w * dpr, h * dpr);
    const pixels = imageData.data;
    ctx.clearRect(0, 0, w, h);

    const particles: Particle[] = [];
    const step = Math.max(1, Math.round(8 - density));

    for (let y = 0; y < h * dpr; y += step) {
      for (let x = 0; x < w * dpr; x += step) {
        const i = (y * w * dpr + x) * 4;
        if (pixels[i + 3] > 128) {
          const hx = x / dpr;
          const hy = y / dpr;

          // Fade-in: left-to-right stagger
          const fadeInDelay = (hx / w) * fadeInDuration * 0.6 + Math.random() * 0.1;

          // Disintegration: random stagger so it crumbles organically
          const disintegrateDelay = Math.random() * disintegrateDuration * 0.4;

          // Random drift direction for disintegration (upward bias like ash)
          const angle = Math.random() * Math.PI * 2;
          const speed = (0.5 + Math.random() * 1.5) * spread * 15;
          const driftX = Math.cos(angle) * speed;
          const driftY = Math.sin(angle) * speed - speed * 0.6; // upward bias

          particles.push({
            homeX: hx,
            homeY: hy,
            x: hx,
            y: hy,
            driftX,
            driftY,
            alpha: 0,
            targetAlpha: 0.7 + Math.random() * 0.3,
            size: (0.8 + Math.random() * 0.8) / dpr * 1.2,
            fadeInDelay,
            disintegrateDelay,
          });
        }
      }
    }

    particlesRef.current = particles;
    startTimeRef.current = performance.now();
    completedRef.current = false;
  }, [text, font, color, spread, density, fadeInDuration, disintegrateDuration]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);

    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const particles = particlesRef.current;

    const [r, g, b] = color.match(/\d+/g)?.map(Number) || [245, 240, 232];

    // Phase boundaries
    const phaseHoldStart = fadeInDuration;
    const phaseDisintegrateStart = phaseHoldStart + holdDuration;
    const phaseEnd = phaseDisintegrateStart + disintegrateDuration;

    let allGone = true;

    for (const p of particles) {
      // ── Phase 1: Fade in (particles appear at home, alpha ramps up)
      if (elapsed < phaseHoldStart) {
        const t = elapsed - p.fadeInDelay;
        if (t < 0) { allGone = false; continue; }
        const progress = Math.min(1, t / (fadeInDuration * 0.35));
        const ease = 1 - Math.pow(1 - progress, 3);
        p.alpha = p.targetAlpha * ease;
        p.x = p.homeX;
        p.y = p.homeY;
      }
      // ── Phase 2: Hold (solid text, full alpha)
      else if (elapsed < phaseDisintegrateStart) {
        p.alpha = p.targetAlpha;
        p.x = p.homeX;
        p.y = p.homeY;
      }
      // ── Phase 3: Disintegrate (particles drift away and fade out)
      else {
        const t = elapsed - phaseDisintegrateStart - p.disintegrateDelay;
        if (t < 0) {
          // Still waiting to break off — stay solid
          p.alpha = p.targetAlpha;
          p.x = p.homeX;
          p.y = p.homeY;
          allGone = false;
        } else {
          const dur = disintegrateDuration * 0.6;
          const progress = Math.min(1, t / dur);
          const ease = progress * progress; // easeInQuad — accelerate away

          p.x = p.homeX + p.driftX * ease;
          p.y = p.homeY + p.driftY * ease;
          p.alpha = p.targetAlpha * (1 - progress);

          if (progress < 1) allGone = false;
        }
      }

      if (p.alpha < 0.005) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
      ctx.fill();
    }

    // Fire completion callback once
    if (elapsed >= phaseEnd && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [color, fadeInDuration, holdDuration, disintegrateDuration, onComplete]);

  useEffect(() => {
    initParticles();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles, animate]);

  useEffect(() => {
    const handleResize = () => initParticles();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: width || '100%',
        height: height || '100px',
        display: 'block',
      }}
    />
  );
}
