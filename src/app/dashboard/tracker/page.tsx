"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResponsive } from "@/hooks/useResponsive";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_PATH = "/pdfs/tracker/tracker.pdf";
const STORAGE_KEY = "saviours-tracker-page";
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;
const ACCENT = "#00D4FF";

export default function TrackerPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const [pdfError, setPdfError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [pageDims, setPageDims] = useState<{ w: number; h: number } | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Restore last-read page
  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const p = parseInt(stored, 10);
      if (p > 0) {
        setCurrentPage(p);
        setPageInput(String(p));
      }
    }
  }, [mounted]);

  // Persist current page
  useEffect(() => {
    if (mounted && currentPage > 0) {
      localStorage.setItem(STORAGE_KEY, String(currentPage));
    }
  }, [currentPage, mounted]);

  // Measure the scroll container so we can fit the (landscape) page to it
  useEffect(() => {
    if (!mounted) return;
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted]);

  const goToPage = useCallback(
    (p: number) => {
      if (!numPages) return;
      const clamped = Math.max(1, Math.min(p, numPages));
      setCurrentPage(clamped);
      setPageInput(String(clamped));
    },
    [numPages]
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

  // Keyboard shortcuts
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

  // Auto-hide toolbar in fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setToolbarVisible(true);
      return;
    }
    const resetTimer = () => {
      setToolbarVisible(true);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => setToolbarVisible(false), 3000);
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

  const progressPercent = numPages ? (currentPage / numPages) * 100 : 0;
  const MOBILE_TAB_BAR = 64;
  const BOTTOM_BAR_HEIGHT = isMobile ? 58 + MOBILE_TAB_BAR : 52;

  // Fit the whole page inside the visible area (contain), then zoom multiplies.
  const PAD_X = isMobile ? 8 : 16;
  const PAD_TOP = isMobile ? 16 : 24;
  const PAD_BOTTOM = BOTTOM_BAR_HEIGHT + 24;
  const aspect = pageDims ? pageDims.w / pageDims.h : 16 / 9;
  const availW = Math.max(containerSize.w - PAD_X * 2, 200);
  const availH = Math.max(containerSize.h - PAD_TOP - PAD_BOTTOM, 200);
  const fitWidth = Math.min(availW, availH * aspect);
  const renderWidth = Math.round(fitWidth * scale);

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
              border-radius: 10px;
              box-shadow: 0 12px 40px rgba(0,0,0,0.45);
            }
            .react-pdf__Page__textContent,
            .react-pdf__Page__annotations {
              margin: 0 auto;
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button
            onClick={() => router.push("/dashboard")}
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
              ◈ Class 10 Tracker
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
            title="Fit to screen (0)"
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

      {/* PDF Viewer */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: PAD_TOP,
          paddingLeft: PAD_X,
          paddingRight: PAD_X,
          paddingBottom: PAD_BOTTOM,
          background: isFullscreen
            ? "radial-gradient(ellipse at center, rgba(0,212,255,0.03) 0%, transparent 70%)"
            : "none",
          marginTop: isFullscreen && toolbarVisible ? 56 : 0,
          position: "relative",
        }}
      >
        {pdfError ? (
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
            <div style={{ fontSize: 48, opacity: 0.3 }}>⚠</div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                color: "var(--text-primary)",
              }}
            >
              Failed to load the tracker
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              Make sure the file exists at{" "}
              <code
                style={{
                  background: "var(--bg-elevated)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                {PDF_PATH}
              </code>
            </p>
            <button
              onClick={() => setPdfError(false)}
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
        ) : (
          <Document
            file={PDF_PATH}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              setPdfError(false);
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
                    width: isMobile ? 260 : 480,
                    height: isMobile ? 146 : 270,
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
                  Loading your tracker...
                </div>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              width={renderWidth > 0 ? renderWidth : undefined}
              onLoadSuccess={(page) => {
                const w = page.originalWidth || page.width;
                const h = page.originalHeight || page.height;
                if (w && h) setPageDims({ w, h });
              }}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div
                  style={{
                    width: renderWidth > 0 ? renderWidth : isMobile ? 260 : 480,
                    height: (renderWidth > 0 ? renderWidth : isMobile ? 260 : 480) / aspect,
                    borderRadius: 8,
                    background: "var(--bg-surface)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              }
            />
          </Document>
        )}
      </div>

      {/* Bottom Navigation Bar */}
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
        <div style={{ height: 3, background: "var(--bg-border)", position: "relative" }}>
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${ACCENT}, var(--accent-gold))`,
              transition: "width 0.3s ease",
              borderRadius: "0 2px 2px 0",
              boxShadow: `0 0 8px ${ACCENT}40`,
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
              color: currentPage <= 1 ? "var(--text-muted)" : "var(--text-secondary)",
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
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
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
              / {numPages || "—"}
            </span>
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!numPages || currentPage >= numPages}
            style={{
              background: "transparent",
              border: "1px solid var(--bg-border)",
              borderRadius: 10,
              color:
                !numPages || currentPage >= numPages
                  ? "var(--text-muted)"
                  : "var(--text-secondary)",
              padding: isMobile ? "8px 14px" : "8px 20px",
              cursor: !numPages || currentPage >= numPages ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
              fontSize: isMobile ? 13 : 14,
              opacity: !numPages || currentPage >= numPages ? 0.4 : 1,
              transition: "all 0.2s",
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
