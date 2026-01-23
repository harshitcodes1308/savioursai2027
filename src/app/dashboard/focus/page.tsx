"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";

// --- Types ---
type FocusState = 'SETUP_CONTEXT' | 'SETUP_TIME' | 'ACTIVE' | 'REFLECTION' | 'SUMMARY';

type FocusTaskType = 'LEARN' | 'REVISE' | 'PRACTICE' | 'TEST';
type FocusModeType = 'POMODORO' | 'DEEP_FOCUS' | 'LIGHT_FOCUS';

interface FocusSessionData {
    subject: string;
    taskType: FocusTaskType;
    mode: FocusModeType;
    plannedDuration: number;
    actualDuration: number;
    startTime: number | null;
}

const MODES: Record<FocusModeType, { label: string; duration: number; desc: string }> = {
    POMODORO: {
        label: "Pomodoro Mode",
        duration: 25,
        desc: "25 min focus + 5 min break"
    },
    DEEP_FOCUS: {
        label: "Deep Focus Mode",
        duration: 45,
        desc: "45-60 min uninterrupted"
    },
    LIGHT_FOCUS: {
        label: "Light Focus Mode",
        duration: 15,
        desc: "15-20 min, low-pressure"
    }
};

const TASK_TYPES: { id: FocusTaskType; label: string }[] = [
    { id: 'LEARN', label: 'Learn New Topic' },
    { id: 'REVISE', label: 'Revision' },
    { id: 'PRACTICE', label: 'Practice Problems' },
    { id: 'TEST', label: 'Mock Test' },
];

export default function FocusPage() {
    const [state, setState] = useState<FocusState>('SETUP_CONTEXT');

    const [data, setData] = useState<FocusSessionData>({
        subject: '',
        taskType: 'LEARN',
        mode: 'POMODORO',
        plannedDuration: 25,
        actualDuration: 0,
        startTime: null
    });

    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    const [reflection, setReflection] = useState({
        status: 'COMPLETED' as 'COMPLETED' | 'PARTIAL' | 'NOT_COMPLETED',
        quality: 'GOOD' as 'GOOD' | 'OKAY' | 'POOR',
        difficulty: ''
    });

    const logMutation = trpc.focus.logSession.useMutation();
    const { data: subjects, isLoading: subjectsLoading } = trpc.content.getSubjects.useQuery();

    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                setData(d => ({ ...d, actualDuration: d.actualDuration + 1 }));
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setState('REFLECTION');
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startSession = () => {
        setTimeLeft(data.plannedDuration * 60);
        setData(d => ({ ...d, startTime: Date.now() }));
        setState('ACTIVE');
        setIsActive(true);
    };

    const endSession = () => {
        setIsActive(false);
        setState('REFLECTION');
    };

    const submitLog = async () => {
        await logMutation.mutateAsync({
            subject: data.subject,
            taskType: data.taskType,
            mode: data.mode,
            plannedDuration: data.plannedDuration,
            actualDuration: Math.floor(data.actualDuration / 60),
            completionStatus: reflection.status,
            quality: reflection.quality,
            difficulty: reflection.difficulty || undefined
        });
        setState('SUMMARY');
    };

    // --- Render Steps ---

    if (state === 'SETUP_CONTEXT') {
        return (
            <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                    Focus Mode
                </h1>

                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '16px' }}>
                        What do you want to focus on?
                    </h2>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ ...typography.text, display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                            Select Subject:
                        </label>
                        {subjectsLoading ? (
                            <div style={{ ...typography.text, color: '#9CA3AF', padding: '24px', textAlign: 'center' }}>
                                Loading subjects...
                            </div>
                        ) : !subjects || subjects.length === 0 ? (
                            <div style={{ ...typography.text, color: '#9CA3AF', padding: '24px', textAlign: 'center' }}>
                                No subjects available
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                {subjects.map(sub => (
                                    <button
                                        key={sub.id}
                                        onClick={() => setData({ ...data, subject: sub.name })}
                                        style={{
                                            ...typography.text,
                                            padding: '24px',
                                            backgroundColor: data.subject === sub.name ? '#8B5CF6' : '#1A1A1D',
                                            color: '#FFF',
                                            border: data.subject === sub.name ? 'none' : '1px solid #374151',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseOver={(e) => data.subject !== sub.name && (e.currentTarget.style.backgroundColor = '#2D2D30')}
                                        onMouseOut={(e) => data.subject !== sub.name && (e.currentTarget.style.backgroundColor = '#1A1A1D')}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ ...typography.text, display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                            Task Type:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            {TASK_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setData({ ...data, taskType: type.id })}
                                    style={{
                                        ...typography.text,
                                        padding: '16px',
                                        backgroundColor: data.taskType === type.id ? '#8B5CF6' : '#1A1A1D',
                                        color: '#FFF',
                                        border: data.taskType === type.id ? 'none' : '1px solid #374151',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setState('SETUP_TIME')}
                            disabled={!data.subject}
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                                backgroundColor: data.subject ? '#8B5CF6' : '#4B5563',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: data.subject ? 'pointer' : 'not-allowed',
                                fontWeight: 600,
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (state === 'SETUP_TIME') {
        return (
            <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                    Focus Mode
                </h1>

                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '16px' }}>
                        Select Focus Mode
                    </h2>
                    <p style={{ ...typography.text, color: '#9CA3AF', marginBottom: '24px' }}>
                        Choose your study duration
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        {(Object.keys(MODES) as FocusModeType[]).map(modeKey => {
                            const mode = MODES[modeKey];
                            return (
                                <button
                                    key={modeKey}
                                    onClick={() => {
                                        setData({ ...data, mode: modeKey, plannedDuration: mode.duration });
                                        startSession();
                                    }}
                                    style={{
                                        ...typography.text,
                                        padding: '24px',
                                        backgroundColor: '#1A1A1D',
                                        color: '#FFF',
                                        border: '1px solid #374151',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2D2D30'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1A1A1D'}
                                >
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{mode.label}</div>
                                    <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>{mode.desc}</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B5CF6' }}>{mode.duration} min</div>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setState('SETUP_CONTEXT')}
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                                backgroundColor: '#374151',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (state === 'ACTIVE') {
        return (
            <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                    Focus Mode
                </h1>

                <div className="dashboard-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                            {MODES[data.mode].label} • {data.subject}
                        </span>
                    </div>

                    <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#FFF', marginBottom: '32px', fontFamily: 'monospace' }}>
                        {formatTime(timeLeft)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
                        <button
                            onClick={() => setIsActive(!isActive)}
                            style={{
                                ...typography.text,
                                padding: '12px 32px',
                                backgroundColor: '#8B5CF6',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 600,
                            }}
                        >
                            {isActive ? 'Pause' : 'Resume'}
                        </button>

                        <button
                            onClick={endSession}
                            style={{
                                ...typography.text,
                                padding: '12px 32px',
                                backgroundColor: '#EF4444',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 600,
                            }}
                        >
                            End Session
                        </button>
                    </div>

                    <p style={{ ...typography.text, fontSize: '14px', color: '#6B7280' }}>
                        Stay focused. You're doing great.
                    </p>
                </div>
            </div>
        );
    }

    if (state === 'REFLECTION') {
        return (
            <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                    Focus Mode
                </h1>

                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '24px' }}>
                        Session Complete
                    </h2>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ ...typography.text, display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                            Completion Status:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {(['COMPLETED', 'PARTIAL', 'NOT_COMPLETED'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setReflection({ ...reflection, status: s })}
                                    style={{
                                        ...typography.text,
                                        padding: '12px',
                                        backgroundColor: reflection.status === s ? '#8B5CF6' : '#1A1A1D',
                                        color: '#FFF',
                                        border: reflection.status === s ? 'none' : '1px solid #374151',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {s === 'NOT_COMPLETED' ? 'Not Done' : s === 'PARTIAL' ? 'Partial' : 'Completed'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ ...typography.text, display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                            Focus Quality:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {(['POOR', 'OKAY', 'GOOD'] as const).map((q) => (
                                <button
                                    key={q}
                                    onClick={() => setReflection({ ...reflection, quality: q })}
                                    style={{
                                        ...typography.text,
                                        padding: '12px',
                                        backgroundColor: reflection.quality === q ? '#8B5CF6' : '#1A1A1D',
                                        color: '#FFF',
                                        border: reflection.quality === q ? 'none' : '1px solid #374151',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={submitLog}
                        disabled={logMutation.isPending}
                        style={{
                            ...typography.text,
                            padding: '16px 32px',
                            backgroundColor: logMutation.isPending ? '#4B5563' : '#10B981',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: logMutation.isPending ? 'wait' : 'pointer',
                            fontSize: '18px',
                            fontWeight: 600,
                            width: '100%',
                        }}
                    >
                        {logMutation.isPending ? 'Saving...' : 'Complete Session'}
                    </button>
                </div>
            </div>
        );
    }

    // SUMMARY
    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                Focus Mode
            </h1>

            <div className="dashboard-card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
                <h2 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                    Session Logged
                </h2>
                <p style={{ ...typography.text, fontSize: '16px', color: '#9CA3AF', marginBottom: '32px' }}>
                    You studied <strong style={{ color: '#FFF' }}>{data.subject}</strong> for <strong style={{ color: '#FFF' }}>{Math.floor(data.actualDuration / 60)} minutes</strong>
                </p>

                <button
                    onClick={() => {
                        setState('SETUP_CONTEXT');
                        setData({ subject: '', taskType: 'LEARN', mode: 'POMODORO', plannedDuration: 25, actualDuration: 0, startTime: null });
                        setIsActive(false);
                        setReflection({ status: 'COMPLETED', quality: 'GOOD', difficulty: '' });
                    }}
                    style={{
                        ...typography.text,
                        padding: '12px 24px',
                        backgroundColor: '#8B5CF6',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 600,
                    }}
                >
                    Start Another Session
                </button>
            </div>
        </div>
    );
}
