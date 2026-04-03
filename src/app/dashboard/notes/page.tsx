'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { typography } from '@/lib/typography';
import ReactMarkdown from 'react-markdown';
import '../markdown-styles.css';
import { useResponsive } from '@/hooks/useResponsive';

export default function NotesPage() {
    const { isMobile } = useResponsive();
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [rawContent, setRawContent] = useState('');
    const [subject, setSubject] = useState('');
    const [selectedNote, setSelectedNote] = useState<any>(null);
    const [viewingFlashcards, setViewingFlashcards] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const { data: notes, refetch } = trpc.content.getNotes.useQuery({});
    const createMutation = trpc.content.createNote.useMutation({
        onSuccess: () => {
            setIsCreating(false);
            setTitle('');
            setRawContent('');
            setSubject('');
            refetch();
        },
    });
    const deleteMutation = trpc.content.deleteNote.useMutation({
        onSuccess: () => {
            refetch();
            setSelectedNote(null);
        },
    });

    const handleCreate = async () => {
        if (!title.trim() || !rawContent.trim()) return;

        await createMutation.mutateAsync({
            title,
            content: rawContent,
            subject: subject,
        });
    };

    const hasNotes = notes && notes.length > 0;

    return (
        <div style={{ padding: isMobile ? '16px' : '32px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' as const, overflowX: 'hidden' as const }}>
            {/* Header */}
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
                <div>
                    <h1 style={{ ...typography.display, fontSize: '32px', marginBottom: '8px' }}>
                        📖 My Notes
                    </h1>
                    <p style={{ ...typography.text, fontSize: '16px', color: '#9CA3AF' }}>
                        AI-powered notes with auto-generated flashcards
                    </p>
                </div>
                {hasNotes && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-gold"
                        style={{
                            ...typography.text,
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: 600,
                        }}
                    >
                        + Create Note
                    </button>
                )}
            </div>

            {/* Create Modal */}
            {isCreating && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div className="dashboard-card" style={{ padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
                        <h2 style={{ ...typography.display, fontSize: '24px', marginBottom: '24px' }}>
                            ✨ Create Smart Note
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ ...typography.text, display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Newton's Laws of Motion"
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
                            <label style={{ ...typography.text, display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                Subject (optional)
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Physics"
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

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ ...typography.text, display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                Your Notes (raw text is fine!)
                            </label>
                            <textarea
                                value={rawContent}
                                onChange={(e) => setRawContent(e.target.value)}
                                placeholder="Type or paste your notes here... AI will format and refine them beautifully!"
                                rows={8}
                                style={{
                                    ...typography.text,
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#1A1A1D',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#FFF',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={handleCreate}
                                disabled={createMutation.isPending || !title.trim() || !rawContent.trim()}
                                style={{
                                    ...typography.text,
                                    padding: '12px 24px',
                                    backgroundColor: createMutation.isPending ? '#4B5563' : '#10B981',
                                    color: '#FFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: createMutation.isPending ? 'wait' : 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    flex: 1,
                                }}
                            >
                                {createMutation.isPending ? '✨ AI is refining...' : '✨ Refine & Save'}
                            </button>
                            <button
                                onClick={() => setIsCreating(false)}
                                disabled={createMutation.isPending}
                                className="btn-ghost"
                                style={{
                                    ...typography.text,
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Note Detail View */}
            {selectedNote && !viewingFlashcards && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div className="dashboard-card" style={{ padding: '32px', maxWidth: '800px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ ...typography.display, fontSize: '28px', marginBottom: '8px' }}>
                                    {selectedNote.title}
                                </h2>
                                <p style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                    {new Date(selectedNote.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedNote(null)}
                                className="btn-ghost"
                                style={{
                                    ...typography.text,
                                    padding: '8px 16px',
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="markdown-content" style={{ marginBottom: '24px' }}>
                            <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {selectedNote.flashCards && selectedNote.flashCards.length > 0 && (
                                <button
                                    onClick={() => {
                                        setViewingFlashcards(true);
                                        setCurrentCardIndex(0);
                                        setIsFlipped(false);
                                    }}
                                    className="btn-gold"
                                    style={{
                                        ...typography.text,
                                        padding: '12px 24px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                    }}
                                >
                                    🎴 Study Flashcards ({selectedNote.flashCards.length})
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (confirm('Delete this note?')) {
                                        deleteMutation.mutate({ noteId: selectedNote.id });
                                    }
                                }}
                                style={{
                                    ...typography.text,
                                    padding: '12px 24px',
                                    backgroundColor: '#EF4444',
                                    color: '#FFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                            >
                                🗑 Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Flashcard Viewer */}
            {viewingFlashcards && selectedNote && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{ maxWidth: '600px', width: '90%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h3 style={{ ...typography.display, fontSize: '24px', color: '#FFF', marginBottom: '8px' }}>
                                Flashcards: {selectedNote.title}
                            </h3>
                            <p style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF' }}>
                                Card {currentCardIndex + 1} of {selectedNote.flashCards.length}
                            </p>
                        </div>

                        <div
                            onClick={() => setIsFlipped(!isFlipped)}
                            style={{
                                backgroundColor: '#1A1A1D',
                                borderRadius: '16px',
                                padding: '48px 32px',
                                minHeight: '300px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '2px solid #00D4FF',
                                transition: 'transform 0.3s',
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#00D4FF', marginBottom: '16px' }}>
                                    {isFlipped ? 'ANSWER' : 'QUESTION'}
                                </div>
                                <div style={{ ...typography.text, fontSize: '20px', lineHeight: '1.6' }}>
                                    {isFlipped
                                        ? selectedNote.flashCards[currentCardIndex].back
                                        : selectedNote.flashCards[currentCardIndex].front
                                    }
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => {
                                    setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
                                    setIsFlipped(false);
                                }}
                                disabled={currentCardIndex === 0}
                                className="btn-gold"
                                style={{
                                    ...typography.text,
                                    padding: '12px 24px',
                                    opacity: currentCardIndex === 0 ? 0.4 : 1,
                                    cursor: currentCardIndex === 0 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setViewingFlashcards(false)}
                                className="btn-ghost"
                                style={{
                                    ...typography.text,
                                    padding: '12px 24px',
                                }}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentCardIndex(Math.min(selectedNote.flashCards.length - 1, currentCardIndex + 1));
                                    setIsFlipped(false);
                                }}
                                disabled={currentCardIndex === selectedNote.flashCards.length - 1}
                                className="btn-gold"
                                style={{
                                    ...typography.text,
                                    padding: '12px 24px',
                                    opacity: currentCardIndex === selectedNote.flashCards.length - 1 ? 0.4 : 1,
                                    cursor: currentCardIndex === selectedNote.flashCards.length - 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes Grid or Empty State */}
            {!hasNotes ? (
                <div className="dashboard-card" style={{ padding: '64px', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                    <h3 style={{ ...typography.display, fontSize: '24px', marginBottom: '12px' }}>
                        Create Your First Smart Note
                    </h3>
                    <p style={{ ...typography.text, fontSize: '16px', color: '#9CA3AF', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
                        Type your raw notes and AI will beautifully format them with headings, bullet points, and emojis. Plus, get auto-generated flashcards!
                    </p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-gold"
                        style={{
                            ...typography.text,
                            padding: '16px 32px',
                            fontSize: '18px',
                            fontWeight: 600,
                        }}
                    >
                        ✨ Create Your First Note
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: isMobile ? '16px' : '24px' }}>
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            onClick={() => setSelectedNote(note)}
                            className="dashboard-card"
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#00D4FF';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <h3 style={{ ...typography.display, fontSize: '18px', marginBottom: '8px' }}>
                                {note.title}
                            </h3>
                            <p style={{ ...typography.text, fontSize: '14px', color: '#9CA3AF', marginBottom: '12px', lineHeight: '1.4', maxHeight: '60px', overflow: 'hidden' }}>
                                {note.content.substring(0, 100)}...
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ ...typography.text, fontSize: '12px', color: '#6B7280' }}>
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                                {note.flashCards && note.flashCards.length > 0 && (
                                    <span style={{ ...typography.text, fontSize: '12px', color: '#00D4FF', fontWeight: 600 }}>
                                        🎴 {note.flashCards.length} cards
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
