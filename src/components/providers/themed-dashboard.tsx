'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/layout/dashboard-sidebar';
import { ReactNode } from 'react';

export function ThemedDashboardContent({
    children,
    userName,
    userEmail,
    isPaid,
}: {
    children: ReactNode;
    userName?: string;
    userEmail?: string;
    isPaid?: boolean;
}) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Sync with sidebar breakpoint
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#030303' }}>
            <DashboardSidebar userName={userName} userEmail={userEmail} isPaid={isPaid} />

            {/* Main Content */}
            <main
                style={{
                    marginLeft: isMobile ? 0 : 280, // Match sidebar width
                    minHeight: '100vh',
                    width: 'auto', // Fix: Use auto to respect margin-left on desktop
                    padding: isMobile ? '16px' : '32px',
                    paddingTop: isMobile ? '80px' : '32px', // More space for hamburger
                    backgroundColor: '#030303',
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {children}
            </main>
        </div>
    );
}
