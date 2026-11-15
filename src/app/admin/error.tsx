"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return <div className="admin-page"><h1>Unable to load this view.</h1><p className="admin-footnote">Your data could not be fetched. Please try again.</p><button className="admin-button" onClick={reset} style={{ marginTop: 20 }}>Try again</button></div>;
}
