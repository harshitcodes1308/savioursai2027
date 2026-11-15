"use client";

import dynamic from "next/dynamic";

// react-pdf touches browser-only APIs (DOMMatrix) at import time, so the
// reader must never render on the server.
const EbookReader = dynamic(() => import("@/components/ebooks/EbookReader"), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13 }}>
      Opening e-book…
    </div>
  ),
});

export default function EbookViewerPage() {
  return <EbookReader />;
}
