"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResponsive } from "@/hooks/useResponsive";
import { useDemoMode } from "@/hooks/useDemoMode";
import { HALF_YEARLY_DATA, type HalfYearlySubjectKey } from "@/data/halfYearlyData";
import { physicsQuestions } from "@/data/precision-physics";
import { mathsQuestions } from "@/data/precision-maths";
import { chemistryQuestions } from "@/data/precision-chemistry";
import { PRECISION_BIOLOGY } from "@/data/precision-biology";
import { computerQuestions } from "@/data/precision-computers";
import { calculateAnalytics, OVERTIME_GRACE_SECONDS, TIME_PER_MARK, type PrecisionQuestion, type PrecisionTestResult, type QuestionResult } from "@/data/precision-config";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PROGRESS_KEY = "half-yearly-progress";
const STEPS = ["Watch", "Read", "Test"];
const ALL_QUESTIONS: Record<string, PrecisionQuestion[]> = {
  Physics: physicsQuestions, Mathematics: mathsQuestions, Chemistry: chemistryQuestions,
  Biology: PRECISION_BIOLOGY, "Computer Applications": computerQuestions,
};
type Progress = Record<string, { step: number; completed: boolean }>;
type Video = { videoId: string; title: string; channelTitle: string; thumbnail: string };
type TestPhase = "ready" | "countdown" | "question" | "results";

const loadProgress = (): Progress => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; } };
const saveProgress = (key: string, step: number, completed = false) => { const all = loadProgress(); all[key] = { step, completed }; localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); };
const seconds = (value: number) => `${Math.floor(value / 60)}:${String(Math.max(0, value % 60)).padStart(2, "0")}`;

function StepBar({ current, compact }: { current: number; compact: boolean }) {
  return <nav aria-label="Chapter progress" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: compact ? "11px 10px" : "15px", gap: compact ? 3 : 5, background: "var(--bg-surface)", borderBottom: "1px solid var(--bg-border)", position: "sticky", top: 0, zIndex: 10, minWidth: 0 }}>
    {STEPS.map((name, index) => <div key={name} style={{ display: "flex", alignItems: "center", gap: compact ? 3 : 5, minWidth: 0 }}>{index > 0 && <div style={{ width: compact ? 16 : 28, flexShrink: 0, height: 2, background: index <= current ? "var(--accent-gold)" : "var(--bg-border)" }} />}<div style={{ whiteSpace: "nowrap", border: `1px solid ${index === current || index < current ? "var(--accent-gold-border)" : "var(--bg-border)"}`, background: index === current ? "var(--accent-gold-glow)" : "transparent", color: index <= current ? "var(--accent-gold)" : "var(--text-muted)", borderRadius: 999, padding: compact ? "5px 9px" : "5px 12px", fontFamily: "var(--font-body)", fontSize: compact ? 10 : 11, fontWeight: index === current ? 700 : 500 }}>{index < current ? "✓ " : ""}{name}</div></div>)}
  </nav>;
}

export default function HalfYearlyChapterPage() {
  const router = useRouter();
  const params = useParams();
  const { isMobile, isTablet } = useResponsive();
  const isCompact = isMobile || isTablet;
  const { isDemo } = useDemoMode();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoQuery, setVideoQuery] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const fetchedChapter = useRef<string | null>(null);
  const [pdfTab, setPdfTab] = useState<"textbook" | "questionBank">("textbook");
  const [pdfPages, setPdfPages] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(0.7);
  const [pdfError, setPdfError] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);
  const [testPhase, setTestPhase] = useState<TestPhase>("ready");
  const [countdown, setCountdown] = useState(5);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const startedAt = useRef(0);
  const [analytics, setAnalytics] = useState<PrecisionTestResult | null>(null);
  const [completed, setCompleted] = useState(false);

  const subjectKey = params.subject as HalfYearlySubjectKey;
  const chapterId = params.chapterId as string;
  const subject = HALF_YEARLY_DATA[subjectKey];
  const chapter = subject?.chapters.find(item => item.id === chapterId);
  const chapterIndex = subject?.chapters.findIndex(item => item.id === chapterId) ?? -1;
  const nextChapter = subject?.chapters[chapterIndex + 1];
  const progressKey = `${subjectKey}:${chapterId}`;
  const questions = useMemo(() => chapter?.precisionChapter && subject?.precisionSubject ? (ALL_QUESTIONS[subject.precisionSubject] || []).filter(question => question.chapter === chapter.precisionChapter) : [], [chapter?.precisionChapter, subject?.precisionSubject]);
  const availablePdfs = chapter ? (["textbook", "questionBank"] as const).filter(tab => chapter.ebookPdfs[tab]) : [];
  const activePdf = chapter?.ebookPdfs[pdfTab] || chapter?.ebookPdfs.textbook || null;
  const demoTestLocked = isDemo && chapterIndex > 0;

  useEffect(() => {
    setMounted(true);
    const saved = loadProgress()[progressKey];
    if (saved) setStep(saved.completed ? 2 : Math.max(0, saved.step - 1));
    const pageKey = `half-yearly-pdf-${subjectKey}-${chapterId}-${pdfTab}`;
    const persistedPage = Number(localStorage.getItem(pageKey));
    if (persistedPage > 0) setPdfPage(persistedPage);
  }, [progressKey, subjectKey, chapterId, pdfTab]);

  const searchVideos = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setVideoLoading(true); setVideoError("");
    try {
      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(query)}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Search failed");
      const next = body.videos || [];
      setVideos(next); setActiveVideo(next[0]?.videoId || null);
    } catch (error) { setVideoError(error instanceof Error ? error.message : "Unable to search YouTube right now."); }
    finally { setVideoLoading(false); }
  }, []);

  useEffect(() => {
    if (!chapter || !mounted || step !== 0 || fetchedChapter.current === chapter.id) return;
    fetchedChapter.current = chapter.id;
    setVideoQuery(chapter.youtubeQuery);
    void searchVideos(chapter.youtubeQuery);
  }, [chapter, mounted, searchVideos, step]);

  useEffect(() => {
    if (testPhase !== "countdown") return;
    if (countdown <= 0) { setTestPhase("question"); startedAt.current = Date.now(); setTimeLeft((TIME_PER_MARK[questions[0]?.marks] || 60) + OVERTIME_GRACE_SECONDS); return; }
    const timer = window.setTimeout(() => setCountdown(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, questions, testPhase]);

  const submitCurrent = useCallback(() => {
    const current = questions[questionIndex];
    if (!current || !chapter || !subject) return;
    const elapsed = Math.min((TIME_PER_MARK[current.marks] || 60) + OVERTIME_GRACE_SECONDS, Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)));
    const selected = answers[questionIndex] ?? null;
    const record: QuestionResult = { questionId: current.id, chapter: current.chapter, year: current.year, marks: current.marks, allottedTime: TIME_PER_MARK[current.marks] || 60, actualTimeTaken: elapsed, timeDeviation: elapsed - (TIME_PER_MARK[current.marks] || 60), isCorrect: selected === current.correctAnswer, marksEarned: selected === current.correctAnswer ? current.marks : 0, selectedAnswer: selected };
    const updatedTimes = { ...questionTimes, [questionIndex]: elapsed };
    setQuestionTimes(updatedTimes);
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(value => value + 1); startedAt.current = Date.now();
      const next = questions[questionIndex + 1]; setTimeLeft((TIME_PER_MARK[next.marks] || 60) + OVERTIME_GRACE_SECONDS);
      return;
    }
    const results = questions.map((question, index) => {
      if (index === questionIndex) return record;
      const answer = answers[index] ?? null;
      const taken = updatedTimes[index] || (TIME_PER_MARK[question.marks] || 60);
      const allowed = TIME_PER_MARK[question.marks] || 60;
      return { questionId: question.id, chapter: question.chapter, year: question.year, marks: question.marks, allottedTime: allowed, actualTimeTaken: taken, timeDeviation: taken - allowed, isCorrect: answer === question.correctAnswer, marksEarned: answer === question.correctAnswer ? question.marks : 0, selectedAnswer: answer };
    });
    setAnalytics(calculateAnalytics(results, subject.precisionSubject || subject.label, chapter.precisionChapter || chapter.title));
    setTestPhase("results");
  }, [answers, chapter, questionIndex, questionTimes, questions, subject]);

  useEffect(() => {
    if (testPhase !== "question") return;
    if (timeLeft <= 0) { submitCurrent(); return; }
    const timer = window.setTimeout(() => setTimeLeft(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [submitCurrent, testPhase, timeLeft]);

  if (!mounted) return <Loading />;
  if (!subject || !chapter) return <NotFound back={() => router.push("/dashboard/half-yearly")} />;

  const changeStep = (value: number) => { setStep(value); saveProgress(progressKey, value + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const complete = () => { saveProgress(progressKey, 3, true); setCompleted(true); };
  const pageKey = `half-yearly-pdf-${subjectKey}-${chapterId}-${pdfTab}`;
  const setReaderPage = (value: number) => { const next = Math.max(1, Math.min(pdfPages || 1, value)); setPdfPage(next); localStorage.setItem(pageKey, String(next)); };

  if (completed) return <Completion subject={subject.label} chapter={chapter.title} next={nextChapter?.title} onBack={() => router.push(`/dashboard/half-yearly/${subjectKey}`)} onNext={() => nextChapter ? router.push(`/dashboard/half-yearly/${subjectKey}/${nextChapter.id}`) : router.push("/dashboard/half-yearly")} />;

  const pad = isCompact ? "24px 18px 100px" : "38px 48px";
  return <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
    <StepBar current={step} compact={isCompact} />
    <div style={{ maxWidth: 980, margin: "0 auto", padding: pad, boxSizing: "border-box", minWidth: 0 }}>
      <button onClick={() => router.push(`/dashboard/half-yearly/${subjectKey}`)} style={backStyle}>← {subject.label}</button>
      <header style={{ margin: "14px 0 27px" }}><div style={{ color: subject.color, fontSize: 11, fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{subject.label} · Chapter {chapterIndex + 1}</div><h1 style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: isCompact ? 28 : 38, letterSpacing: "-.035em", margin: "8px 0 0", overflowWrap: "anywhere" }}>{chapter.title}</h1></header>

      {step === 0 && <section>
        <SectionTitle icon="▶" title="Watch the concept" detail="A tailored YouTube search is ready for this chapter." />
        <form onSubmit={event => { event.preventDefault(); void searchVideos(videoQuery); }} style={{ display: "flex", gap: 8, margin: "18px 0" }}><input value={videoQuery} onChange={event => setVideoQuery(event.target.value)} aria-label="Refine video search" placeholder="Search a lesson" style={inputStyle} /><button type="submit" style={secondaryButton}>Search</button></form>
        {videoLoading && <Info>Finding the best lessons…</Info>}{videoError && <Info>{videoError}</Info>}
        {activeVideo && <div style={{ background: "#000", border: "1px solid var(--bg-border)", borderRadius: 14, overflow: "hidden", aspectRatio: "16 / 9" }}><iframe title="Selected YouTube lesson" width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ border: 0 }} /></div>}
        {!videoLoading && !videos.length && !videoError && <Info>No videos found. Try refining the search above.</Info>}
        {videos.length > 0 && <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "repeat(2, 1fr)", gap: 10, marginTop: 14 }}>{videos.map(video => <button key={video.videoId} onClick={() => setActiveVideo(video.videoId)} style={{ minWidth: 0, cursor: "pointer", display: "flex", textAlign: "left", padding: 8, gap: 10, background: activeVideo === video.videoId ? `${subject.color}16` : "var(--bg-surface)", border: `1px solid ${activeVideo === video.videoId ? subject.color : "var(--bg-border)"}`, borderRadius: 10, color: "inherit" }}><img src={video.thumbnail} alt="" width="98" height="55" style={{ objectFit: "cover", borderRadius: 6, flexShrink: 0 }} /><span style={{ minWidth: 0 }}><span style={{ display: "block", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: 12, lineHeight: 1.35, overflowWrap: "anywhere" }}>{video.title}</span><span style={{ display: "block", color: "var(--text-muted)", fontSize: 10, marginTop: 4 }}>{video.channelTitle}</span></span></button>)}</div>}
        <ActionRow primaryLabel="Next: Read →" onPrimary={() => changeStep(1)} />
      </section>}

      {step === 1 && <section>
        <SectionTitle icon="📖" title="Read and revise" detail="Use the chapter’s textbook and question bank. Your page is remembered." />
        <div ref={readerRef} style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 14, overflow: "hidden", marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 12px", borderBottom: "1px solid var(--bg-border)" }}><div style={{ display: "flex", gap: 6 }}>{availablePdfs.map(tab => <button key={tab} onClick={() => { setPdfTab(tab); setPdfError(false); }} style={{ ...tabStyle, color: pdfTab === tab ? subject.color : "var(--text-muted)", borderColor: pdfTab === tab ? subject.color : "var(--bg-border)" }}>{tab === "textbook" ? "Textbook" : "Question Bank"}</button>)}</div><div style={{ display: "flex", gap: 5 }}><button onClick={() => setPdfZoom(value => Math.max(.7, value - .1))} style={iconButton}>−</button><span style={{ color: "var(--text-muted)", fontSize: 11, padding: "5px" }}>{Math.round(pdfZoom * 100)}%</span><button onClick={() => setPdfZoom(value => Math.min(1.6, value + .1))} style={iconButton}>+</button><button onClick={() => readerRef.current?.requestFullscreen?.()} style={iconButton} title="Full screen">⛶</button></div></div>
          <div style={{ height: isCompact ? "52vh" : 610, minHeight: isCompact ? 390 : undefined, overflow: "auto", display: "grid", placeItems: "start center", background: "#17171e", padding: 12 }}>
            {isDemo ? <div style={{ alignSelf: "center", maxWidth: 360, textAlign: "center", padding: 24, borderRadius: 14, background: "rgba(10,10,16,.82)", border: "1px solid rgba(245,158,11,.32)" }}><div style={{ fontSize: 32 }}>🔒</div><div style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 19, marginTop: 8 }}>Reading preview locked</div><p style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12, lineHeight: 1.6 }}>The live demo lets you explore the lesson videos. Create a real account to open every e-book and question bank.</p><button onClick={() => router.push("/signup?from=demo")} style={primaryButton}>Upgrade to a real account →</button></div> : activePdf && !pdfError ? <Document key={activePdf} file={activePdf} loading={<Info>Loading PDF…</Info>} onLoadSuccess={({ numPages }) => { setPdfPages(numPages); setPdfPage(current => Math.min(current, numPages)); }} onLoadError={() => setPdfError(true)}><Page pageNumber={pdfPage} scale={pdfZoom} renderTextLayer renderAnnotationLayer /></Document> : <Info>This reading material is not available yet.</Info>}
          </div>
          {activePdf && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, padding: 10, borderTop: "1px solid var(--bg-border)" }}><button disabled={pdfPage <= 1} onClick={() => setReaderPage(pdfPage - 1)} style={iconButton}>←</button><span style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 11 }}>Page {pdfPage} of {pdfPages || "…"}</span><button disabled={pdfPages === 0 || pdfPage >= pdfPages} onClick={() => setReaderPage(pdfPage + 1)} style={iconButton}>→</button></div>}
        </div>
        <ActionRow secondaryLabel="← Watch" onSecondary={() => changeStep(0)} primaryLabel="Next: Test →" onPrimary={() => changeStep(2)} />
      </section>}

      {step === 2 && <section>
        <SectionTitle icon="✏️" title="Competency test" detail={questions.length ? `${questions.length} questions · timed by marks · 30-second grace period` : "There is no competency dataset for this chapter yet."} />
        {demoTestLocked && <div style={emptyCard}><div style={{ fontSize: 30 }}>🔒</div><h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: 20 }}>Demo test limit reached</h2><p style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.6 }}>Try the first Half Yearly chapter test, then create your own account for every chapter.</p><button onClick={() => router.push("/signup?from=demo")} style={primaryButton}>Upgrade to a real account →</button></div>}
        {!demoTestLocked && !questions.length && <div style={emptyCard}><div style={{ fontSize: 30 }}>📚</div><h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: 20 }}>No test available</h2><p style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.6 }}>You’ve completed the watch-and-read pathway. Mark this chapter done when you are ready.</p><button onClick={complete} style={primaryButton}>Complete Chapter</button></div>}
        {!demoTestLocked && questions.length > 0 && testPhase === "ready" && <div style={emptyCard}><div style={{ fontSize: 30 }}>⏱</div><h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: 20 }}>Ready for a focused test?</h2><p style={{ color: "var(--text-muted)", fontSize: 13 }}>Each question uses its mark-based time allowance, then auto-submits after the grace period.</p><button onClick={() => { setCountdown(5); setQuestionIndex(0); setAnswers({}); setQuestionTimes({}); setAnalytics(null); setTestPhase("countdown"); }} style={primaryButton}>Start test</button></div>}
        {!demoTestLocked && testPhase === "countdown" && <div style={{ ...emptyCard, minHeight: 220, display: "grid", placeItems: "center" }}><div><div style={{ fontSize: 70, color: subject.color, fontFamily: "var(--font-display)" }}>{countdown}</div><p style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Starting your test…</p></div></div>}
        {!demoTestLocked && testPhase === "question" && questions[questionIndex] && <QuestionCard question={questions[questionIndex]} number={questionIndex + 1} total={questions.length} selected={answers[questionIndex]} timeLeft={timeLeft} color={subject.color} onChoose={answer => setAnswers(previous => ({ ...previous, [questionIndex]: answer }))} onSubmit={submitCurrent} />}
        {!demoTestLocked && testPhase === "results" && analytics && <Results analytics={analytics} color={subject.color} onComplete={complete} />}
        {testPhase !== "results" && <ActionRow secondaryLabel="← Read" onSecondary={() => changeStep(1)} />}
      </section>}
    </div>
  </main>;
}

function SectionTitle({ icon, title, detail }: { icon: string; title: string; detail: string }) { return <div><h2 style={{ margin: 0, color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 23 }}>{icon} {title}</h2><p style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13, margin: "7px 0 0" }}>{detail}</p></div>; }
function Info({ children }: { children: React.ReactNode }) { return <div style={{ padding: 20, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13, textAlign: "center" }}>{children}</div>; }
function ActionRow({ secondaryLabel, onSecondary, primaryLabel, onPrimary }: { secondaryLabel?: string; onSecondary?: () => void; primaryLabel?: string; onPrimary?: () => void }) { return <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 24 }}>{secondaryLabel ? <button onClick={onSecondary} style={secondaryButton}>{secondaryLabel}</button> : <span />}{primaryLabel && <button onClick={onPrimary} style={primaryButton}>{primaryLabel}</button>}</div>; }

function QuestionCard({ question, number, total, selected, timeLeft, color, onChoose, onSubmit }: { question: PrecisionQuestion; number: number; total: number; selected?: number; timeLeft: number; color: string; onChoose: (answer: number) => void; onSubmit: () => void }) { const allotted = TIME_PER_MARK[question.marks] || 60; return <div style={{ marginTop: 20, background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 16, padding: "clamp(18px, 4vw, 30px)" }}><div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 11 }}><span>QUESTION {number} / {total} · {question.marks} mark{question.marks > 1 ? "s" : ""}</span><span style={{ color: timeLeft <= OVERTIME_GRACE_SECONDS ? "#FB7185" : color, fontWeight: 700 }}>⏱ {seconds(timeLeft)}{timeLeft <= OVERTIME_GRACE_SECONDS ? " overtime" : ""}</span></div><div style={{ height: 3, background: "var(--bg-elevated)", margin: "14px 0 22px", borderRadius: 3 }}><div style={{ width: `${Math.max(0, Math.min(100, timeLeft / (allotted + OVERTIME_GRACE_SECONDS) * 100))}%`, height: "100%", background: timeLeft <= OVERTIME_GRACE_SECONDS ? "#FB7185" : color, borderRadius: 3, transition: "width 1s linear" }} /></div><p style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>{question.question}</p><div style={{ display: "grid", gap: 9, marginTop: 22 }}>{question.options.map((option, index) => <button key={option} onClick={() => onChoose(index)} style={{ textAlign: "left", cursor: "pointer", padding: "12px 14px", borderRadius: 10, color: "var(--text-primary)", background: selected === index ? `${color}18` : "var(--bg-elevated)", border: `1px solid ${selected === index ? color : "var(--bg-border)"}`, fontFamily: "var(--font-body)", fontSize: 13 }}>{String.fromCharCode(65 + index)}. {option}</button>)}</div><div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}><button onClick={onSubmit} style={primaryButton}>{number === total ? "Finish test" : "Next question →"}</button></div></div>; }

function Results({ analytics, color, onComplete }: { analytics: PrecisionTestResult; color: string; onComplete: () => void }) { return <div style={{ ...emptyCard, marginTop: 20, textAlign: "left" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 34 }}>🏁</div><h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 4 }}>Test complete</h2><p style={{ color: "var(--text-muted)", marginTop: 0, fontFamily: "var(--font-body)", fontSize: 13 }}>{analytics.classification}</p></div><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "22px 0" }}><Metric label="Accuracy" value={`${analytics.accuracy}%`} color={color} /><Metric label="Score" value={`${analytics.marksScored}/${analytics.totalMarks}`} color={color} /><Metric label="Predicted" value={`${analytics.predictedScore}%`} color={color} /></div>{analytics.insights.length > 0 && <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: 16 }}><div style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 15 }}>Insights</div><ul style={{ margin: "9px 0 0", paddingLeft: 18, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12, lineHeight: 1.65 }}>{analytics.insights.slice(0, 3).map(insight => <li key={insight}>{insight}</li>)}</ul></div>}<div style={{ textAlign: "center", marginTop: 24 }}><button onClick={onComplete} style={primaryButton}>Complete Chapter</button></div></div>; }
function Metric({ label, value, color }: { label: string; value: string; color: string }) { return <div style={{ textAlign: "center", padding: 11, background: "var(--bg-elevated)", borderRadius: 10 }}><div style={{ color, fontFamily: "var(--font-display)", fontSize: 20 }}>{value}</div><div style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 10, marginTop: 3 }}>{label}</div></div>; }
function Completion({ subject, chapter, next, onBack, onNext }: { subject: string; chapter: string; next?: string; onBack: () => void; onNext: () => void }) { return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20, textAlign: "center", background: "var(--bg-base)", overflow: "hidden", position: "relative" }}><style>{`@keyframes hy-pop { 0% { transform:scale(.5); opacity:0 } 70% { transform:scale(1.1) } 100% { transform:scale(1); opacity:1 } } @keyframes hy-confetti { from { transform:translateY(-25vh) rotate(0); opacity:1 } to { transform:translateY(105vh) rotate(540deg); opacity:0 } }`}</style>{Array.from({ length: 26 }, (_, index) => <i key={index} aria-hidden style={{ position: "absolute", left: `${(index * 37) % 100}%`, top: -18, width: 8, height: 13, borderRadius: 2, background: ["#00D4FF", "#F59E0B", "#3ECF8E", "#A78BFA"][index % 4], animation: `hy-confetti ${1.6 + (index % 5) * .18}s ease-in ${index * .06}s forwards` }} />)}<section style={{ maxWidth: 470, animation: "hy-pop .5s ease-out", position: "relative", zIndex: 1 }}><div style={{ fontSize: 70 }}>🎉</div><div style={{ color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: ".12em", fontWeight: 700, marginTop: 12 }}>CHAPTER COMPLETE</div><h1 style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 32, margin: "10px 0" }}>{chapter}</h1><p style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6 }}>Great work — {subject} is one chapter closer to half-yearly mastery.</p><div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 24 }}><button onClick={onBack} style={secondaryButton}>Back to Chapters</button><button onClick={onNext} style={primaryButton}>{next ? `Next: ${next} →` : "Finish Simulator"}</button></div></section></main>; }
function Loading() { return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-base)", color: "var(--accent-gold)", fontFamily: "var(--font-body)" }}>Loading simulator…</div>; }
function NotFound({ back }: { back: () => void }) { return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}><div style={{ textAlign: "center" }}><p>Chapter not found</p><button onClick={back} style={secondaryButton}>Back to simulator</button></div></div>; }

const backStyle = { padding: 0, border: 0, background: "none", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12 } as const;
const primaryButton = { cursor: "pointer", border: "1px solid var(--accent-gold-border)", borderRadius: 10, padding: "10px 16px", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12 } as const;
const secondaryButton = { cursor: "pointer", border: "1px solid var(--bg-border)", borderRadius: 10, padding: "10px 16px", background: "var(--bg-surface)", color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12 } as const;
const iconButton = { cursor: "pointer", border: "1px solid var(--bg-border)", borderRadius: 7, width: 27, height: 27, background: "var(--bg-elevated)", color: "var(--text-primary)" } as const;
const tabStyle = { cursor: "pointer", padding: "6px 9px", borderRadius: 7, background: "transparent", fontFamily: "var(--font-body)", fontSize: 11, borderWidth: 1, borderStyle: "solid" } as const;
const inputStyle = { flex: 1, minWidth: 0, border: "1px solid var(--bg-border)", outline: "none", borderRadius: 10, padding: "10px 12px", background: "var(--bg-surface)", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: 13 } as const;
const emptyCard = { marginTop: 20, padding: "28px", borderRadius: 16, background: "var(--bg-surface)", border: "1px solid var(--bg-border)", textAlign: "center" as const };
