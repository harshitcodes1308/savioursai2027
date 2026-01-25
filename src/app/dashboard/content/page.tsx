"use client";

import { useState } from "react";
import { GenerationLoader } from "@/components/ui/GenerationLoader";

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
    const [uploadType, setUploadType] = useState<"text" | "file">("text");
    const [syllabusText, setSyllabusText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if ((uploadType === "text" && syllabusText) || (uploadType === "file" && selectedFile)) {
            setIsGenerating(true);
            // Simulate AI processing time
            setTimeout(() => {
                setIsGenerating(false);
                if (uploadType === "text") {
                    console.log("Uploading text syllabus:", syllabusText);
                    alert("Syllabus processed successfully! (Mock)");
                } else {
                    console.log("Uploading file:", selectedFile?.name);
                    alert("File processed successfully! (Mock)");
                }
            }, 3000);
        }
    };

    const libraryItems = [
        { id: 1, subject: "Mathematics", chapters: 12, uploaded: "2026-01-10", icon: "🔢" },
        { id: 2, subject: "Science", chapters: 15, uploaded: "2026-01-08", icon: "🔬" },
        { id: 3, subject: "English", chapters: 10, uploaded: "2026-01-05", icon: "📚" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                    Content Hub
                </h1>
                <p className="text-gray-400">
                    Upload your syllabus or access your study materials
                </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-800">
                <button
                    onClick={() => setActiveTab("upload")}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === "upload"
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    Upload Syllabus
                </button>
                <button
                    onClick={() => setActiveTab("library")}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === "library"
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    My Library
                </button>
            </div>

            {/* Upload Tab */}
            {activeTab === "upload" && (
                <div className="space-y-6">
                    {/* Upload Type Selection */}
                    <div className="dashboard-card" style={{ padding: "24px" }}>
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Choose Upload Method
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setUploadType("text")}
                                className={`p-6 rounded-xl border-2 transition-all ${uploadType === "text"
                                    ? "border-primary bg-primary/10"
                                    : "border-gray-700 hover:border-gray-600 bg-gray-900"
                                    }`}
                            >
                                <div className="text-3xl mb-2">📝</div>
                                <div className="font-medium text-white mb-1">Paste Text</div>
                                <div className="text-sm text-gray-400">Copy and paste your syllabus</div>
                            </button>

                            <button
                                onClick={() => setUploadType("file")}
                                className={`p-6 rounded-xl border-2 transition-all ${uploadType === "file"
                                    ? "border-primary bg-primary/10"
                                    : "border-gray-700 hover:border-gray-600 bg-gray-900"
                                    }`}
                            >
                                <div className="text-3xl mb-2">📄</div>
                                <div className="font-medium text-white mb-1">Upload File</div>
                                <div className="text-sm text-gray-400">PDF, DOC, or TXT</div>
                            </button>
                        </div>
                    </div>

                    {/* Text Input */}
                    {uploadType === "text" && (
                        <div className="dashboard-card" style={{ padding: "24px" }}>
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Paste Your Syllabus
                            </h3>
                            <textarea
                                value={syllabusText}
                                onChange={(e) => setSyllabusText(e.target.value)}
                                placeholder="Paste your ICSE syllabus here...&#10;&#10;Example:&#10;Mathematics&#10;  Chapter 1: Algebra&#10;  Chapter 2: Geometry&#10;..."
                                className="w-full h-64 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleUpload}
                                    disabled={!syllabusText}
                                    className="px-6 py-3 rounded-lg bg-primary hover:bg-purple-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Process with AI ✨
                                </button>
                            </div>
                        </div>
                    )}

                    {/* File Upload */}
                    {uploadType === "file" && (
                        <div className="dashboard-card" style={{ padding: "24px" }}>
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Upload Syllabus File
                            </h3>
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-primary transition-all bg-gray-900">
                                <div className="text-5xl mb-4">📁</div>
                                <p className="text-white font-medium mb-2">
                                    Drop your file here or click to browse
                                </p>
                                <p className="text-sm text-gray-400 mb-4">
                                    Supports PDF, DOC, DOCX, TXT (Max 10MB)
                                </p>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-block px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium cursor-pointer transition-all"
                                >
                                    Choose File
                                </label>
                            </div>
                            {selectedFile && (
                                <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-green-300">{selectedFile.name}</p>
                                            <p className="text-sm text-green-400">
                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleUpload}
                                            className="px-6 py-2 rounded-lg bg-primary hover:bg-purple-500 text-white font-semibold transition-all"
                                        >
                                            Upload ✨
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI Processing Info */}
                    <div className="dashboard-card" style={{
                        padding: "24px",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderColor: "rgba(59, 130, 246, 0.3)"
                    }}>
                        <div className="flex items-start space-x-3">
                            <div className="text-2xl">🤖</div>
                            <div>
                                <h4 className="font-semibold text-blue-300 mb-2">
                                    AI-Powered Processing
                                </h4>
                                <p className="text-sm text-blue-400 mb-2">Our AI will automatically:</p>
                                <ul className="space-y-1 text-sm text-blue-400">
                                    <li>• Extract subjects and chapters</li>
                                    <li>• Create personalized study schedules</li>
                                    <li>• Generate topic-wise notes and summaries</li>
                                    <li>• Suggest practice questions and tests</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Library Tab */}
            {activeTab === "library" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {libraryItems.map((item) => (
                            <div
                                key={item.id}
                                className="dashboard-card"
                                style={{ padding: "24px", cursor: "pointer" }}
                            >
                                <div className="text-4xl mb-3">{item.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {item.subject}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    {item.chapters} chapters • Uploaded {item.uploaded}
                                </p>
                                <button className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all">
                                    View Content
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <GenerationLoader 
                isVisible={isGenerating} 
                label="Processing Content..." 
                subLabel="AI is analyzing your syllabus structure..." 
            />
        </div>
    );
}
