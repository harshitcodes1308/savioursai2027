"use client";

import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import ReactMarkdown from "react-markdown";
import "../markdown-styles.css";
import { GenerationLoader } from "@/components/ui/GenerationLoader";
import { useResponsive } from "@/hooks/useResponsive";
import { canAccess, getUserPlan, AI_DOUBT_FREE_LIMIT } from "@/lib/planAccess";

interface Message {
    role: "user" | "assistant";
    content: string;
    videos?: Array<{
        videoId: string;
        title: string;
        description: string;
        thumbnail: string;
        channelTitle: string;
        url: string;
    }>;
}

export default function AIAssistantPage() {
    const { isMobile } = useResponsive();
    const { data: session } = trpc.auth.getSession.useQuery();
    const user = session?.user as any;
    const userPlan = getUserPlan(!!user?.isPaid, user?.planType);
    const canUseAI = canAccess("aiDoubtSolver", userPlan);

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your ICSE AI tutor. Ask me anything about your Class X subjects.",
        },
    ]);
    const [dailyCount, setDailyCount] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<{ type: "image" | "pdf"; data: string; name: string } | null>(null);
    const [input, setInput] = useState("");
    const [subject, setSubject] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Flashcard state
    const [mode, setMode] = useState<"chat" | "flashcards_setup" | "flashcards_active" | "flashcards_summary">("chat");
    const [flashcardInput, setFlashcardInput] = useState("");
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedbackState, setFeedbackState] = useState<"idle" | "correct" | "wrong">("idle");
    const setupRef = useRef<HTMLInputElement>(null);

    const generateFlashcards = trpc.ai.generateFlashcards.useMutation({
        onSuccess: (data) => {
            if (data.flashcards && data.flashcards.length > 0) {
                setFlashcards(data.flashcards);
                setMode("flashcards_active");
                setCurrentCardIndex(0);
                setScore(0);
                setAttempts(0);
                setFeedbackState("idle");
            }
        },
        onError: (err) => alert(`Error: ${err.message}`),
    });

    const handleOptionClick = (option: string) => {
        if (feedbackState !== "idle") return;
        setSelectedOption(option);
        const card = flashcards[currentCardIndex];
        if (option === card.correctAnswer) {
            setFeedbackState("correct");
            if (attempts === 0) setScore(s => s + 1);
        } else {
            setFeedbackState("wrong");
        }
    };

    const handleNextCard = () => {
        if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(i => i + 1);
            setAttempts(0);
            setFeedbackState("idle");
            setSelectedOption(null);
        } else {
            setMode("flashcards_summary");
        }
    };

    const askMutation = trpc.ai.askDoubt.useMutation({
        onSuccess: (data) => {
            setMessages(prev => [...prev, { role: "assistant", content: data.response, videos: data.videos }]);
            setDailyCount(c => c + 1);
        },
        onError: (err) => {
            setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
        },
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        if (file.type.startsWith("image/")) {
            reader.onload = ev => setUploadedFile({ type: "image", data: ev.target?.result as string, name: file.name });
            reader.readAsDataURL(file);
        } else if (file.type === "application/pdf") {
            reader.onload = ev => {
                const base64 = (ev.target?.result as string).split(",")[1];
                setUploadedFile({ type: "pdf", data: base64, name: file.name });
            };
            reader.readAsDataURL(file);
        }
    };

    const hitFreeLimit = userPlan === "free" && dailyCount >= AI_DOUBT_FREE_LIMIT;

    const handleSend = () => {
        if (!input.trim() || hitFreeLimit) return;
        setMessages(prev => [...prev, { role: "user", content: input }]);
        askMutation.mutate({ question: input, subject: subject || undefined, conversation: messages });
        setInput("");
    };

    const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History & Civics", "Geography"];

    return (
        <div style={{
            height: isMobile ? "calc(100vh - 128px)" : "100vh",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-base)",
            padding: isMobile ? "12px" : "24px",
            boxSizing: "border-box",
        }}>

            {/* ── Header ── */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                padding: "14px 20px",
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 14,
                flexWrap: "wrap",
                gap: 10,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>◈</span>
                    <div>
                        <div style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.02em",
                        }}>
                            {mode === "chat" ? "AI Doubt Solver" : "Flashcard Review"}
                        </div>
                        {userPlan === "free" && (
                            <div style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 11,
                                color: dailyCount >= AI_DOUBT_FREE_LIMIT ? "var(--status-red, #ef4444)" : "var(--text-muted)",
                            }}>
                                {dailyCount}/{AI_DOUBT_FREE_LIMIT} free queries used today
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {mode === "chat" && (
                        <select
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            style={{
                                padding: "7px 12px",
                                borderRadius: 8,
                                background: "var(--bg-base)",
                                border: "1px solid var(--bg-border)",
                                color: "var(--text-secondary)",
                                fontSize: 12,
                                fontFamily: "var(--font-body)",
                                outline: "none",
                            }}
                        >
                            <option value="">All Subjects</option>
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    )}
                    <button
                        onClick={() => {
                            if (mode === "chat") {
                                setMode("flashcards_setup");
                                setTimeout(() => setupRef.current?.focus(), 100);
                            } else {
                                setMode("chat");
                            }
                        }}
                        className="btn-gold"
                        style={{ fontSize: 12, padding: "8px 16px", borderRadius: 8 }}
                    >
                        {mode === "chat" ? "⚡ Review" : "← Chat"}
                    </button>
                </div>
            </div>

            {/* ── Chat Mode ── */}
            {mode === "chat" && (
                <>
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        padding: "4px 0",
                        marginBottom: 12,
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                }}>
                                    <div style={{
                                        maxWidth: "78%",
                                        padding: "12px 16px",
                                        borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                        background: msg.role === "user"
                                            ? "var(--accent-gold)"
                                            : "var(--bg-surface)",
                                        border: msg.role === "user" ? "none" : "1px solid var(--bg-border)",
                                        color: msg.role === "user" ? "var(--bg-base)" : "var(--text-primary)",
                                        fontFamily: "var(--font-body)",
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                    }}>
                                        {msg.role === "assistant" && (
                                            <div style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: 10,
                                                fontWeight: 700,
                                                color: "var(--accent-gold)",
                                                letterSpacing: "0.1em",
                                                textTransform: "uppercase",
                                                marginBottom: 8,
                                            }}>
                                                AI Tutor
                                            </div>
                                        )}
                                        <div className="markdown-content">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>

                                {/* Video recommendations */}
                                {msg.role === "assistant" && msg.videos && msg.videos.length > 0 && (
                                    <div style={{ marginTop: 10, maxWidth: "78%" }}>
                                        <div style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            marginBottom: 8,
                                        }}>
                                            Recommended videos
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {msg.videos.map(v => (
                                                <a
                                                    key={v.videoId}
                                                    href={v.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: "flex",
                                                        gap: 10,
                                                        background: "var(--bg-surface)",
                                                        border: "1px solid var(--bg-border)",
                                                        borderRadius: 10,
                                                        padding: 8,
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <img src={v.thumbnail} alt={v.title} style={{ width: 100, height: 56, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={{
                                                            fontFamily: "var(--font-body)",
                                                            fontSize: 13, fontWeight: 600,
                                                            color: "var(--text-primary)",
                                                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                            marginBottom: 3,
                                                        }}>
                                                            {v.title}
                                                        </div>
                                                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--accent-gold)" }}>
                                                            {v.channelTitle}
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {askMutation.isPending && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px" }}>
                                <div style={{
                                    width: 8, height: 8, borderRadius: "50%",
                                    background: "var(--accent-gold)",
                                    animation: "pulse 1s ease-in-out infinite",
                                }} />
                                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                                    Thinking...
                                </span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Free limit wall */}
                    {hitFreeLimit && (
                        <div style={{
                            padding: "14px 18px",
                            background: "rgba(0,212,255,0.06)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            borderRadius: 12,
                            marginBottom: 12,
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            color: "var(--accent-gold)",
                            textAlign: "center",
                        }}>
                            You've used all {AI_DOUBT_FREE_LIMIT} free daily queries. Upgrade for unlimited access.
                        </div>
                    )}

                    {/* Input */}
                    <div style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        borderRadius: 14,
                        padding: "12px 14px",
                    }}>
                        {uploadedFile && (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 10,
                                padding: "8px 10px",
                                background: "var(--bg-base)",
                                border: "1px solid var(--bg-border)",
                                borderRadius: 8,
                            }}>
                                {uploadedFile.type === "image" ? (
                                    <img src={uploadedFile.data} alt="Upload" style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }} />
                                ) : (
                                    <span style={{ fontSize: 24 }}>📄</span>
                                )}
                                <span style={{ flex: 1, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)" }}>{uploadedFile.name}</span>
                                <button
                                    onClick={() => setUploadedFile(null)}
                                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                style={{
                                    width: 38, height: 38,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "var(--bg-base)",
                                    border: "1px solid var(--bg-border)",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    fontSize: 16,
                                    flexShrink: 0,
                                    color: "var(--text-muted)",
                                }}
                                title="Attach image or PDF"
                            >
                                📎
                            </label>
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder={hitFreeLimit ? "Upgrade to continue asking..." : "Ask about any ICSE topic..."}
                                disabled={askMutation.isPending || hitFreeLimit}
                                rows={1}
                                style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    background: "var(--bg-base)",
                                    border: "1px solid var(--bg-border)",
                                    color: "var(--text-primary)",
                                    fontFamily: "var(--font-body)",
                                    fontSize: 14,
                                    outline: "none",
                                    resize: "none",
                                    lineHeight: 1.5,
                                    transition: "border-color 0.15s ease",
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = "var(--accent-gold-border)"; }}
                                onBlur={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={askMutation.isPending || !input.trim() || hitFreeLimit}
                                className="btn-gold"
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    opacity: (askMutation.isPending || !input.trim() || hitFreeLimit) ? 0.45 : 1,
                                    cursor: (askMutation.isPending || !input.trim() || hitFreeLimit) ? "not-allowed" : "pointer",
                                    flexShrink: 0,
                                }}
                            >
                                Send →
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Flashcard Setup ── */}
            {mode === "flashcards_setup" && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        borderRadius: 20,
                        padding: "48px 40px",
                        maxWidth: 540,
                        width: "100%",
                        textAlign: "center",
                    }}>
                        <div style={{ fontFamily: "var(--font-sub)", fontSize: 36, color: "var(--accent-gold)", marginBottom: 20, opacity: 0.7 }}>⚡</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 10 }}>
                            Quick Review
                        </h2>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6 }}>
                            Enter the topics you studied today — I'll generate 10 Class X questions to test you.
                        </p>
                        <input
                            ref={setupRef}
                            type="text"
                            value={flashcardInput}
                            onChange={e => setFlashcardInput(e.target.value)}
                            placeholder="e.g. Newton's Laws, Ionic Bonding, Quadratic Equations"
                            className="sa-input"
                            style={{ marginBottom: 16, width: "100%", boxSizing: "border-box" }}
                        />
                        <button
                            onClick={() => generateFlashcards.mutate({ topics: flashcardInput, subject: subject || undefined })}
                            disabled={generateFlashcards.isPending || !flashcardInput.trim()}
                            className="btn-gold"
                            style={{
                                width: "100%",
                                padding: "14px",
                                fontSize: 14,
                                opacity: (generateFlashcards.isPending || !flashcardInput.trim()) ? 0.5 : 1,
                                cursor: (generateFlashcards.isPending || !flashcardInput.trim()) ? "not-allowed" : "pointer",
                            }}
                        >
                            {generateFlashcards.isPending ? "Generating..." : "Generate Questions →"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Flashcard Active ── */}
            {mode === "flashcards_active" && flashcards.length > 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "100%", maxWidth: 640, marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                            <span>Question {currentCardIndex + 1} / {flashcards.length}</span>
                            <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>Score: {score}</span>
                        </div>
                        <div style={{ height: 4, background: "var(--bg-border)", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{
                                width: `${((currentCardIndex + 1) / flashcards.length) * 100}%`,
                                height: "100%",
                                background: "var(--accent-gold)",
                                transition: "width 0.3s ease",
                            }} />
                        </div>
                    </div>

                    <div style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        borderRadius: 20,
                        padding: isMobile ? "24px 20px" : "36px",
                        maxWidth: 640,
                        width: "100%",
                    }}>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 28, lineHeight: 1.4 }}>
                            {flashcards[currentCardIndex].question}
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                            {flashcards[currentCardIndex].options.map((option: string, idx: number) => {
                                const isCorrect = option === flashcards[currentCardIndex].correctAnswer;
                                const isSelected = selectedOption === option;
                                const showCorrect = (feedbackState === "correct" && isCorrect) ||
                                    (feedbackState === "wrong" && attempts >= 1 && isCorrect);
                                const isWrong = isSelected && feedbackState === "wrong";

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={feedbackState !== "idle"}
                                        style={{
                                            padding: "16px 18px",
                                            borderRadius: 12,
                                            background: showCorrect
                                                ? "rgba(34,197,94,0.1)"
                                                : isWrong
                                                ? "rgba(239,68,68,0.1)"
                                                : "var(--bg-base)",
                                            border: `1px solid ${showCorrect ? "rgba(34,197,94,0.4)" : isWrong ? "rgba(239,68,68,0.4)" : "var(--bg-border)"}`,
                                            color: showCorrect ? "#22c55e" : isWrong ? "#ef4444" : "var(--text-primary)",
                                            fontFamily: "var(--font-body)",
                                            fontSize: 14,
                                            textAlign: "left",
                                            cursor: feedbackState === "idle" ? "pointer" : "default",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        <span style={{ fontWeight: 700, opacity: 0.4, marginRight: 10 }}>
                                            {String.fromCharCode(65 + idx)}.
                                        </span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        {feedbackState !== "idle" && (
                            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--bg-border)" }}>
                                <p style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: 13, fontWeight: 600,
                                    color: feedbackState === "correct" ? "#22c55e" : "#ef4444",
                                    marginBottom: 8,
                                }}>
                                    {feedbackState === "correct" ? "Correct!" : attempts >= 1 ? "The correct answer is highlighted." : "Not quite. Try once more!"}
                                </p>
                                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                                    {flashcards[currentCardIndex].explanation}
                                </p>
                                {((feedbackState === "wrong" && attempts >= 1) || feedbackState === "correct") && (
                                    <button
                                        onClick={handleNextCard}
                                        className="btn-gold"
                                        style={{ float: "right", padding: "9px 20px", fontSize: 13, borderRadius: 8 }}
                                    >
                                        {currentCardIndex < flashcards.length - 1 ? "Next →" : "Finish"}
                                    </button>
                                )}
                                {feedbackState === "wrong" && attempts < 1 && (
                                    <button
                                        onClick={() => { setFeedbackState("idle"); setAttempts(1); }}
                                        style={{
                                            float: "right",
                                            padding: "9px 20px",
                                            borderRadius: 8,
                                            background: "var(--bg-base)",
                                            border: "1px solid var(--bg-border)",
                                            color: "var(--text-secondary)",
                                            fontFamily: "var(--font-body)",
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Try again ↺
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Flashcard Summary ── */}
            {mode === "flashcards_summary" && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        borderRadius: 20,
                        padding: "48px 40px",
                        maxWidth: 440,
                        width: "100%",
                        textAlign: "center",
                    }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 56, marginBottom: 20 }}>
                            {score >= 8 ? "◈" : score >= 5 ? "◉" : "◎"}
                        </div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 8 }}>
                            Review Complete
                        </h2>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--text-muted)", marginBottom: 32 }}>
                            You scored{" "}
                            <span style={{ color: "var(--accent-gold)", fontWeight: 700 }}>
                                {score} / {flashcards.length}
                            </span>
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <button
                                onClick={() => { setMode("flashcards_setup"); setScore(0); setCurrentCardIndex(0); setFlashcards([]); }}
                                className="btn-gold"
                                style={{ padding: "13px", fontSize: 14 }}
                            >
                                Start another review
                            </button>
                            <button
                                onClick={() => { setMode("chat"); setScore(0); setCurrentCardIndex(0); setFlashcards([]); }}
                                className="btn-ghost"
                                style={{ padding: "13px", fontSize: 14 }}
                            >
                                Back to chat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <GenerationLoader
                isVisible={generateFlashcards.isPending}
                label="Generating Questions..."
                subLabel="Extracting key concepts from your topics..."
            />
        </div>
    );
}
