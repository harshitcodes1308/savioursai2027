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
            <div style={{
                padding: "20px 32px",
                borderBottom: "1px solid #1F1F22",
                backgroundColor: "#0E0E10",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div>
                    <h1 style={{
                        ...typography.display,
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginBottom: "4px"
                    }}>
                        🤖 AI Tutor
                    </h1>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <p style={{
                        ...typography.text,
                        color: "#9CA3AF",
                        fontSize: "14px"
                    }}>
                        Get instant help with doubts and study questions
                    </p>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{
                            ...typography.text,
                            padding: "6px 12px",
                            borderRadius: "8px",
                            backgroundColor: "#2D3748",
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
                </div>
            </div>
            {/* Chat Messages */}
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
                                    color: message.role === "user" ? "#FFFFFF" : "#FFFFFF",
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

                        {/* YouTube Video Recommendations */}
                        {message.role === "assistant" && message.videos !== undefined && (
                            <div style={{ marginTop: "12px", marginLeft: "0" }}>
                                {message.videos.length > 0 ? (
                                    <>
                                        <div style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "8px", fontWeight: "600" }}>
                                            📺 Recommended Videos:
                                        </div>
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
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = "#8B5CF6";
                                                        e.currentTarget.style.transform = "translateX(4px)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = "#374151";
                                                        e.currentTarget.style.transform = "translateX(0)";
                                                    }}
                                                >
                                                    {/* Thumbnail */}
                                                    <img
                                                        src={video.thumbnail}
                                                        alt={video.title}
                                                        style={{
                                                            width: "240px",
                                                            height: "135px",
                                                            borderRadius: "8px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    {/* Video Info */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{
                                                            fontSize: "13px",
                                                            fontWeight: "600",
                                                            color: "#FFFFFF",
                                                            marginBottom: "4px",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                        }}>
                                                            {video.title}
                                                        </div>
                                                        <div style={{
                                                            fontSize: "11px",
                                                            color: "#8B5CF6",
                                                            fontWeight: "600",
                                                        }}>
                                                            {video.channelTitle}
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{
                                        padding: "12px",
                                        backgroundColor: "#2D3748",
                                        borderRadius: "8px",
                                        border: "1px solid #374151",
                                    }}>
                                        <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
                                            📺 Video recommendations are temporarily unavailable.
                                            You can search directly on{" "}
                                            <a
                                                href="https://www.youtube.com/@ClarifyKnowledge"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "#8B5CF6", textDecoration: "underline" }}
                                            >
                                                Clarify Knowledge
                                            </a>
                                            {" "}and{" "}
                                            <a
                                                href="https://www.youtube.com/@ICSESaviours"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "#8B5CF6", textDecoration: "underline" }}
                                            >
                                                ICSE Saviours
                                            </a>
                                            {" "}channels.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {askMutation.isPending && (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div
                            style={{
                                padding: "12px 16px",
                                borderRadius: "12px",
                                backgroundColor: "#374151",
                                color: "#9CA3AF",
                            }}
                        >
                            <div style={{ fontSize: "18px", marginBottom: "8px" }}>🤖</div>
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
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
                        backgroundColor: "#2D3748",
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
                        backgroundColor: askMutation.isPending || !input.trim() ? "#1A1A1D" : "#8B5CF6",
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "none",
                        cursor: askMutation.isPending || !input.trim() ? "not-allowed" : "pointer",
                        opacity: askMutation.isPending || !input.trim() ? 0.5 : 1,
                    }}
                >
                    Send
                </button>
            </div>
        </div >
    );
}
