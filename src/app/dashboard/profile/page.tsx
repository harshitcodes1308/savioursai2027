'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { typography } from '@/lib/typography';
import { useResponsive } from '@/hooks/useResponsive';

export default function ProfilePage() {
    const { isMobile } = useResponsive();
    const { data: stats, isLoading } = trpc.profile.getStats.useQuery();
    const { data: user } = trpc.auth.getProfile.useQuery();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const updateMutation = trpc.profile.updateProfile.useMutation({
        onSuccess: () => {
            setIsEditing(false);
        },
    });

    const handleSave = () => {
        updateMutation.mutate({ name, email });
    };

    // Get user initials
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    if (isLoading) {
        return (
            <div style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{ ...typography.text, fontSize: '16px', color: '#9CA3AF' }}>
                    Loading profile...
                </div>
            </div>
        );
    }

    const hasActivity = stats && stats.totalTests > 0;

    return (
        <div style={{ padding: isMobile ? '16px' : '32px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' as const, overflowX: 'hidden' as const }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '8px' }}>
                    My Profile
                </h1>
                <p style={{ ...typography.text, fontSize: '16px', color: '#9CA3AF' }}>
                    Manage your account and track your progress
                </p>
            </div>

            {/* Profile Card */}
            <div className="dashboard-card" style={{ padding: isMobile ? '20px' : '32px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: isMobile ? 'center' : 'center', gap: isMobile ? '16px' : '24px', flexDirection: isMobile ? 'column' : 'row' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '50%',
                        backgroundColor: '#8B5CF6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <span style={{ ...typography.display, fontSize: '36px', fontWeight: 700, color: '#FFF' }}>
                            {initials}
                        </span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder={user?.name || 'Your Name'}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        ...typography.text,
                                        width: '100%',
                                        padding: '12px',
                                        marginBottom: '12px',
                                        backgroundColor: '#1A1A1D',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#FFF',
                                        fontSize: '16px',
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder={user?.email || 'your@email.com'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        ...typography.text,
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: '#1A1A1D',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#FFF',
                                        fontSize: '16px',
                                    }}
                                />
                                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={handleSave}
                                        disabled={updateMutation.isPending}
                                        style={{
                                            ...typography.text,
                                            padding: '8px 16px',
                                            backgroundColor: '#10B981',
                                            color: '#FFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        style={{
                                            ...typography.text,
                                            padding: '8px 16px',
                                            backgroundColor: '#374151',
                                            color: '#FFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '4px' }}>
                                    {user?.name || 'Student'}
                                </h2>
                                <p style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF', marginBottom: '16px' }}>
                                    {user?.email || 'No email'}
                                </p>
                                <button
                                    onClick={() => {
                                        setName(user?.name || '');
                                        setEmail(user?.email || '');
                                        setIsEditing(true);
                                    }}
                                    style={{
                                        ...typography.text,
                                        padding: '8px 16px',
                                        backgroundColor: '#8B5CF6',
                                        color: '#FFF',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            {hasActivity ? (
                <>
                    <h3 style={{ ...typography.display, fontSize: '20px', marginBottom: '16px' }}>
                        Your Progress
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
                            <div style={{ ...typography.display, fontSize: '32px', marginBottom: '4px' }}>
                                {stats.totalTests}
                            </div>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                Tests Completed
                            </div>
                        </div>

                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                            <div style={{ ...typography.display, fontSize: '32px', marginBottom: '4px', color: '#10B981' }}>
                                {stats.avgAccuracy}%
                            </div>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                Average Accuracy
                            </div>
                        </div>

                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
                            <div style={{ ...typography.display, fontSize: '32px', marginBottom: '4px', color: '#8B5CF6' }}>
                                {stats.subjectsStudied.length}
                            </div>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                Subjects Studied
                            </div>
                        </div>

                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏱</div>
                            <div style={{ ...typography.display, fontSize: '32px', marginBottom: '4px', color: '#F59E0B' }}>
                                {stats.totalStudyTime}
                            </div>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                Minutes Studied
                            </div>
                        </div>

                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📖</div>
                            <div style={{ ...typography.display, fontSize: '32px', marginBottom: '4px' }}>
                                {stats.notesCount}
                            </div>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                Notes Created
                            </div>
                        </div>

                        <div className="dashboard-card" style={{ padding: '24px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
                            <div style={{ ...typography.display, fontSize: '32px', marginBottom: '4px' }}>
                                {stats.aiUsage}
                            </div>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                AI Interactions
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    {stats.recentTests.length > 0 && (
                        <>
                            <h3 style={{ ...typography.display, fontSize: '20px', marginBottom: '16px' }}>
                                Recent Tests
                            </h3>
                            <div className="dashboard-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {stats.recentTests.map((test) => (
                                        <div
                                            key={test.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '16px',
                                                backgroundColor: '#1A1A1D',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <div>
                                                <div style={{ ...typography.text, fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                                                    {test.subject}
                                                </div>
                                                <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                                    {new Date(test.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ ...typography.text, fontSize: '18px', fontWeight: 600, color: '#10B981' }}>
                                                    {test.score}/{test.total}
                                                </div>
                                                <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                                    {test.accuracy.toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                /* Empty State */
                <div className="dashboard-card" style={{ padding: '64px', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎓</div>
                    <h3 style={{ ...typography.display, fontSize: '24px', marginBottom: '12px' }}>
                        Start Your Learning Journey
                    </h3>
                    <p style={{ ...typography.text, fontSize: '16px', color: '#9CA3AF', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
                        You haven't taken any tests yet. Your progress stats will appear here as you study and take tests.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <a
                            href="/dashboard/tests"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                                backgroundColor: '#8B5CF6',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                display: 'inline-block',
                                fontWeight: 600,
                            }}
                        >
                            Take Your First Test
                        </a>
                        <a
                            href="/dashboard/ai-assistant"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                                backgroundColor: '#374151',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                display: 'inline-block',
                                fontWeight: 600,
                            }}
                        >
                            Ask AI Assistant
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
