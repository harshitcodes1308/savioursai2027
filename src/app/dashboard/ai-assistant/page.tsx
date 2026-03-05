"use client";

import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";
import ReactMarkdown from "react-markdown";
import "../markdown-styles.css";
import { GenerationLoader } from "@/components/ui/GenerationLoader";
import { useResponsive } from "@/hooks/useResponsive";

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
    const { isMobile, isTablet } = useResponsive();

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your ICSE AI tutor. Ask me anything about your subjects, doubts, or study strategies!",
        },
    ]);
    const [uploadedFile, setUploadedFile] = useState<{ type: 'image' | 'pdf'; data: string; name: string } | null>(null);
    const [input, setInput] = useState("");
    const [subject, setSubject] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Flashcard State
    const [mode, setMode] = useState<"chat" | "flashcards_setup" | "flashcards_active" | "flashcards_summary">("chat");
    const [flashcardInput, setFlashcardInput] = useState("");
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedbackState, setFeedbackState] = useState<"idle" | "correct" | "wrong">("idle");
    const setupRef = useRef<HTMLInputElement>(null);


    // Mutations
    const generateFlashcards = trpc.ai.generateFlashcards.useMutation({
        onSuccess: (data) => {
            console.log("Flashcard mutation success:", data);
            if (data.flashcards && data.flashcards.length > 0) {
                setFlashcards(data.flashcards);
                setMode("flashcards_active");
                setCurrentCardIndex(0);
                setScore(0);
                setAttempts(0);
                setFeedbackState("idle");
            } else {
                console.warn("No flashcards returned in data");
                alert("Could not generate flashcards. Please try a different topic.");
            }
        },
        onError: (err) => {
            console.error("Flashcard mutation error:", err);
            alert(`Error generating flashcards: ${err.message}`);
        }
    });

    const handleGenerateFlashcards = () => {
        generateFlashcards.mutate({ topics: flashcardInput, subject: subject || undefined });
    };

    // Flashcard Handlers
    const handleOptionClick = (option: string) => {
        if (feedbackState !== "idle") return;

        setSelectedOption(option);
        const currentCard = flashcards[currentCardIndex];

        if (option === currentCard.correctAnswer) {
            setFeedbackState("correct");
            if (attempts === 0) setScore(s => s + 1);
        } else {
            setFeedbackState("wrong");
        }
    };

    const handleNextCard = () => {
        if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setAttempts(0);
            setFeedbackState("idle");
            setSelectedOption(null);
        } else {
            setMode("flashcards_summary");
        }
    };

    const askMutation = trpc.ai.askDoubt.useMutation({
        onSuccess: (data) => {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response,
                    videos: data.videos,
                },
            ]);
        },
        onError: (error) => {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: `Error: ${error.message}` },
            ]);
        },
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileType = file.type;

        if (fileType.startsWith('image/')) {
            // Handle image
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedFile({
                    type: 'image',
                    data: e.target?.result as string,
                    name: file.name
                });
            };
            reader.readAsDataURL(file);
        } else if (fileType === 'application/pdf') {
            // Handle PDF
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = (e.target?.result as string).split(',')[1];
                setUploadedFile({
                    type: 'pdf',
                    data: base64,
                    name: file.name
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload only images or PDF files');
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        askMutation.mutate({
            question: input,
            subject: subject || undefined,
            conversation: messages,
        });

        setInput("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ padding: isMobile ? "12px" : "24px", maxWidth: "1000px", margin: "0 auto", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.03) 0%, transparent 50%), #030303", overflowX: "hidden" as const, boxSizing: "border-box" as const }}>
            {/* Header */}
            <div className="dashboard-card animate-fadeIn" style={{
                padding: isMobile ? "12px 14px" : "16px 28px",
                marginBottom: isMobile ? "12px" : "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                borderRadius: "18px",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 10 : 0,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: mode === "chat" ? "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))" : "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{mode === "chat" ? "🤖" : "⚡"}</div>
                    <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0, background: "linear-gradient(135deg, #FFF, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -0.3 }}>
                        {mode === "chat" ? "AI Tutor" : "Flashcard Review"}
                    </h1>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {mode === "chat" && (
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{
                                padding: "6px 12px",
                                borderRadius: "10px",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                color: "#FFFFFF",
                                fontSize: "12px",
                                outline: "none",
                            }}
                        >
                            <option value="">All Subjects</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="English">English</option>
                        </select>
                    )}
                    <button
                        onClick={() => {
                            if (mode === "chat") {
                                setMode("flashcards_setup");
                                setTimeout(() => {
                                    if (setupRef.current) setupRef.current.focus();
                                }, 100);
                            } else {
                                setMode("chat");
                            }
                        }}
                        style={{
                            padding: "8px 16px",
                            background: mode === "chat" ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.05)",
                            color: "#FFFFFF",
                            borderRadius: "10px",
                            border: mode === "chat" ? "none" : "1px solid rgba(255,255,255,0.08)",
                            fontWeight: 600,
                            fontSize: "12px",
                            cursor: "pointer",
                            boxShadow: mode === "chat" ? "0 4px 12px rgba(139,92,246,0.25)" : "none",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {mode === "chat" ? "⚡ Start Review" : "💬 Back to Chat"}
                    </button>
                </div>
            </div>

            {/* CHAT MODE */}
            {mode === "chat" && (
                <>
                    <div
                        className="dashboard-card"
                        style={{
                            flex: 1,
                            padding: "20px",
                            marginBottom: "12px",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                            borderRadius: "18px",
                        }}
                    >
                        {messages.map((message, index) => (
                            <div key={index}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "75%",
                                            padding: "14px 18px",
                                            borderRadius: message.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                            background: message.role === "user" 
                                                ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" 
                                                : "rgba(255,255,255,0.03)",
                                            border: message.role === "user" ? "none" : "1px solid rgba(255,255,255,0.04)",
                                            color: "#FFFFFF",
                                            boxShadow: message.role === "user" ? "0 4px 16px rgba(139,92,246,0.2)" : "none",
                                        }}
                                    >
                                        {message.role === "assistant" && (
                                            <div style={{ fontSize: "18px", marginBottom: "8px" }}>🤖</div>
                                        )}
                                        <div className="markdown-content" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                                {message.role === "assistant" && message.videos !== undefined && (
                                    <div style={{ marginTop: "12px", marginLeft: "0" }}>
                                        {message.videos.length > 0 && (
                                            <div style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "8px", fontWeight: "600" }}>
                                                📺 Recommended Videos:
                                            </div>
                                        )}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            {message.videos.map((video) => (
                                                <a
                                                    key={video.videoId}
                                                    href={video.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: "flex",
                                                        gap: "12px",
                                                        backgroundColor: "#131316",
                                                        borderRadius: "8px",
                                                        padding: "8px",
                                                        textDecoration: "none",
                                                        transition: "all 0.2s",
                                                        border: "1px solid #1F1F22",
                                                    }}
                                                >
                                                    <img src={video.thumbnail} alt={video.title} style={{ width: "120px", height: "68px", borderRadius: "6px", objectFit: "cover" }} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#FFFFFF", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{video.title}</div>
                                                        <div style={{ fontSize: "11px", color: "#8B5CF6" }}>{video.channelTitle}</div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* Thinking Indicator */}
                        {askMutation.isPending && (
                            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", padding: "16px" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>🤖</div>
                                <div style={{ backgroundColor: "#1A1A1D", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", color: "#9CA3AF", display: "flex", gap: "8px", alignItems: "center" }}>
                                    <div className="thinking-dots"><span>●</span><span>●</span><span>●</span></div>
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        {/* File Preview */}
                        {uploadedFile && (
                            <div style={{ marginBottom: "12px", padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    {uploadedFile.type === 'image' ? (
                                        <img src={uploadedFile.data} alt="Uploaded" style={{ maxWidth: "60px", maxHeight: "60px", borderRadius: "4px" }} />
                                    ) : (
                                        <span style={{ fontSize: "32px" }}>📄</span>
                                    )}
                                    <div>
                                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>{uploadedFile.name}</div>
                                        <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{uploadedFile.type === 'image' ? 'Image' : 'PDF'}</div>
                                    </div>
                                </div>
                                <button onClick={() => setUploadedFile(null)} style={{ padding: "4px 12px", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "12px" }}>
                            {/* File Upload Button */}
                            <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ display: "none" }} id="file-upload-btn" />
                            <label htmlFor="file-upload-btn" style={{ padding: "12px", backgroundColor: "#374151", color: "#FFF", borderRadius: "8px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", flexShrink: 0 }} title="Upload image or PDF">📎</label>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask a question or upload a file..."
                                disabled={askMutation.isPending}
                                style={{
                                    flex: 1,
                                    padding: "13px 16px",
                                    borderRadius: "14px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    color: "#FFFFFF",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "all 0.3s ease",
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={askMutation.isPending || !input.trim()}
                                style={{
                                    padding: "12px 22px",
                                    borderRadius: "14px",
                                    background: askMutation.isPending || !input.trim() ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                                    color: "#FFFFFF",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: askMutation.isPending ? "not-allowed" : "pointer",
                                    boxShadow: "0 4px 12px rgba(139,92,246,0.2)",
                                    transition: "all 0.3s ease",
                                    letterSpacing: 0.3,
                                }}
                            >
                                Send →
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* FLASHCARD SETUP MODE */}
            {mode === "flashcards_setup" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div className="dashboard-card" style={{ padding: "40px", maxWidth: "600px", width: "100%", textAlign: "center" }}>
                        <div style={{ fontSize: "40px", marginBottom: "20px" }}>⚡</div>
                        <h2 style={{ ...typography.display, fontSize: "24px", marginBottom: "12px" }}>What are the topics you studied today?</h2>
                        <p style={{ ...typography.text, color: "#9CA3AF", marginBottom: "32px" }}>
                            Enter the topics you studied and I'll generate 10 ICSE Class 10 questions to test your understanding.
                        </p>

                        <input
                            ref={setupRef}
                            type="text"
                            value={flashcardInput}
                            onChange={(e) => setFlashcardInput(e.target.value)}
                            placeholder="e.g. Newton's Laws of Motion, Chemical Bonding, Quadratic Equations"
                            style={{
                                width: "100%",
                                padding: "16px",
                                borderRadius: "12px",
                                backgroundColor: "#131316",
                                border: "1px solid #374151",
                                color: "#FFFFFF",
                                fontSize: "16px",
                                marginBottom: "24px",
                                outline: "none"
                            }}
                        />

                        <button
                            onClick={handleGenerateFlashcards}
                            disabled={generateFlashcards.isPending || !flashcardInput.trim()}
                            style={{
                                width: "100%",
                                padding: "16px",
                                borderRadius: "12px",
                                backgroundColor: "#8B5CF6",
                                color: "#FFFFFF",
                                fontSize: "16px",
                                fontWeight: "700",
                                border: "none",
                                cursor: "pointer",
                                opacity: generateFlashcards.isPending ? 0.7 : 1,
                                transition: "transform 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            {generateFlashcards.isPending ? "Generating Questions..." : "Generate Flashcards"}
                        </button>
                    </div>
                </div>
            )}

            {/* FLASHCARD ACTIVE MODE */}
            {mode === "flashcards_active" && flashcards.length > 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ marginBottom: "24px", width: "100%", maxWidth: "600px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#9CA3AF", fontSize: "14px", fontWeight: "600" }}>
                            <span>Question {currentCardIndex + 1} of {flashcards.length}</span>
                            <span>Score: {score}</span>
                        </div>
                        <div style={{ height: "6px", backgroundColor: "#374151", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%`, height: "100%", backgroundColor: "#8B5CF6", transition: "width 0.3s ease" }} />
                        </div>
                    </div>

                    <div className="dashboard-card" style={{ padding: "40px", maxWidth: "700px", width: "100%", position: "relative" }}>
                        <h3 style={{ ...typography.display, fontSize: "22px", marginBottom: "32px", lineHeight: "1.4" }}>
                            {flashcards[currentCardIndex].question}
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {flashcards[currentCardIndex].options.map((option: string, idx: number) => {
                                const isSelected = selectedOption === option;
                                const isCorrect = option === flashcards[currentCardIndex].correctAnswer;
                                const isWrongSelection = isSelected && !isCorrect;
                                const showCorrect = (feedbackState === "correct" || (feedbackState === "wrong" && attempts >= 1)) && isCorrect;

                                let bgColor = "#131316";
                                let borderColor = "#374151";

                                if (feedbackState === "correct" && isCorrect) {
                                    bgColor = "rgba(16, 185, 129, 0.1)";
                                    borderColor = "#10B981";
                                } else if (feedbackState === "wrong" && isWrongSelection) {
                                    bgColor = "rgba(239, 68, 68, 0.1)";
                                    borderColor = "#EF4444";
                                } else if (showCorrect) {
                                    bgColor = "rgba(16, 185, 129, 0.1)";
                                    borderColor = "#10B981";
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={feedbackState !== "idle"}
                                        style={{
                                            padding: "20px",
                                            borderRadius: "12px",
                                            backgroundColor: bgColor,
                                            border: `1px solid ${borderColor}`,
                                            color: "#FFFFFF",
                                            textAlign: "left",
                                            fontSize: "16px",
                                            cursor: feedbackState === "idle" ? "pointer" : "default",
                                            transition: "all 0.2s",
                                            position: "relative"
                                        }}
                                    >
                                        <span style={{ marginRight: "12px", fontWeight: "700", opacity: 0.5 }}>{String.fromCharCode(65 + idx)}.</span>
                                        {option}
                                        {feedbackState === "wrong" && isWrongSelection && (
                                            <span style={{ position: "absolute", right: "12px", color: "#EF4444" }}>❌</span>
                                        )}
                                        {(feedbackState === "correct" && isCorrect || showCorrect) && (
                                            <span style={{ position: "absolute", right: "12px", color: "#10B981" }}>✅</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {feedbackState !== "idle" && (
                            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #374151" }}>
                                <p style={{ ...typography.text, color: feedbackState === "correct" ? "#10B981" : "#EF4444", fontWeight: "600", marginBottom: "8px" }}>
                                    {feedbackState === "correct" ? "🎉 Correct!" : attempts >= 1 ? "👀 The correct answer is highlighted." : "❌ Incorrect. Try one more time!"}
                                </p>
                                <p style={{ ...typography.text, color: "#9CA3AF", fontSize: "14px", marginBottom: "16px" }}>
                                    {flashcards[currentCardIndex].explanation}
                                </p>
                                {((feedbackState === "wrong" && attempts >= 1) || feedbackState === "correct") && (
                                    <button
                                        onClick={handleNextCard}
                                        style={{
                                            padding: "10px 24px",
                                            backgroundColor: "#8B5CF6",
                                            color: "#FFFFFF",
                                            borderRadius: "8px",
                                            border: "none",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            float: "right"
                                        }}
                                    >
                                        {currentCardIndex < flashcards.length - 1 ? "Next Question →" : "Finish Review"}
                                    </button>
                                )}
                                {feedbackState === "wrong" && attempts < 1 && (
                                    <button
                                        onClick={() => {
                                            setFeedbackState("idle");
                                            setAttempts(1);
                                        }}
                                        style={{
                                            padding: "10px 24px",
                                            backgroundColor: "#374151",
                                            color: "#FFFFFF",
                                            borderRadius: "8px",
                                            border: "none",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            float: "right"
                                        }}
                                    >
                                        Try Again ↺
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FLASHCARD SUMMARY MODE */}
            {mode === "flashcards_summary" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div className="dashboard-card" style={{ padding: "48px", maxWidth: "500px", width: "100%", textAlign: "center" }}>
                        <div style={{ fontSize: "64px", marginBottom: "24px" }}>
                            {score >= 8 ? "🏆" : score >= 5 ? "👍" : "📚"}
                        </div>
                        <h2 style={{ ...typography.display, fontSize: "32px", marginBottom: "8px", color: "#FFFFFF" }}>
                            Review Complete!
                        </h2>
                        <p style={{ ...typography.text, fontSize: "18px", color: "#9CA3AF", marginBottom: "32px" }}>
                            You scored <span style={{ color: "#8B5CF6", fontWeight: "700" }}>{score} / {flashcards.length}</span>
                        </p>

                        <div style={{ display: "grid", gap: "12px" }}>
                            <button
                                onClick={() => {
                                    setMode("flashcards_setup");
                                    setScore(0);
                                    setCurrentCardIndex(0);
                                    setFlashcards([]);
                                }}
                                style={{
                                    padding: "16px",
                                    borderRadius: "12px",
                                    backgroundColor: "#8B5CF6",
                                    color: "#FFFFFF",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Start Another Review
                            </button>
                            <button
                                onClick={() => {
                                    setMode("chat");
                                    setScore(0);
                                    setCurrentCardIndex(0);
                                    setFlashcards([]);
                                }}
                                style={{
                                    padding: "16px",
                                    borderRadius: "12px",
                                    backgroundColor: "transparent",
                                    border: "1px solid #374151",
                                    color: "#9CA3AF",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                Back to Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <GenerationLoader 
                isVisible={generateFlashcards.isPending} 
                label="Generating Questions..." 
                subLabel="AI is extracting key concepts from your topics..." 
            />
        </div>
    );
}
