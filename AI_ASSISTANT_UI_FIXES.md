# AI Assistant UI Fixes

## Changes to Apply:

Tere are three key areas to update in `/src/app/dashboard/ai-assistant/page.tsx`:

### 1. Replace message.content rendering (around line 256):

**Find:**
```tsx
<div style={{ fontSize: "14px", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
    {message.content}
</div>
```

**Replace with:**
```tsx
<div className="markdown-content" style={{ fontSize: "14px", lineHeight: "1.5" }}>
    <ReactMarkdown>{message.content}</ReactMarkdown>
</div>
```

### 2. Add thinking indicator (after messages loop, around line 300):

**Find:**
```tsx
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
```

**Replace with:**
```tsx
                        ))}
                        {/* Thinking Indicator */}
                        {askMutation.isPending && (
                            <div style={{ display: "flex", gap: "12px", marginBot tom: "16px", padding: "16px" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>🤖</div>
                                <div style={{ backgroundColor: "#1A1A1D", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", color: "#9CA3AF", display: "flex", gap: "8px", alignItems: "center" }}>
                                    <div className="thinking-dots"><span>●</span><span>●</span><span>●</span></div>
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
```

### 3. Add file upload button (around line 304):

**Find:**
```tsx
                    <div style={{ display: "flex", gap: "12px" }}>
                        <input
                            type="text"
```

**Replace with:**
```tsx
                    <div style={{ padding: "20px", borderTop: "1px solid #1F1F22" }}>
                        {/* File Preview */}
                        {uploadedFile && (
                            <div style={{ marginBottom: "12px", padding: "12px", backgroundColor: "#1A1A1D", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
```

This adds:
- File upload button (📎)
- File preview with thumbnail
- Remove button
- Works with existing handleFileUpload function
