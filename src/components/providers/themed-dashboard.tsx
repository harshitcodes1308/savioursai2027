'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardSidebar from '@/components/layout/dashboard-sidebar';
import { ReactNode } from 'react';

const VIDEO_URL = "https://res.cloudinary.com/dv0w2nfnw/video/upload/v1774898701/videoplayback_tgdakw.mp4";

export function ThemedDashboardContent({
    children,
    userName,
    userEmail,
    isPaid,
    planType,
}: {
    children: ReactNode;
    userName?: string;
    userEmail?: string;
    isPaid?: boolean;
    planType?: string;
}) {
    const [isMobile, setIsMobile] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.75;
            videoRef.current.play().catch(() => {});
        }
    }, []);

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {/* ── FIXED SPACE WARP VIDEO BACKGROUND ── */}
            <video
                ref={videoRef}
                src={VIDEO_URL}
                autoPlay muted playsInline loop
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%) brightness(0.18)',
                    opacity: 0.6,
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />
            {/* Blue tint + darkening overlay */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,18,40,0.75) 0%, rgba(3,3,3,0.88) 40%, rgba(0,12,30,0.75) 100%)',
                zIndex: 0,
                pointerEvents: 'none',
            }} />
            {/* Subtle radial cyan glow */}
            <div style={{
                position: 'fixed',
                left: '60%',
                top: '30%',
                width: 800,
                height: 800,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
                pointerEvents: 'none',
            }} />

            {/* Sidebar — above video */}
            <DashboardSidebar
                userName={userName}
                userEmail={userEmail}
                isPaid={isPaid}
                planType={planType}
            />

            {/* Main content — above video, with transparent bg override */}
            <main
                className="dashboard-main"
                style={{
                    marginLeft: isMobile ? 0 : 240,
                    minHeight: '100vh',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
                    paddingTop: isMobile ? 64 : 0,
                    paddingBottom: isMobile ? 64 : 0,
                }}
            >
                {children}
            </main>
        </div>
    );
}
