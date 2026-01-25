"use client";

import { useEffect, useState } from "react";
import { typography } from "@/lib/typography";

interface GenerationLoaderProps {
    isVisible: boolean;
    label?: string;
    subLabel?: string;
}

const FILL_DURATION = 4000; // 4 seconds to reach near 100%

export function GenerationLoader({ isVisible, label = "Generating...", subLabel = "AI is crafting your content" }: GenerationLoaderProps) {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState(label);

    useEffect(() => {
        if (!isVisible) {
            setProgress(0);
            return;
        }

        const statuses = [
            "Analyzing request...",
            "Consulting the knowledge base...",
            "Structuring content...",
            "Finalizing details...",
            label
        ];

        let start = Date.now();
        let animationFrame: number;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - start;
            
            // Logarithmic-like progress that slows down as it approaches 95%
            const rawProgress = Math.min((elapsed / FILL_DURATION) * 100, 95);
            
            // Update status text based on progress chunks
            const statusIndex = Math.min(
                Math.floor((rawProgress / 100) * statuses.length),
                statuses.length - 1
            );
            setStatusText(statuses[statusIndex]);

            setProgress(rawProgress);

            if (elapsed < FILL_DURATION) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, label]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(3, 3, 3, 0.9)",
            backdropFilter: "blur(10px)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease-in-out"
        }}>
            <div style={{ width: "100%", maxWidth: "400px", padding: "20px", textAlign: "center" }}>
                {/* Percentage */}
                <h2 style={{
                    ...typography.display,
                    fontSize: "64px",
                    fontWeight: 700,
                    color: "transparent",
                    WebkitBackgroundClip: "text",
                    backgroundImage: "linear-gradient(135deg, #FFFFFF 0%, #8B5CF6 100%)",
                    marginBottom: "16px",
                    fontVariantNumeric: "tabular-nums"
                }}>
                    {Math.round(progress)}%
                </h2>

                {/* Status Text */}
                <div style={{
                    ...typography.text,
                    fontSize: "18px",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "8px",
                    minHeight: "28px"
                }}>
                    {statusText}
                </div>
                <div style={{
                    ...typography.text,
                    fontSize: "14px",
                    color: "#9CA3AF",
                    marginBottom: "32px"
                }}>
                    {subLabel}
                </div>

                {/* Hollow Bar Container */}
                <div style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "999px",
                    overflow: "hidden",
                    position: "relative"
                }}>
                    {/* Fill Bar */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${progress}%`,
                        backgroundColor: "#8B5CF6",
                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
                        transition: "width 0.1s linear",
                        borderRadius: "999px"
                    }} />
                    
                    {/* Shine Effect */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                        transform: "skewX(-20deg) translateX(-150%)",
                        animation: "shimmer 2s infinite"
                    }} />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: skewX(-20deg) translateX(-150%); }
                    100% { transform: skewX(-20deg) translateX(150%); }
                }
            `}</style>
        </div>
    );
}
