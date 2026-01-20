"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";

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
    const searchParams = useSearchParams();
    const initialTopic = searchParams.get("topic");
    const initialSubject = searchParams.get("subject");

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your ICSE AI tutor. Ask me anything about your subjects, doubts, or study strategies!",
        },
    ]);
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

    // If initial query params present, switch to flashcard mode (but don't auto-fill)
    useEffect(() => {
        if (initialTopic || initialSubject) {
            setMode("flashcards_setup");
            if (initialSubject) setSubject(initialSubject);
        }
    }, [initialTopic, initialSubject]);

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
        <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", backgroundColor: "#030303" }}>
            {/* Header */}
            <div className="dashboard-card" style={{
                padding: "20px 32px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div>
                    <h1 style={{ ...typography.display, fontSize: "24px", fontWeight: 700, margin: 0 }}>
                        {mode === "chat" ? "🤖 AI Tutor" : "⚡ Flashcard Review"}
                    </h1>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {mode === "chat" && (
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{
                                ...typography.text,
                                padding: "6px 12px",
                                borderRadius: "8px",
                                backgroundColor: "#1F1F22",
                                border: "1px solid #374151",
                                color: "#FFFFFF",
                                fontSize: "13px",
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
                            ...typography.text,
                            padding: "8px 16px",
                            backgroundColor: mode === "chat" ? "#8B5CF6" : "#374151",
                            color: "#FFFFFF",
                            borderRadius: "8px",
                            border: "none",
                            fontWeight: 600,
                            fontSize: "13px",
                            cursor: "pointer"
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
                            padding: "24px",
                            marginBottom: "16px",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
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
                                            maxWidth: "70%",
                                            padding: "12px 16px",
                                            borderRadius: "12px",
                                            backgroundColor: message.role === "user" ? "#8B5CF6" : "#1A1A1D",
                                            color: "#FFFFFF",
                                        }}
                                    >
                                        {message.role === "assistant" && (
                                            <div style={{ fontSize: "18px", marginBottom: "8px" }}>🤖</div>
                                        )}
                                        <div style={{ fontSize: "14px", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                                            {message.content}
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
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question..."
                            disabled={askMutation.isPending}
                            style={{
                                flex: 1,
                                padding: "12px 16px",
                                borderRadius: "12px",
                                backgroundColor: "#1A1A1D",
                                border: "1px solid #374151",
                                color: "#FFFFFF",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={askMutation.isPending || !input.trim()}
                            style={{
                                padding: "12px 24px",
                                borderRadius: "12px",
                                backgroundColor: "#8B5CF6",
                                color: "#FFFFFF",
                                fontSize: "14px",
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer",
                                opacity: askMutation.isPending ? 0.7 : 1
                            }}
                        >
                            Send
                        </button>
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
                            {flashcards[currentCardIndex].options.map((option, idx) => {
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
        </div>
    );
}
