"use client";

import { useState } from "react";

export default function NotesPage() {
    const [activeView, setActiveView] = useState<"list" | "create">("list");
    const [noteContent, setNoteContent] = useState("");
    const [noteTitle, setNoteTitle] = useState("");

    const notes = [
        {
            id: 1,
            title: "Quadratic Equations - Key Formulas",
            subject: "Mathematics",
            preview: "ax² + bx + c = 0, discriminant = b² - 4ac...",
            date: "2026-01-15",
            tags: ["formulas", "algebra"],
        },
        {
            id: 2,
            title: "Newton's Laws of Motion",
            subject: "Physics",
            preview: "1st Law: Inertia, 2nd Law: F=ma, 3rd Law: Action-Reaction...",
            date: "2026-01-14",
            tags: ["physics", "mechanics"],
        },
        {
            id: 3,
            title: "Photosynthesis Process",
            subject: "Biology",
            preview: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂...",
            date: "2026-01-13",
            tags: ["biology", "plants"],
        },
    ];

    const handleSaveNote = () => {
        console.log("Saving note:", { title: noteTitle, content: noteContent });
        alert("Note saved! (Mock)");
        setActiveView("list");
        setNoteTitle("");
        setNoteContent("");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">My Notes</h1>
                    <p className="text-gray-400">
                        Create, organize, and AI-enhance your study notes
                    </p>
                </div>
                {activeView === "list" && (
                    <button
                        onClick={() => setActiveView("create")}
                        className="px-6 py-3 rounded-lg bg-primary hover:bg-purple-500 text-white font-semibold transition-all"
                    >
                        + New Note
                    </button>
                )}
            </div>

            {/* List View */}
            {activeView === "list" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="dashboard-card"
                            style={{ padding: "24px", cursor: "pointer" }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
                                    {note.subject}
                                </span>
                                <button className="text-gray-400 hover:text-white">⋮</button>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {note.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                {note.preview}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {note.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 rounded bg-gray-900 text-gray-300 text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">{note.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit View */}
            {activeView === "create" && (
                <div className="space-y-6">
                    <div className="dashboard-card" style={{ padding: "24px" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-white">
                                Create New Note
                            </h2>
                            <button
                                onClick={() => setActiveView("list")}
                                className="text-gray-400 hover:text-white transition-all"
                            >
                                ← Back to Notes
                            </button>
                        </div>

                        {/* Title */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="Note title..."
                                className="w-full text-2xl font-semibold rounded-xl border-0 bg-transparent px-0 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-0"
                            />
                        </div>

                        {/* Content Editor */}
                        <div className="border-t border-gray-700 pt-4">
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Start writing your notes...&#10;&#10;You can use AI to:&#10;• Simplify complex topics&#10;• Generate summaries&#10;• Create flashcards"
                                className="w-full h-96 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex gap-2">
                                <button className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 hover:border-primary text-white font-medium transition-all">
                                    🤖 Simplify with AI
                                </button>
                                <button className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 hover:border-primary text-white font-medium transition-all">
                                    📇 Generate Flashcards
                                </button>
                            </div>
                            <button
                                onClick={handleSaveNote}
                                disabled={!noteTitle || !noteContent}
                                className="px-6 py-3 rounded-lg bg-primary hover:bg-purple-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Note
                            </button>
                        </div>
                    </div>

                    {/* AI Assistant */}
                    <div className="dashboard-card" style={{
                        padding: "24px",
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                        borderColor: "rgba(139, 92, 246, 0.3)"
                    }}>
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">✨</div>
                            <div>
                                <h4 className="font-semibold text-purple-300 mb-2">
                                    AI Note Assistant
                                </h4>
                                <p className="text-sm text-purple-400 mb-3">
                                    Enhance your notes with AI-powered features:
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-purple-400">
                                    <div>• Simplify complex concepts</div>
                                    <div>• Generate summaries</div>
                                    <div>• Create flashcards</div>
                                    <div>• Make revision sheets</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
