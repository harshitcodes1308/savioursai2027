"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  strength?: number;
  ariaLabel?: string;
}

/**
 * Wraps a link/button and gives it a magnetic pull toward the cursor on desktop.
 * Snaps back on mouse leave. Disabled on touch devices and reduced-motion.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  style,
  strength = 0.35,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.4s cubic-bezier(0.16,1,0.3,1)";
  };

  const handleEnter = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.15s ease-out";
  };

  const common = {
    className: `sa-magnetic ${className ?? ""}`,
    style,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onMouseEnter: handleEnter,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...common}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} onClick={onClick} {...common}>
      {children}
    </button>
  );
}
