"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";
import ReactMarkdown from "react-markdown";
import { ChevronRight, ChevronLeft, Brain, RotateCcw, Copy } from "lucide-react";
import { GenerationLoader } from "@/components/ui/GenerationLoader";
import { useResponsive } from "@/hooks/useResponsive";

// --- Types ---
type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 6 is result

interface StrategyData {
    subjects: string[];
    strengths: string[];
    weaknesses: string[];
    goals: {
        examName: string;
        targetScore: string;
        examDate: string;
    };
    schedule: {
        schoolHours: string;
        tuitionHours: string;
        selfStudyHours: string;
        wakeUpTime: string;
        sleepTime: string;
    };
    mode: "SURVIVAL" | "BALANCED" | "TOPPER";
}

const INITIAL_DATA: StrategyData = {
    subjects: [],
    strengths: [],
    weaknesses: [],
    goals: { examName: "", targetScore: "95%", examDate: "" },
    schedule: { schoolHours: "08:00 - 14:00", tuitionHours: "None", selfStudyHours: "3 hours", wakeUpTime: "06:30", sleepTime: "22:30" },
    mode: "BALANCED",
};

const SUBJECT_LIST = [
    "Mathematics", "Physics", "Chemistry", "Biology",
    "History & Civics", "Geography",
    "English Language", "English Literature",
    "Computer Applications", "Commercial Studies", "Economics", "Art"
];

const MODES = [
    {
        id: "SURVIVAL",
        title: "Survival Mode",
        desc: "Emergency protocol. Maximize marks in minimum time.",
    },
    {
        id: "BALANCED",
        title: "Balanced Mode",
        desc: "Sustainable routine. Healthy mix of study and rest.",
    },
    {
        id: "TOPPER",
        title: "Topper Mode",
        desc: "Unrelenting intensity. Aiming for 99%.",
    }
] as const;

export default function StrategyPage() {
    const { isMobile, isTablet } = useResponsive();
    const [step, setStep] = useState<WizardStep>(0);
    const [data, setData] = useState<StrategyData>(INITIAL_DATA);
    const [generatedStrategy, setGeneratedStrategy] = useState<string | null>(null);

    const generateMutation = trpc.strategy.generate.useMutation({
        onSuccess: (res) => {
            setGeneratedStrategy(res.strategy);
            setStep(6);
        },
        onError: (err) => {
            alert(err.message);
            setStep(5);
        }
    });

    const nextStep = () => setStep((s) => Math.min(6, s + 1) as WizardStep);
    const prevStep = () => setStep((s) => Math.max(0, s - 1) as WizardStep);
    const updateData = (updates: Partial<StrategyData>) => setData({ ...data, ...updates });

    const handleGenerate = () => {
        setStep(6);
        generateMutation.mutate(data);
    };

    // --- Render Logic ---

    const renderStep = () => {
        switch (step) {
            case 0: // Welcome
                return (
                    <div style={{ padding: '32px', textAlign: 'center' }}>
                        <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                            AI Strategy Planner
                        </h1>
                        <p style={{ ...typography.text, fontSize: '18px', color: '#9CA3AF', marginBottom: '32px' }}>
                            Stop guessing. Let our AI analyze your schedule, strengths, and goals to build the perfect exam battle plan.
                        </p>
                        <button
                            onClick={nextStep}
                            style={{
                                ...typography.text,
                                padding: '16px 32px',
                                backgroundColor: '#8B5CF6',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '18px',
                                fontWeight: 600,
                            }}
                        >
                            Start Planning
                        </button>
                    </div>
                );

            case 1: // Subjects
                return (
                    <div className="dashboard-card" style={{ padding: '32px' }}>
                        <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '16px' }}>
                            Select the subjects you are appearing for:
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '10px' : '16px', marginTop: '24px' }}>
                            {SUBJECT_LIST.map((sub) => {
                                const isSelected = data.subjects.includes(sub);
                                return (
                                    <button
                                        key={sub}
                                        onClick={() => {
                                            const newSubs = isSelected
                                                ? data.subjects.filter(s => s !== sub)
                                                : [...data.subjects, sub];
                                            updateData({ subjects: newSubs });
                                        }}
                                        style={{
                                            ...typography.text,
                                            padding: '24px',
                                            backgroundColor: isSelected ? '#8B5CF6' : '#1A1A1D',
                                            color: '#FFF',
                                            border: isSelected ? 'none' : '1px solid #374151',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {sub} {isSelected && '✓'}
                                    </button>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button
                                onClick={prevStep}
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
                            <button
                                onClick={nextStep}
                                disabled={data.subjects.length === 0}
                                style={{
                                    ...typography.text,
                                    padding: '12px 24px',
                                    backgroundColor: data.subjects.length > 0 ? '#8B5CF6' : '#4B5563',
                                    color: '#FFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: data.subjects.length > 0 ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );

            case 2: // Strengths & Weaknesses
                return (
                    <div className="dashboard-card" style={{ padding: '32px' }}>
                        <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '16px' }}>
                            Categorize your subjects:
                        </h2>
                        <p style={{ ...typography.text, color: '#9CA3AF', marginBottom: '24px' }}>
                            Select the relevant subjects for each category.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '20px' : '32px' }}>
                            {/* Weaknesses */}
                            <div>
                                <h3 style={{ ...typography.text, fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#EF4444' }}>
                                    🛡️ Needs Improvement
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {data.subjects.map(sub => {
                                        const isSelected = data.weaknesses.includes(sub);
                                        return (
                                            <button
                                                key={`weak-${sub}`}
                                                onClick={() => {
                                                    const isWeak = data.weaknesses.includes(sub);
                                                    const isStrong = data.strengths.includes(sub);
                                                    let newWeak = isWeak ? data.weaknesses.filter(s => s !== sub) : [...data.weaknesses, sub];
                                                    let newStrong = isStrong ? data.strengths.filter(s => s !== sub) : data.strengths;
                                                    if (!isWeak && isStrong) newStrong = data.strengths.filter(s => s !== sub);
                                                    updateData({ weaknesses: newWeak, strengths: newStrong });
                                                }}
                                                style={{
                                                    ...typography.text,
                                                    padding: '16px',
                                                    backgroundColor: isSelected ? '#EF4444' : '#1A1A1D',
                                                    border: isSelected ? 'none' : '1px solid #374151',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                {sub} {isSelected && '✓'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Strengths */}
                            <div>
                                <h3 style={{ ...typography.text, fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#10B981' }}>
                                    🎯 Strong Subjects
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {data.subjects.map(sub => {
                                        const isSelected = data.strengths.includes(sub);
                                        return (
                                            <button
                                                key={`strong-${sub}`}
                                                onClick={() => {
                                                    const isStrong = data.strengths.includes(sub);
                                                    const isWeak = data.weaknesses.includes(sub);
                                                    let newStrong = isStrong ? data.strengths.filter(s => s !== sub) : [...data.strengths, sub];
                                                    let newWeak = isWeak ? data.weaknesses.filter(s => s !== sub) : data.weaknesses;
                                                    if (!isStrong && isWeak) newWeak = data.weaknesses.filter(s => s !== sub);
                                                    updateData({ strengths: newStrong, weaknesses: newWeak });
                                                }}
                                                style={{
                                                    ...typography.text,
                                                    padding: '16px',
                                                    backgroundColor: isSelected ? '#10B981' : '#1A1A1D',
                                                    border: isSelected ? 'none' : '1px solid #374151',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                {sub} {isSelected && '✓'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button
                                onClick={prevStep}
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
                            <button
                                onClick={nextStep}
                                style={{
                                    ...typography.text,
                                    padding: '12px 24px',
                                    backgroundColor: '#8B5CF6',
                                    color: '#FFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );

            case 3: // Goals
                return (
                    <div className="dashboard-card" style={{ padding: '32px' }}>
                        <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '24px' }}>
                            Set Your Goals
                        </h2>
                        <div style={{ maxWidth: '600px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>Exam Name</label>
                                <input
                                    value={data.goals.examName}
                                    onChange={(e) => updateData({ goals: { ...data.goals, examName: e.target.value } })}
                                    placeholder="e.g. ICSE Boards 2024"
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
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>Target Score</label>
                                <input
                                    value={data.goals.targetScore}
                                    onChange={(e) => updateData({ goals: { ...data.goals, targetScore: e.target.value } })}
                                    placeholder="e.g. 95% or Top 5"
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
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>Exam Date</label>
                                <input
                                    type="date"
                                    value={data.goals.examDate}
                                    onChange={(e) => updateData({ goals: { ...data.goals, examDate: e.target.value } })}
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
                            </div>
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button onClick={prevStep} style={{ ...typography.text, padding: '12px 24px', backgroundColor: '#374151', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                            <button onClick={nextStep} style={{ ...typography.text, padding: '12px 24px', backgroundColor: '#8B5CF6', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Next</button>
                        </div>
                    </div>
                );

            case 4: // Schedule
                return (
                    <div className="dashboard-card" style={{ padding: '32px' }}>
                        <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '24px' }}>
                            Daily Schedule
                        </h2>
                        <div style={{ maxWidth: '600px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>Wake Up Time</label>
                                <input type="time" value={data.schedule.wakeUpTime} onChange={e => updateData({ schedule: { ...data.schedule, wakeUpTime: e.target.value } })} style={{ ...typography.text, width: '100%', padding: '12px', backgroundColor: '#1A1A1D', border: '1px solid #374151', borderRadius: '8px', color: '#FFF', fontSize: '16px' }} />
                            </div>
                            <div>
                                <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>Sleep Time</label>
                                <input type="time" value={data.schedule.sleepTime} onChange={e => updateData({ schedule: { ...data.schedule, sleepTime: e.target.value } })} style={{ ...typography.text, width: '100%', padding: '12px', backgroundColor: '#1A1A1D', border: '1px solid #374151', borderRadius: '8px', color: '#FFF', fontSize: '16px' }} />
                            </div>
                        </div>
                        <div style={{ maxWidth: '600px', marginTop: '16px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>School Hours</label>
                                <input value={data.schedule.schoolHours} onChange={(e) => updateData({ schedule: { ...data.schedule, schoolHours: e.target.value } })} placeholder="e.g. 08:00 - 14:00" style={{ ...typography.text, width: '100%', padding: '12px', backgroundColor: '#1A1A1D', border: '1px solid #374151', borderRadius: '8px', color: '#FFF', fontSize: '16px' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>Tuition Hours</label>
                                <input value={data.schedule.tuitionHours} onChange={(e) => updateData({ schedule: { ...data.schedule, tuitionHours: e.target.value } })} placeholder="e.g. 17:00 - 19:00" style={{ ...typography.text, width: '100%', padding: '12px', backgroundColor: '#1A1A1D', border: '1px solid #374151', borderRadius: '8px', color: '#FFF', fontSize: '16px' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>Self Study Goal</label>
                                <input value={data.schedule.selfStudyHours} onChange={(e) => updateData({ schedule: { ...data.schedule, selfStudyHours: e.target.value } })} placeholder="e.g. 3 hours" style={{ ...typography.text, width: '100%', padding: '12px', backgroundColor: '#1A1A1D', border: '1px solid #374151', borderRadius: '8px', color: '#FFF', fontSize: '16px' }} />
                            </div>
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button onClick={prevStep} style={{ ...typography.text, padding: '12px 24px', backgroundColor: '#374151', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                            <button onClick={nextStep} style={{ ...typography.text, padding: '12px 24px', backgroundColor: '#8B5CF6', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Next</button>
                        </div>
                    </div>
                );

            case 5: // Mode
                return (
                    <div className="dashboard-card" style={{ padding: '32px' }}>
                        <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '16px' }}>
                            Select Strategy Mode
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
                            {MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => updateData({ mode: mode.id as any })}
                                    style={{
                                        ...typography.text,
                                        padding: '24px',
                                        backgroundColor: data.mode === mode.id ? '#8B5CF6' : '#1A1A1D',
                                        color: '#FFF',
                                        border: data.mode === mode.id ? 'none' : '1px solid #374151',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{mode.title}</div>
                                    <div style={{ fontSize: '14px', color: data.mode === mode.id ? '#E5E7EB' : '#9CA3AF' }}>{mode.desc}</div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={generateMutation.isPending}
                            style={{
                                ...typography.text,
                                marginTop: '32px',
                                padding: '16px 32px',
                                backgroundColor: generateMutation.isPending ? '#4B5563' : '#10B981',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: generateMutation.isPending ? 'wait' : 'pointer',
                                fontSize: '18px',
                                fontWeight: 600,
                                width: '100%'
                            }}
                        >
                            {generateMutation.isPending ? 'Generating Strategy...' : 'Generate My Strategy'}
                        </button>
                    </div>
                );

            case 6: // Result
                return (
                    <div className="dashboard-card" style={{ padding: isMobile ? '20px' : '48px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '32px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
                            <h2 style={{ ...typography.display, fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Brain style={{ color: '#8B5CF6' }} /> Your Strategy
                            </h2>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setStep(0)}
                                    style={{ ...typography.text, padding: '12px 24px', backgroundColor: '#374151', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <RotateCcw size={16} /> New
                                </button>
                                <button
                                    onClick={() => navigator.clipboard.writeText(generatedStrategy || "")}
                                    style={{ ...typography.text, padding: '12px 24px', backgroundColor: '#8B5CF6', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Copy size={16} /> Copy
                                </button>
                            </div>
                        </div>

                        <div style={{ ...typography.text, fontSize: '16px', lineHeight: '1.8', color: '#D1D5DB' }}>
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 style={{ ...typography.display, fontSize: '28px', marginTop: '32px', marginBottom: '16px', color: '#FFF', borderBottom: '1px solid #374151', paddingBottom: '8px' }} {...props} />,
                                    h2: ({ node, ...props }) => <h2 style={{ ...typography.display, fontSize: '22px', marginTop: '24px', marginBottom: '12px', color: '#A78BFA' }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }} {...props} />,
                                    li: ({ node, ...props }) => <li style={{ marginBottom: '8px' }} {...props} />,
                                    strong: ({ node, ...props }) => <strong style={{ color: '#FFF', fontWeight: 600 }} {...props} />,
                                }}
                            >
                                {generatedStrategy || ""}
                            </ReactMarkdown>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{ padding: isMobile ? '16px' : '32px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#030303', boxSizing: 'border-box' as const, overflowX: 'hidden' as const }}>
            <GenerationLoader 
                isVisible={generateMutation.isPending} 
                label="Crafting Strategy..." 
                subLabel="Analyzing your strengths & schedule..." 
            />
            {!generateMutation.isPending && renderStep()}
        </div>
    );
}
