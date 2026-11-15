"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResponsive } from "@/hooks/useResponsive";
import { EbookBuyPanel } from "@/components/ebooks/EbookBuyPanel";
import { EBOOK_PREVIEW_PAGES } from "@/lib/ebook-access";
import { getEbookBySlug } from "@/data/ebooks-config";
import { AppIcon } from "@/components/ui/AppIcon";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const STORAGE_KEY = (id: string, tabIdx: number) =>
  `saviours-ebook-${id}-tab${tabIdx}-page`;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.25;

export default function EbookViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { isMobile } = useResponsive();
  const subjectId = params.subject as string;
  const ebook = getEbookBySlug(subjectId);
  const [access, setAccess] = useState<{ mode: "full" | "preview"; url: string } | null>(null);
  const [accessError, setAccessError] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const isPreview = access?.mode === "preview";

  // Ask the server for a short-lived link: full book for owners, 5-page preview otherwise.
  useEffect(() => {
    let active = true;
    fetch(`/api/ebooks/${subjectId}/access`, { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Could not open this e-book");
        return data as { mode: "full" | "preview"; url: string };
      })
      .then((data) => { if (active) setAccess(data); })
      .catch((e: Error) => { if (active) setAccessError(e.message); });
    return () => { active = false; };
  }, [subjectId]);

  const [activeTab, setActiveTab] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const [pdfError, setPdfError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);

  const viewerRef = useRef<HTMLDivElement>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePdf = ebook?.pdfs[activeTab];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem(STORAGE_KEY(subjectId, activeTab));
    if (stored) {
      const p = parseInt(stored, 10);
      if (p > 0) {
        setCurrentPage(p);
        setPageInput(String(p));
        return;
      }
    }
    setCurrentPage(1);
    setPageInput("1");
  }, [subjectId, activeTab, mounted]);

  useEffect(() => {
    if (mounted && currentPage > 0) {
      localStorage.setItem(STORAGE_KEY(subjectId, activeTab), String(currentPage));
    }
  }, [currentPage, subjectId, activeTab, mounted]);

  const switchTab = (idx: number) => {
    if (idx === activeTab) return;
    setActiveTab(idx);
    setNumPages(null);
    setPdfError(false);
  };

  const goToPage = useCallback(
    (p: number) => {
      if (!numPages) return;
      if (isPreview && p > numPages) {
        setShowPaywall(true);
        return;
      }
      const clamped = Math.max(1, Math.min(p, numPages));
      setCurrentPage(clamped);
      setPageInput(String(clamped));
    },
    [numPages, isPreview]
  );

  const zoomIn = useCallback(
    () => setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE)),
    []
  );
  const zoomOut = useCallback(
    () => setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE)),
    []
  );
  const resetZoom = useCallback(() => setScale(1.0), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          goToPage(currentPage + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          goToPage(currentPage - 1);
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "0":
          e.preventDefault();
          resetZoom();
          break;
        case "Escape":
          if (document.fullscreenElement) document.exitFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPage, goToPage, zoomIn, zoomOut, resetZoom]);

  useEffect(() => {
    if (!isFullscreen) {
      setToolbarVisible(true);
      return;
    }
    const resetTimer = () => {
      setToolbarVisible(true);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(
        () => setToolbarVisible(false),
        3000
      );
    };
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [isFullscreen]);

  if (!ebook) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div style={{ opacity: 0.4 }}><AppIcon name="book" size={42} /></div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            color: "var(--text-primary)",
          }}
        >
          Subject not found
        </p>
        <button
          onClick={() => router.push("/dashboard/ebooks")}
          className="btn-ghost"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            padding: "10px 24px",
            cursor: "pointer",
          }}
        >
          ← Back to Library
        </button>
      </div>
    );
  }

  const progressPercent = numPages ? (currentPage / numPages) * 100 : 0;
  const nextDisabled = !numPages || (!isPreview && currentPage >= numPages);
  const MOBILE_TAB_BAR = 64;
  const BOTTOM_BAR_HEIGHT = isMobile ? 58 + MOBILE_TAB_BAR : 52;

  const ToolbarButton = ({
    onClick,
    children,
    title,
    active,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title?: string;
    active?: boolean;
  }) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: active ? "var(--bg-elevated)" : "transparent",
        border: "1px solid transparent",
        borderRadius: 8,
        color: active ? "var(--accent-gold)" : "var(--text-secondary)",
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        minWidth: 36,
        height: 36,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-elevated)";
        e.currentTarget.style.color = "var(--accent-gold)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = active
          ? "var(--bg-elevated)"
          : "transparent";
        e.currentTarget.style.color = active
          ? "var(--accent-gold)"
          : "var(--text-secondary)";
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      ref={viewerRef}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: isFullscreen ? "#0a0a12" : "transparent",
        animation: mounted ? "fadeIn 0.4s ease-out" : "none",
        position: "relative",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .react-pdf__Page__canvas {
              margin: 0 auto;
              display: block !important;
            }
            .react-pdf__Page__textContent,
            .react-pdf__Page__annotations {
              margin: 0 auto;
            }
            .eb-tab:hover {
              background: var(--bg-elevated) !important;
            }
          `,
        }}
      />

      {/* Top Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "10px 12px" : "10px 20px",
          background: "rgba(13, 13, 26, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--bg-border)",
          flexShrink: 0,
          gap: 8,
          transition: "opacity 0.3s, transform 0.3s",
          opacity: toolbarVisible ? 1 : 0,
          transform: toolbarVisible ? "translateY(0)" : "translateY(-100%)",
          position: isFullscreen ? "fixed" : "relative",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Back + Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
          }}
        >
          <button
            onClick={() => router.push("/dashboard/ebooks")}
            style={{
              background: "transparent",
              border: "1px solid var(--bg-border)",
              borderRadius: 8,
              color: "var(--text-secondary)",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 14,
              flexShrink: 0,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-gold-border)";
              e.currentTarget.style.color = "var(--accent-gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--bg-border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            ←
          </button>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? 14 : 16,
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><AppIcon name="book" size={18} />{ebook.name}</span>
            </div>
            {numPages && !isMobile && (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                Page {currentPage} of {numPages}
              </div>
            )}
          </div>
        </div>

        {/* Center: Zoom Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(19, 19, 31, 0.6)",
            borderRadius: 10,
            padding: "2px 4px",
            border: "1px solid var(--bg-border)",
          }}
        >
          <ToolbarButton onClick={zoomOut} title="Zoom out (-)">
            −
          </ToolbarButton>
          <button
            onClick={resetZoom}
            title="Reset zoom (0)"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              padding: "4px 8px",
              cursor: "pointer",
              minWidth: 48,
              textAlign: "center",
            }}
          >
            {Math.round(scale * 100)}%
          </button>
          <ToolbarButton onClick={zoomIn} title="Zoom in (+)">
            +
          </ToolbarButton>
        </div>

        {/* Right: Fullscreen */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ToolbarButton onClick={toggleFullscreen} title="Toggle fullscreen">
            {isFullscreen ? "⊗" : "⊕"}
          </ToolbarButton>
        </div>
      </div>

      {isPreview && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: isMobile ? "8px 12px" : "8px 20px", background: "rgba(0,212,255,0.07)", borderBottom: "1px solid var(--accent-gold-border)", flexShrink: 0 }}>
          <AppIcon name="eye" size={15} color="var(--accent-gold)" />
          <span style={{ flex: 1, minWidth: 180, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)" }}>
            Free preview: first {EBOOK_PREVIEW_PAGES} pages of {ebook.name}.
          </span>
          <button onClick={() => setShowPaywall(true)} style={{ cursor: "pointer", border: "1px solid var(--accent-gold-border)", borderRadius: 8, padding: "6px 12px", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700 }}>
            Unlock full book
          </button>
        </div>
      )}

      {/* Tabs — only show if more than 1 PDF */}
      {ebook.pdfs.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: isMobile ? "8px 12px" : "8px 20px",
            background: "rgba(13, 13, 26, 0.6)",
            borderBottom: "1px solid var(--bg-border)",
            flexShrink: 0,
            overflowX: "auto",
          }}
        >
          {ebook.pdfs.map((pdf, idx) => (
            <button
              key={idx}
              className="eb-tab"
              onClick={() => switchTab(idx)}
              style={{
                background:
                  idx === activeTab ? `${ebook.color}18` : "transparent",
                border:
                  idx === activeTab
                    ? `1px solid ${ebook.color}40`
                    : "1px solid transparent",
                borderRadius: 8,
                padding: isMobile ? "6px 14px" : "7px 18px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: idx === activeTab ? 600 : 400,
                color: idx === activeTab ? ebook.color : "var(--text-muted)",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {pdf.label}
            </button>
          ))}
        </div>
      )}

      {/* PDF Viewer — flex:1 with bottom padding for nav bar */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          paddingTop: isMobile ? 16 : 24,
          paddingLeft: isMobile ? 8 : 16,
          paddingRight: isMobile ? 8 : 16,
          paddingBottom: BOTTOM_BAR_HEIGHT + 24,
          background: isFullscreen
            ? "radial-gradient(ellipse at center, rgba(0,212,255,0.03) 0%, transparent 70%)"
            : "none",
          marginTop: isFullscreen && toolbarVisible ? 56 : 0,
          position: "relative",
        }}
      >
        {pdfError || accessError ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: 40,
            }}
          >
            <AppIcon name="alert" size={42} color="var(--text-muted)" />
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                color: "var(--text-primary)",
              }}
            >
              Failed to load PDF
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              {accessError || "Please check your connection and try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-gold"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                padding: "10px 28px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        ) : !access ? (
          <div style={{ padding: 60, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>Opening {ebook.name}…</div>
        ) : (
          <Document
            key={`${subjectId}-${activeTab}-${access.mode}`}
            file={access.url}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              setPdfError(false);
              if (currentPage > n) {
                setCurrentPage(n);
                setPageInput(String(n));
              }
            }}
            onLoadError={() => setPdfError(true)}
            loading={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  padding: 60,
                }}
              >
                <div
                  style={{
                    width: isMobile ? 200 : 400,
                    height: isMobile ? 280 : 560,
                    borderRadius: 12,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-border)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                  }}
                >
                  Loading {activePdf?.label}...
                </div>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              width={isMobile ? window.innerWidth - 32 : undefined}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div
                  style={{
                    width: isMobile ? "100%" : 600,
                    height: 800,
                    borderRadius: 8,
                    background: "var(--bg-surface)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              }
            />
          </Document>
        )}
        {showPaywall && (
          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: isMobile ? "24px 12px" : "40px 20px", background: "rgba(9,9,14,.55)", backdropFilter: "blur(10px)", overflowY: "auto" }}>
            <div style={{ width: "100%", maxWidth: 640, padding: isMobile ? 18 : 24, borderRadius: 18, background: "rgba(14,14,24,.94)", border: "1px solid var(--accent-gold-border)", boxShadow: "0 18px 50px rgba(0,0,0,.45)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <div style={{ color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>End of free preview</div>
                <button onClick={() => setShowPaywall(false)} aria-label="Close" style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><AppIcon name="x" size={18} /></button>
              </div>
              <h2 style={{ margin: "0 0 6px", color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 26, letterSpacing: "-.02em" }}>Keep reading {ebook.name}</h2>
              <p style={{ margin: "0 0 18px", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.6 }}>You&apos;ve read the first {EBOOK_PREVIEW_PAGES} pages. Unlock the full Sidekick to read every chapter.</p>
              <EbookBuyPanel ebookId={ebook.id} ebookName={ebook.name} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar — fixed above mobile tab bar */}
      <div
        style={{
          position: "fixed",
          bottom: isMobile ? 64 : 0,
          left: isMobile ? 0 : 240,
          right: 0,
          zIndex: 140,
          transition: "opacity 0.3s, transform 0.3s",
          opacity: toolbarVisible ? 1 : 0,
          transform: toolbarVisible ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            height: 3,
            background: "var(--bg-border)",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${ebook.color}, var(--accent-gold))`,
              transition: "width 0.3s ease",
              borderRadius: "0 2px 2px 0",
              boxShadow: `0 0 8px ${ebook.color}40`,
            }}
          />
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 10 : 20,
            padding: isMobile ? "10px 12px" : "10px 24px",
            background: "rgba(13, 13, 26, 0.95)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid var(--bg-border)",
          }}
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              background: "transparent",
              border: "1px solid var(--bg-border)",
              borderRadius: 10,
              color:
                currentPage <= 1
                  ? "var(--text-muted)"
                  : "var(--text-secondary)",
              padding: isMobile ? "8px 14px" : "8px 20px",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
              fontSize: isMobile ? 13 : 14,
              opacity: currentPage <= 1 ? 0.4 : 1,
              transition: "all 0.2s",
            }}
          >
            ← Prev
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setPageInput(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const p = parseInt(pageInput, 10);
                  if (!isNaN(p)) goToPage(p);
                }
              }}
              onBlur={() => {
                const p = parseInt(pageInput, 10);
                if (!isNaN(p)) goToPage(p);
                else setPageInput(String(currentPage));
              }}
              style={{
                width: 44,
                textAlign: "center",
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                padding: "6px 4px",
                outline: "none",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              / {numPages || "—"}{isPreview ? " · preview" : ""}
            </span>
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={nextDisabled}
            style={{
              background: "transparent",
              border: "1px solid var(--bg-border)",
              borderRadius: 10,
              color:
                nextDisabled
                  ? "var(--text-muted)"
                  : "var(--text-secondary)",
              padding: isMobile ? "8px 14px" : "8px 20px",
              cursor:
                nextDisabled
                  ? "not-allowed"
                  : "pointer",
              fontFamily: "var(--font-body)",
              fontSize: isMobile ? 13 : 14,
              opacity: nextDisabled ? 0.4 : 1,
              transition: "all 0.2s",
            }}
          >
            {isPreview && numPages && currentPage >= numPages ? "Unlock full book →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
