'use client';

import { useTheme } from './theme-provider';
import DashboardSidebar from '@/components/layout/dashboard-sidebar';
import { ReactNode } from 'react';

export function ThemedDashboardContent({
    children,
    userName,
    userEmail
}: {
    children: ReactNode;
    userName?: string;
    userEmail?: string;
}) {
    const { theme } = useTheme();

    // Theme colors
    const colors = {
        bg: theme === 'dark' ? '#030303' : '#F9FAFB',
        cardBg: theme === 'dark' ? '#0E0E10' : '#FFFFFF',
        border: theme === 'dark' ? '#1F1F22' : '#E5E7EB',
        inputBg: theme === 'dark' ? '#1A1A1D' : '#F3F4F6',
        inputBorder: theme === 'dark' ? '#333' : '#D1D5DB',
        text: theme === 'dark' ? '#FFFFFF' : '#111827',
        textMuted: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.bg }}>
            <DashboardSidebar userName={userName} userEmail={userEmail} />

            {/* Header - Fixed, positioned after sidebar on desktop, full width on mobile */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '64px',
                    backgroundColor: colors.cardBg,
                    borderBottom: `1px solid ${colors.border}`,
                    zIndex: 40,
                    paddingLeft: '60px', // Space for hamburger on mobile
                }}
                className="dashboard-header"
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        padding: '0 16px',
                    }}
                >
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text }}>
                        Statistics
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Search - Hidden on mobile */}
                        <div style={{ position: 'relative' }} className="mobile-hidden">
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{
                                    width: '180px',
                                    padding: '8px 16px 8px 36px',
                                    borderRadius: '8px',
                                    backgroundColor: colors.inputBg,
                                    border: `1px solid ${colors.inputBorder}`,
                                    color: colors.text,
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: colors.textMuted,
                                    fontSize: '14px',
                                }}
                            >
                                🔍
                            </span>
                        </div>

                        {/* Upgrade Button - Hidden on small mobile */}
                        <button
                            className="mobile-hidden"
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                backgroundColor: '#8B5CF6',
                                color: '#FFFFFF',
                                fontSize: '13px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
                            }}
                        >
                            Upgrade
                        </button>

                        {/* Notifications */}
                        <button
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                color: colors.textMuted,
                                fontSize: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            🔔
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Responsive padding */}
            <main
                style={{
                    marginLeft: 0,
                    paddingTop: '80px',
                    padding: '80px 16px 16px 16px',
                    minHeight: '100vh',
                    backgroundColor: colors.bg,
                }}
                className="dashboard-main"
            >
                {children}
            </main>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (min-width: 768px) {
                    .dashboard-header {
                        left: 240px !important;
                        padding-left: 0 !important;
                    }

                    .dashboard-header > div {
                        padding: 0 32px !important;
                    }

                    .dashboard-main {
                        margin-left: 240px !important;
                        padding: 96px 32px 32px 32px !important;
                    }
                }
            `}</style>
        </div>
    );
}
