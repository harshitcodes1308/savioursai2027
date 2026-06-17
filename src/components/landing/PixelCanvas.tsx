"use client";

import { useCallback, useEffect, useRef } from "react";

/* -----------------------------------------------------------------------------
 * Pixel ripple canvas — adapted from a 21st.dev hero effect, re-themed to the
 * Saviours design system. Pixels expand outward from centre in a staggered
 * ripple, then shimmer. Most pixels are muted; a fraction sparkle in accent cyan.
 * Respects prefers-reduced-motion (renders a static field, no animation loop).
 * -------------------------------------------------------------------------- */

type Pixel = {
  x: number;
  y: number;
  color: string;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInt: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  speed: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;
  canShimmer: boolean;
  draw: () => void;
  appear: () => void;
  shimmer: () => void;
};

function createPixel(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  color: string,
  baseSpeed: number,
  delay: number,
  canShimmer: boolean
): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const p: Pixel = {
    x, y, color,
    size: 0,
    sizeStep: rand(0.12, 0.28),
    minSize: 0.5,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: rand(1.8, 3.2) + (canvas.width + canvas.height) * 0.008,
    speed: rand(0.08, 0.4) * baseSpeed,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    canShimmer,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) {
        p.counter += p.counterStep;
        return;
      }
      // Base pixels grow then hold static; only accent pixels shimmer
      if (p.size >= p.maxSize) {
        if (p.canShimmer) p.isShimmer = true;
        else { p.size = p.maxSize; p.draw(); return; }
      }
      if (p.isShimmer) p.shimmer();
      else p.size += p.sizeStep;
      p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed;
      else p.size += p.speed;
    },
  };

  return p;
}

interface PixelCanvasProps {
  /** muted base colour for most pixels */
  baseColor?: string;
  /** accent colour for the sparkle minority */
  accentColor?: string;
  /** 0..1 fraction of pixels that sparkle accent */
  accentRatio?: number;
  gap?: number;
  speed?: number;
}

export default function PixelCanvas({
  baseColor = "rgba(120, 120, 145, 0.5)",
  accentColor = "#00D4FF",
  accentRatio = 0.12,
  gap = 6,
  speed = 30,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef(0);
  const reducedRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    if (w === 0 || h === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const effectiveSpeed = reducedRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels: Pixel[] = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const isAccent = Math.random() < accentRatio;
        const color = isAccent ? accentColor : baseColor;
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = reducedRef.current ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.55;
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay, isAccent));
      }
    }
    pixelsRef.current = pixels;
  }, [baseColor, accentColor, accentRatio, gap, speed]);

  const animate = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;

    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel.appear();

      // Under reduced motion, draw a single static frame then stop
      if (reducedRef.current) {
        for (const pixel of pixels) { pixel.size = pixel.maxSize; pixel.draw(); }
        cancelAnimationFrame(animationRef.current);
      }
    };
    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();
    const ro = new ResizeObserver(() => { init(); });
    if (wrapRef.current) ro.observe(wrapRef.current);

    // Pause the per-pixel loop when the hero scrolls out of view — keeps the
    // rest of the page smooth instead of redrawing thousands of pixels off-screen.
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && !visible) { visible = true; animate(); }
        else if (!e.isIntersecting && visible) { visible = false; cancelAnimationFrame(animationRef.current); }
      }),
      { rootMargin: "100px" }
    );
    if (wrapRef.current) io.observe(wrapRef.current);

    animate();
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="sa-pixel-wrap" aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
