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

            {/* Header - Fixed, positioned after sidebar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: '240px',
                    right: 0,
                    height: '64px',
                    backgroundColor: colors.cardBg,
                    borderBottom: `1px solid ${colors.border}`,
                    zIndex: 40,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        padding: '0 32px',
                    }}
                >
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text }}>
                        Statistics
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search something..."
                                style={{
                                    width: '256px',
                                    padding: '8px 16px 8px 40px',
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
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: colors.textMuted,
                                    fontSize: '14px',
                                }}
                            >
                                🔍
                            </span>
                        </div>

                        {/* Upgrade Button */}
                        <button
                            style={{
                                padding: '8px 20px',
                                borderRadius: '8px',
                                backgroundColor: '#8B5CF6',
                                color: '#FFFFFF',
                                fontSize: '14px',
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
                                width: '36px',
                                height: '36px',
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

            {/* Main Content - Offset from sidebar and header */}
            <main
                style={{
                    marginLeft: '240px',
                    paddingTop: '64px',
                    padding: '32px',
                    minHeight: '100vh',
                    backgroundColor: colors.bg,
                }}
            >
                {children}
            </main>
        </div>
    );
}
