"use client";

import dynamic from "next/dynamic";

// react-pdf (pdfjs) touches browser-only globals like DOMMatrix at import time,
// which don't exist during server prerendering. This is a STATIC route, so Next
// would otherwise try to prerender it on the server and crash the build with
// "ReferenceError: DOMMatrix is not defined". Loading the viewer with ssr:false
// guarantees the react-pdf module is only ever evaluated in the browser.
// (The e-books / half-yearly viewers avoid this only because they live on
// dynamic [param] routes that Next never prerenders.)
const TrackerViewer = dynamic(() => import("./TrackerViewer"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "2px solid var(--bg-border)",
          borderTopColor: "var(--accent-gold)",
          animation: "spin360 0.8s linear infinite",
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
  ),
});

export default function TrackerPage() {
  return <TrackerViewer />;
}
