"use client";

import { useState, useEffect } from "react";

/**
 * Unified responsive hook for all components.
 * Returns { isMobile, isTablet, isDesktop } with SSR-safe defaults.
 *
 * Breakpoints:
 *   Mobile:  ≤ 768px
 *   Tablet:  769px – 1024px
 *   Desktop: ≥ 1025px
 */
export function useResponsive() {
    const [state, setState] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true, // SSR default = desktop (avoids layout flash)
    });

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            setState({
                isMobile: w <= 768,
                isTablet: w > 768 && w <= 1024,
                isDesktop: w > 1024,
            });
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return state;
}
