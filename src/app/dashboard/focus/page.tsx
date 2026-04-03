'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import { typography } from '@/lib/typography';
import { FocusTaskType, FocusModeType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';

// --- Types ---
type FocusState = 'SETUP_CONTEXT' | 'SETUP_TIME' | 'SETUP_STYLE' | 'SETUP_CUSTOM' | 'PREVIEW_PLAN' | 'ACTIVE' | 'REFLECTION' | 'SUMMARY';

interface SessionBlock {
    type: 'FOCUS' | 'BREAK';
    duration: number; // minutes
}

interface FocusStyle {
    id: string;
    name: string;
    focusMinutes: number;
    breakMinutes: number;
    description: string;
}

const STYLES: Record<string, FocusStyle> = {
    POMODORO: { id: 'POMODORO', name: 'Pomodoro Mode', focusMinutes: 25, breakMinutes: 5, description: '25-minute focus blocks with 5-minute breaks' },
    DEEP_45: { id: 'DEEP_45', name: 'Deep Focus 45', focusMinutes: 45, breakMinutes: 10, description: '45-minute focused study sessions' },
    DEEP_60: { id: 'DEEP_60', name: 'Deep Focus 60', focusMinutes: 60, breakMinutes: 15, description: '60-minute deep work blocks' },
    LIGHT: { id: 'LIGHT', name: 'Light Focus', focusMinutes: 15, breakMinutes: 5, description: '15-minute quick focus sessions' },
    CUSTOM: { id: 'CUSTOM', name: 'Custom', focusMinutes: 0, breakMinutes: 0, description: 'Set your own timing' },
};

const TASK_TYPES: { id: FocusTaskType; label: string }[] = [
    { id: 'LEARN', label: 'Learn New Topic' },
    { id: 'REVISE', label: 'Revision' },
    { id: 'PRACTICE', label: 'Practice Problems' },
    { id: 'TEST', label: 'Mock Test' },
];

export default function FocusPage() {
    const router = useRouter();
    const { isMobile } = useResponsive();
    
    const [state, setState] = useState<FocusState>('SETUP_CONTEXT');
    const [subject, setSubject] = useState('');
    const [taskType, setTaskType] = useState<FocusTaskType>('LEARN');
    
    // Time setup
    const [totalMinutes, setTotalMinutes] = useState(60);
    const [selectedStyle, setSelectedStyle] = useState<FocusStyle>(STYLES.POMODORO);
    const [customFocus, setCustomFocus] = useState(25);
    const [customBreak, setCustomBreak] = useState(5);
    
    // Session plan
    const [blocks, setBlocks] = useState<SessionBlock[]>([]);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    // Reflection
    const [productivity, setProductivity] = useState(3);
    const [notes, setNotes] = useState('');
    
    const logSessionMutation = trpc.focus.logSession.useMutation();
    
    // Timer logic
    useEffect(() => {
        if (state === 'ACTIVE' && !isPaused && timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        // Block finished, move to next
                        if (currentBlockIndex < blocks.length - 1) {
                            setCurrentBlockIndex(prev => prev + 1);
                            return blocks[currentBlockIndex + 1].duration * 60;
                        } else {
                            // Session complete
                            setState('REFLECTION');
                            return 0;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [state, isPaused, timeRemaining, currentBlockIndex, blocks]);
    
    // Generate session plan
    const generatePlan = (style: FocusStyle, total: number) => {
        const plan: SessionBlock[] = [];
        let remaining = total;
        
        const focusDuration = style.id === 'CUSTOM' ? customFocus : style.focusMinutes;
        const breakDuration = style.id === 'CUSTOM' ? customBreak : style.breakMinutes;
        
        while (remaining > 0) {
            const focusTime = Math.min(focusDuration, remaining);
            plan.push({ type: 'FOCUS', duration: focusTime });
            remaining -= focusTime;
            
            if (remaining > 0) {
                const breakTime = Math.min(breakDuration, remaining);
                plan.push({ type: 'BREAK', duration: breakTime });
                remaining -= breakTime;
            }
        }
        
        return plan;
    };
    
    const handleStartSession = () => {
        const plan = generatePlan(selectedStyle, totalMinutes);
        setBlocks(plan);
        setCurrentBlockIndex(0);
        setTimeRemaining(plan[0].duration * 60);
        setState('ACTIVE');
    };
    
    const handleFinishSession = async () => {
        const focusBlocks = blocks.filter(b => b.type === 'FOCUS');
        const completedFocusBlocks = focusBlocks.filter((_, i) => i <= Math.floor(currentBlockIndex / 2));
        
        await logSessionMutation.mutateAsync({
            subject,
            taskType,
            mode: 'DEEP' as FocusModeType,
            plannedDuration: totalMinutes,
            actualDuration: Math.floor((Date.now() - sessionStartTime!) / 60000),
            completionStatus: 'COMPLETED',
            quality: productivity >= 4 ? 'GOOD' : productivity >= 3 ? 'OKAY' : 'POOR',
            notes,
            // NEW fields
            totalPlannedMinutes: totalMinutes,
            focusStyle: selectedStyle.id,
            customFocusMins: selectedStyle.id === 'CUSTOM' ? customFocus : undefined,
            customBreakMins: selectedStyle.id === 'CUSTOM' ? customBreak : undefined,
            blocksPlanned: focusBlocks.length,
            blocksCompleted: completedFocusBlocks.length,
        });
        
        setState('SUMMARY');
    };
    
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
    
    useEffect(() => {
        if (state === 'ACTIVE' && !sessionStartTime) {
            setSessionStartTime(Date.now());
        }
    }, [state, sessionStartTime]);
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    const currentBlock = blocks[currentBlockIndex];
    const focusBlocksCompleted = blocks.slice(0, currentBlockIndex).filter(b => b.type === 'FOCUS').length;
    const totalFocusBlocks = blocks.filter(b => b.type === 'FOCUS').length;
    
    return (
        <div style={{ padding: isMobile ? '16px' : '32px', maxWidth: '900px', margin: '0 auto', boxSizing: 'border-box' as const, overflowX: 'hidden' as const }}>
            {/* STEP 1: Subject + Task Type */}
            {state === 'SETUP_CONTEXT' && (
                <>
                    <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>🧘 Focus Mode</h1>
                    <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                        Distraction-free study sessions with smart timekeeping
                    </p>
                    
                    <div className="dashboard-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>What are you studying?</h3>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g., Periodic Table (Chemistry)"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--bg-border)',
                                backgroundColor: 'var(--bg-base)',
                                color: '#FFF',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    
                    <div className="dashboard-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Task Type</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            {TASK_TYPES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTaskType(t.id)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: `2px solid ${taskType === t.id ? '#00D4FF' : '#333'}`,
                                        backgroundColor: taskType === t.id ? 'rgba(139,92,246,0.2)' : '#1A1A1D',
                                        color: '#FFF',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 600
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setState('SETUP_TIME')}
                        disabled={!subject}
                        className="btn-gold"
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: 600,
                            opacity: subject ? 1 : 0.4,
                            cursor: subject ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Continue
                    </button>
                </>
            )}
            
            {/* STEP 2: Total Time */}
            {state === 'SETUP_TIME' && (
                <>
                    <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>⏱️ How much time do you have?</h2>
                    
                    <div className="dashboard-card" style={{ padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
                        <input
                            type="number"
                            value={totalMinutes}
                            onChange={(e) => setTotalMinutes(Math.max(10, Math.min(240, parseInt(e.target.value) || 60)))}
                            style={{
                                width: '200px',
                                padding: '16px',
                                fontSize: '48px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                borderRadius: '12px',
                                border: '2px solid #00D4FF',
                                backgroundColor: 'var(--bg-base)',
                                color: '#FFF'
                            }}
                        />
                        <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginTop: '16px' }}>minutes</p>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                        {[30, 60, 90, 120].map(preset => (
                            <button
                                key={preset}
                                onClick={() => setTotalMinutes(preset)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: `2px solid ${totalMinutes === preset ? '#00D4FF' : '#333'}`,
                                    backgroundColor: totalMinutes === preset ? 'rgba(139,92,246,0.2)' : '#1A1A1D',
                                    color: '#FFF',
                                    cursor: 'pointer'
                                }}
                            >
                                {preset} min
                            </button>
                        ))}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setState('SETUP_CONTEXT')} className="btn-ghost" style={{ flex: 1, padding: '16px' }}>Back</button>
                        <button onClick={() => setState('SETUP_STYLE')} className="btn-gold" style={{ flex: 2, padding: '16px', fontWeight: 600 }}>Continue</button>
                    </div>
                </>
            )}
            
            {/* STEP 3: Style Selection */}
            {state === 'SETUP_STYLE' && (
                <>
                    <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>🎯 Choose Your Focus Style</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        {Object.values(STYLES).map(style => (
                            <button
                                key={style.id}
                                onClick={() => {
                                    setSelectedStyle(style);
                                    if (style.id === 'CUSTOM') setState('SETUP_CUSTOM');
                                    else setState('PREVIEW_PLAN');
                                }}
                                style={{
                                    padding: '24px',
                                    borderRadius: '12px',
                                    border: `2px solid ${selectedStyle.id === style.id ? '#00D4FF' : '#333'}`,
                                    backgroundColor: selectedStyle.id === style.id ? 'rgba(139,92,246,0.15)' : '#1A1A1D',
                                    color: '#FFF',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{style.name}</div>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{style.description}</div>
                            </button>
                        ))}
                    </div>
                    
                    <button onClick={() => setState('SETUP_TIME')} className="btn-ghost" style={{ width: '100%', padding: '16px' }}>Back</button>
                </>
            )}
            
            {/* STEP 4: Custom Setup */}
            {state === 'SETUP_CUSTOM' && (
                <>
                    <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>⚙️ Custom Timing</h2>
                    
                    <div className="dashboard-card" style={{ padding: '24px', marginBottom: '16px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Focus Block (minutes)</label>
                        <input type="number" value={customFocus} onChange={(e) => setCustomFocus(parseInt(e.target.value) || 25)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)', backgroundColor: 'var(--bg-base)', color: '#FFF', fontSize: '16px' }} />
                    </div>
                    
                    <div className="dashboard-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Break (minutes)</label>
                        <input type="number" value={customBreak} onChange={(e) => setCustomBreak(parseInt(e.target.value) || 5)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)', backgroundColor: 'var(--bg-base)', color: '#FFF', fontSize: '16px' }} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setState('SETUP_STYLE')} className="btn-ghost" style={{ flex: 1, padding: '16px' }}>Back</button>
                        <button onClick={() => setState('PREVIEW_PLAN')} className="btn-gold" style={{ flex: 2, padding: '16px', fontWeight: 600 }}>Continue</button>
                    </div>
                </>
            )}
            
            {/* STEP 5: Preview Plan */}
            {state === 'PREVIEW_PLAN' && (
                <>
                    <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>📚 Your Session Plan</h2>
                    
                    <div className="dashboard-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '18px', marginBottom: '16px' }}>
                            <strong>Total Time:</strong> {totalMinutes} minutes<br />
                            <strong>Style:</strong> {selectedStyle.name}
                        </div>
                        
                        <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#00D4FF' }}>Structure:</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {generatePlan(selectedStyle, totalMinutes).map((block, i) => (
                                <div key={i} style={{ padding: '12px', backgroundColor: block.type === 'FOCUS' ? 'rgba(139,92,246,0.2)' : 'rgba(56,189,248,0.2)', borderRadius: '8px' }}>
                                    {block.type === 'FOCUS' ? '🎯' : '☕'} {block.type === 'FOCUS' ? 'Focus' : 'Break'}: {block.duration} min
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '8px' }}>
                            <strong>{generatePlan(selectedStyle, totalMinutes).filter(b => b.type === 'FOCUS').length}</strong> focus blocks, <strong>{generatePlan(selectedStyle, totalMinutes).filter(b => b.type === 'BREAK').length}</strong> breaks
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setState('SETUP_STYLE')} className="btn-ghost" style={{ flex: 1, padding: '16px' }}>Change Plan</button>
                        <button onClick={handleStartSession} className="btn-gold" style={{ flex: 2, padding: '16px', fontWeight: 600, fontSize: '18px' }}>🚀 Start Session</button>
                    </div>
                </>
            )}
            
            {/* ACTIVE TIMER */}
            {state === 'ACTIVE' && currentBlock && (
                <>
                    <div className="dashboard-card" style={{ padding: '48px', textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            {currentBlock.type === 'FOCUS' ? '🎯 Focus Block' : '☕ Break Time'}
                        </div>
                        
                        <div style={{ fontSize: isMobile ? '48px' : '72px', fontWeight: 'bold', color: currentBlock.type === 'FOCUS' ? '#00D4FF' : '#38BDF8', marginBottom: '16px' }}>
                            {formatTime(timeRemaining)}
                        </div>
                        
                        <div style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                            Block {Math.floor(currentBlockIndex / 2) + 1} of {Math.ceil(blocks.length / 2)}
                        </div>
                        
                        <div style={{ height: '8px', backgroundColor: '#333', borderRadius: '4px', marginTop: '24px', overflow: 'hidden' }}>
                            <div style={{ width: `${(currentBlockIndex / blocks.length) * 100}%`, height: '100%', backgroundColor: '#00D4FF', transition: 'width 0.3s' }} />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setIsPaused(!isPaused)} className="btn-ghost" style={{ flex: 1, padding: '16px', fontSize: '16px' }}>
                            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                        </button>
                        <button onClick={() => setState('REFLECTION')} style={{ flex: 1, padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', backdropFilter: 'blur(12px)' }}>
                            🛑 End Early
                        </button>
                    </div>
                </>
            )}
            
            {/* REFLECTION */}
            {state === 'REFLECTION' && (
                <>
                    <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>📊 How was your session?</h2>
                    
                    <div className="dashboard-card" style={{ padding: '24px', marginBottom: '16px' }}>
                        <label style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>Productivity (1-5)</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {[1, 2, 3, 4, 5].map(rating => (
                                <button
                                    key={rating}
                                    onClick={() => setProductivity(rating)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        border: `2px solid ${productivity === rating ? 'rgba(0, 212, 255, 0.6)' : '#333'}`,
                                        backgroundColor: productivity === rating ? 'rgba(0, 212, 255, 0.15)' : 'rgba(26, 26, 29, 0.6)',
                                        color: productivity === rating ? '#00D4FF' : '#FFF',
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        backdropFilter: 'blur(12px)',
                                    }}
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="dashboard-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <label style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What did you accomplish?"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)', backgroundColor: 'var(--bg-base)', color: '#FFF', fontSize: '16px', minHeight: '100px', fontFamily: 'inherit' }}
                        />
                    </div>
                    
                    <button onClick={handleFinishSession} className="btn-gold" style={{ width: '100%', padding: '16px', fontWeight: 600, fontSize: '16px' }}>
                        Finish Session
                    </button>
                </>
            )}
            
            {/* SUMMARY */}
            {state === 'SUMMARY' && (
                <>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                        <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Session Complete!</h2>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Great work staying focused!</p>
                    </div>
                    
                    <div className="dashboard-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Focus Blocks</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{focusBlocksCompleted}/{totalFocusBlocks}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Productivity</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{productivity}/5</div>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => router.push('/dashboard')} className="btn-gold" style={{ width: '100%', padding: '16px', fontWeight: 600, fontSize: '16px' }}>
                        Back to Dashboard
                    </button>
                </>
            )}
        </div>
    );
}
