'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import { typography } from '@/lib/typography';
import { ICSE_SUBJECTS, ICSE_CHAPTERS } from '@/lib/icse-data';
import type { MCQ } from '@/lib/test-generator';
import { useResponsive } from '@/hooks/useResponsive';

type Step =
    | 'subject'
    | 'chapters'
    | 'config'
    | 'timer'
    | 'preview'
    | 'test'
    | 'results'
    | 'analysis'
    | 'solutions';

export default function CustomiseTestPage() {
    const { isMobile } = useResponsive();
    const [step, setStep] = useState<Step>('subject');

    // Config states
    const [subject, setSubject] = useState('');
    const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [duration, setDuration] = useState(10);

    // Test states
    const [attemptId, setAttemptId] = useState('');
    const [questions, setQuestions] = useState<MCQ[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [markedReview, setMarkedReview] = useState<string[]>([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [result, setResult] = useState<any>(null);

    // Mutations
    const createMutation = trpc.test.createTest.useMutation();
    const saveAnswerMutation = trpc.test.saveAnswer.useMutation();
    const markReviewMutation = trpc.test.markForReview.useMutation();
    const submitMutation = trpc.test.submitTest.useMutation();

    // Timer effect
    useEffect(() => {
        if (step === 'test' && timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, timeRemaining]);

    const handleCreateTest = async () => {
        const result = await createMutation.mutateAsync({
            subject,
            chapters: selectedChapters,
            totalQuestions,
            duration,
        });

        setAttemptId(result.attemptId);
        setQuestions(result.questions as MCQ[]);
        setTimeRemaining(duration * 60);
        setStep('test');
    };

    const handleAnswerSelect = (questionId: string, answer: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        saveAnswerMutation.mutate({ attemptId, questionId, answer });
    };

    const handleMarkReview = (questionId: string) => {
        const isMarked = markedReview.includes(questionId);
        const newMarked = isMarked
            ? markedReview.filter(id => id !== questionId)
            : [...markedReview, questionId];

        setMarkedReview(newMarked);
        markReviewMutation.mutate({ attemptId, questionId, marked: !isMarked });
    };

    const handleSubmit = async () => {
        const submittedResult = await submitMutation.mutateAsync({ attemptId });
        setResult(submittedResult);
        setStep('results');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQ = questions[currentQuestion];

    return (
        <div style={{ padding: isMobile ? '16px' : '32px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' as const, overflowX: 'hidden' as const }}>
            <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                Customise Test
            </h1>

            {/* STEP 1: Subject Selection */}
            {step === 'subject' && (
                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '16px' }}>
                        Select  the subject you want to create a test for:
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '10px' : '16px', marginTop: '24px' }}>
                        {ICSE_SUBJECTS.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => {
                                    setSubject(sub);
                                    setStep('chapters');
                                }}
                                className="btn-gold"
                                style={{
                                    ...typography.text,
                                    padding: '24px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                }}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: Chapter Selection */}
            {step === 'chapters' && (
                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '16px' }}>
                        Select chapter(s) for {subject}:
                    </h2>
                    <div style={{ marginTop: '24px' }}>
                        {ICSE_CHAPTERS[subject]?.map((ch) => (
                            <label key={ch} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedChapters.includes(ch)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedChapters([...selectedChapters, ch]);
                                        } else {
                                            setSelectedChapters(selectedChapters.filter(c => c !== ch));
                                        }
                                    }}
                                    style={{ width: '20px', height: '20px', marginRight: '12px' }}
                                />
                                <span style={{ ...typography.text, fontSize: '16px' }}>{ch}</span>
                            </label>
                        ))}
                    </div>
                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setStep('subject')}
                            className="btn-ghost"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                            }}
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep('config')}
                            disabled={selectedChapters.length === 0}
                            className="btn-gold"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                                opacity: selectedChapters.length > 0 ? 1 : 0.4,
                                cursor: selectedChapters.length > 0 ? 'pointer' : 'not-allowed',
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: Question Configuration */}
            {step === 'config' && (
                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '24px' }}>
                        Configure Your Test
                    </h2>
                    <div>
                        <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>
                            Number of Questions:
                        </label>
                        <input
                            type="number"
                            value={totalQuestions}
                            onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 10)}
                            min="5"
                            max="50"
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
                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setStep('chapters')}
                            className="btn-ghost"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                            }}
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep('timer')}
                            className="btn-gold"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: Timer Setup */}
            {step === 'timer' && (
                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '24px' }}>
                        Set Test Duration
                    </h2>
                    <div>
                        <label style={{ ...typography.text, display: 'block', marginBottom: '8px' }}>
                            Duration (minutes):
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 10)}
                            min="5"
                            max="120"
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
                        <p style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF', marginTop: '8px' }}>
                            Recommended: {totalQuestions} minutes (~1 min per question)
                        </p>
                    </div>
                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setStep('config')}
                            className="btn-ghost"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                            }}
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep('preview')}
                            className="btn-gold"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 5: Preview */}
            {step === 'preview' && (
                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '24px' }}>
                        Test Preview
                    </h2>
                    <div style={{ ...typography.text, fontSize: '16px', lineHeight: '1.8' }}>
                        <p><strong>Subject:</strong> {subject}</p>
                        <p><strong>Chapters:</strong> {selectedChapters.join(', ')}</p>
                        <p><strong>Total Questions:</strong> {totalQuestions}</p>
                        <p><strong>Duration:</strong> {duration} minutes</p>
                        <p><strong>Question Type:</strong> Multiple Choice (MCQ)</p>
                        <p><strong>Difficulty:</strong> ICSE Board Standard</p>
                    </div>
                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setStep('timer')}
                            className="btn-ghost"
                            style={{
                                ...typography.text,
                                padding: '12px 24px',
                            }}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleCreateTest}
                            disabled={createMutation.isPending}
                            style={{
                                ...typography.text,
                                padding: '16px 32px',
                                backgroundColor: createMutation.isPending ? '#4B5563' : '#10B981',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: createMutation.isPending ? 'wait' : 'pointer',
                                fontSize: '18px',
                                fontWeight: 600,
                            }}
                        >
                            {createMutation.isPending ? 'Generating Questions...' : '▶ Start Test'}
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 6: Test Attempt */}
            {step === 'test' && currentQ && (
                <div>
                    {/* Timer & Navigation Bar */}
                    <div className="dashboard-card" style={{ padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ ...typography.text, fontSize: '16px', fontWeight: 600 }}>
                            Question {currentQuestion + 1} of {questions.length}
                        </div>
                        <div style={{ ...typography.text, fontSize: '20px', fontWeight: 600, color: timeRemaining < 60 ? '#EF4444' : '#10B981' }}>
                            ⏱ {formatTime(timeRemaining)}
                        </div>
                    </div>

                    {/* Question  */}
                    <div className="dashboard-card" style={{ padding: '32px' }}>
                        <h3 style={{ ...typography.display, fontSize: '20px', marginBottom: '24px' }}>
                            Q{currentQuestion + 1}. {currentQ.question}
                        </h3>
                        <div style={{ marginTop: '24px' }}>
                            {currentQ.options.map((option, idx) => (
                                <label
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        marginBottom: '12px',
                                        backgroundColor: answers[currentQ.id] === idx ? 'rgba(0, 212, 255, 0.12)' : 'rgba(26, 26, 29, 0.6)',
                                        border: '2px solid',
                                        borderColor: answers[currentQ.id] === idx ? 'rgba(0, 212, 255, 0.5)' : 'rgba(55, 65, 81, 0.5)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        backdropFilter: 'blur(12px)',
                                    }}
                                    onClick={() => handleAnswerSelect(currentQ.id, idx)}
                                >
                                    <input
                                        type="radio"
                                        name={`q${currentQuestion}`}
                                        checked={answers[currentQ.id] === idx}
                                        onChange={() => handleAnswerSelect(currentQ.id, idx)}
                                        style={{ marginRight: '12px', width: '20px', height: '20px' }}
                                    />
                                    <span style={{ ...typography.text, fontSize: '16px' }}>{option}</span>
                                </label>
                            ))}
                        </div>

                        {/* Controls */}
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {currentQuestion > 0 && (
                                    <button
                                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                                        className="btn-ghost"
                                        style={{
                                            ...typography.text,
                                            padding: '12px 24px',
                                        }}
                                    >
                                        ← Previous
                                    </button>
                                )}
                                <button
                                    onClick={() => handleMarkReview(currentQ.id)}
                                    className={markedReview.includes(currentQ.id) ? 'btn-gold' : 'btn-ghost'}
                                    style={{
                                        ...typography.text,
                                        padding: '12px 24px',
                                    }}
                                >
                                    {markedReview.includes(currentQ.id) ? '⭐ Marked' : 'Mark for Review'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {answers[currentQ.id] !== undefined && (
                                    <button
                                        onClick={() => {
                                            const newAnswers = { ...answers };
                                            delete newAnswers[currentQ.id];
                                            setAnswers(newAnswers);
                                        }}
                                        style={{
                                            ...typography.text,
                                            padding: '12px 24px',
                                            backgroundColor: '#EF4444',
                                            color: '#FFF',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Clear Response
                                    </button>
                                )}
                                {currentQuestion < questions.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                                        className="btn-gold"
                                        style={{
                                            ...typography.text,
                                            padding: '12px 24px',
                                        }}
                                    >
                                        Save & Next →
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitMutation.isPending}
                                        style={{
                                            ...typography.text,
                                            padding: '12px 32px',
                                            backgroundColor: submitMutation.isPending ? '#4B5563' : '#10B981',
                                            color: '#FFF',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: submitMutation.isPending ? 'wait' : 'pointer',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {submitMutation.isPending ? 'Submitting...' : '✓ Submit Test'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Question Navigator */}
                    <div className="dashboard-card" style={{ padding: '24px', marginTop: '16px' }}>
                        <h4 style={{ ...typography.text, fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>
                            Question Navigator:
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestion(idx)}
                                    style={{
                                        ...typography.text,
                                        padding: '8px',
                                        backgroundColor:
                                            idx === currentQuestion ? '#00D4FF' :
                                                answers[q.id] !== undefined ? '#10B981' :
                                                    markedReview.includes(q.id) ? '#F59E0B' : '#374151',
                                        color: '#FFF',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                        <div style={{ marginTop: '16px', ...typography.text, fontSize: '12px', color: '#9CA3AF' }}>
                            <span style={{ color: '#10B981' }}>● Answered</span> |
                            <span style={{ color: '#F59E0B', marginLeft: '8px' }}>● Marked</span> |
                            <span style={{ color: '#374151', marginLeft: '8px' }}>● Not Answered</span>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 7: Results */}
            {step === 'results' && result && (
                <div className="dashboard-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                        {result.accuracy >= 75 ? '🎉' : result.accuracy >= 50 ? '👍' : '📚'}
                    </div>
                    <h2 style={{ ...typography.display, fontSize: '32px', marginBottom: '24px' }}>
                        Test Completed!
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '32px' }}>
                        <div style={{ padding: '24px', backgroundColor: '#1A1A1D', borderRadius: '12px' }}>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>Score</div>
                            <div style={{ ...typography.display, fontSize: '32px', color: '#10B981' }}>
                                {result.correct}/{result.totalQuestions}
                            </div>
                        </div>
                        <div style={{ padding: '24px', backgroundColor: '#1A1A1D', borderRadius: '12px' }}>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>Accuracy</div>
                            <div style={{ ...typography.display, fontSize: '32px', color: '#00D4FF' }}>
                                {result.accuracy.toFixed(1)}%
                            </div>
                        </div>
                        <div style={{ padding: '24px', backgroundColor: '#1A1A1D', borderRadius: '12px' }}>
                            <div style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>Time</div>
                            <div style={{ ...typography.display, fontSize: '32px', color: '#F59E0B' }}>
                                {result.timeTaken} min
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setStep('analysis')}
                        className="btn-gold"
                        style={{
                            ...typography.text,
                            marginTop: '32px',
                            padding: '16px 32px',
                            fontSize: '16px',
                            fontWeight: 600,
                        }}
                    >
                        View Detailed Analysis →
                    </button>
                </div>
            )}

            {/* STEP 8: Analysis */}
            {step === 'analysis' && result && (
                <div className="dashboard-card" style={{ padding: '32px' }}>
                    <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '24px' }}>
                        Performance Analysis
                    </h2>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ ...typography.text, fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                            Overall Performance
                        </h3>
                        <div style={{ ...typography.text, fontSize: '16px', lineHeight: '1.8' }}>
                            <p>✅ Correct: {result.correct}</p>
                            <p>❌ Incorrect: {result.incorrect}</p>
                            <p>⊗ Unattempted: {result.unattempted}</p>
                            <p>📊 Accuracy: {result.accuracy.toFixed(1)}%</p>
                            <p>⏱ Time Management: {result.timeManagement}</p>
                        </div>
                    </div>

                    {result.strongChapters.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ ...typography.text, fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#10B981' }}>
                                💪 Strong Chapters
                            </h3>
                            <ul style={{ ...typography.text, fontSize: '16px', listStyle: 'disc', paddingLeft: '24px' }}>
                                {result.strongChapters.map((ch: string) => (
                                    <li key={ch}>{ch}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.weakChapters.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ ...typography.text, fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#EF4444' }}>
                                📖 Needs More Practice
                            </h3>
                            <ul style={{ ...typography.text, fontSize: '16px', listStyle: 'disc', paddingLeft: '24px' }}>
                                {result.weakChapters.map((ch: string) => (
                                    <li key={ch}>{ch}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={() => setStep('solutions')}
                        className="btn-gold"
                        style={{
                            ...typography.text,
                            padding: '12px 32px',
                            fontSize: '16px',
                            fontWeight: 600,
                        }}
                    >
                        Review Solutions →
                    </button>
                </div>
            )}

            {/* STEP 9: Solutions */}
            {step === 'solutions' && (
                <div>
                    <div className="dashboard-card" style={{ padding: '32px', marginBottom: '16px' }}>
                        <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '8px' }}>
                            Solutions & Explanations
                        </h2>
                        <p style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                            Review all questions with detailed explanations
                        </p>
                    </div>

                    {questions.map((q, idx) => {
                        const userAnswer = answers[q.id];
                        const isCorrect = userAnswer === q.correctAnswer;

                        return (
                            <div key={q.id} className="dashboard-card" style={{ padding: '32px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{
                                        padding: '8px 16px',
                                        backgroundColor: isCorrect ? '#10B981' : userAnswer === undefined ? '#6B7280' : '#EF4444',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#FFF',
                                    }}>
                                        Q{idx + 1}
                                    </div>
                                    <h3 style={{ ...typography.text, fontSize: '18px', flex: 1 }}>{q.question}</h3>
                                </div>

                                <div style={{ marginTop: '16px' }}>
                                    {q.options.map((option, optIdx) => (
                                        <div
                                            key={optIdx}
                                            style={{
                                                padding: '12px 16px',
                                                marginBottom: '8px',
                                                backgroundColor:
                                                    optIdx === q.correctAnswer ? '#10B98120' :
                                                        optIdx === userAnswer && userAnswer !== q.correctAnswer ? '#EF444420' : '#1A1A1D',
                                                border: '2px solid',
                                                borderColor:
                                                    optIdx === q.correctAnswer ? '#10B981' :
                                                        optIdx === userAnswer && userAnswer !== q.correctAnswer ? '#EF4444' : '#374151',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <span style={{ ...typography.text, fontSize: '16px' }}>
                                                {String.fromCharCode(65 + optIdx)}. {option}
                                                {optIdx === q.correctAnswer && ' ✓'}
                                                {optIdx === userAnswer && userAnswer !== q.correctAnswer && ' ✗'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    marginTop: '16px',
                                    padding: '16px',
                                    backgroundColor: '#1A1A1D',
                                    borderRadius: '8px',
                                    borderLeft: '4px solid #00D4FF',
                                }}>
                                    <div style={{ ...typography.text, fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#00D4FF' }}>
                                        💡 Explanation:
                                    </div>
                                    <p style={{ ...typography.text, fontSize: '14px', lineHeight: '1.6', color: '#D1D5DB' }}>
                                        {q.explanation}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    <div className="dashboard-card" style={{ padding: '32px', textAlign: 'center' }}>
                        <button
                            onClick={() => {
                                // Reset everything
                                setStep('subject');
                                setSubject('');
                                setSelectedChapters([]);
                                setTotalQuestions(10);
                                setDuration(10);
                                setAttemptId('');
                                setQuestions([]);
                                setCurrentQuestion(0);
                                setAnswers({});
                                setMarkedReview([]);
                                setResult(null);
                            }}
                            className="btn-gold"
                            style={{
                                ...typography.text,
                                padding: '16px 32px',
                                fontSize: '16px',
                                fontWeight: 600,
                            }}
                        >
                            Create New Test
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
