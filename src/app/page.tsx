import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "Saviours AI — Your AI-powered academic OS for ICSE success",
  description:
    "Nine AI-powered tools built end to end for the ICSE Class 10 syllabus. Doubt solver, smart planner, PYQ tests, focus mode and more. Start free.",
  openGraph: {
    title: "Saviours AI — Your AI-powered academic OS for ICSE success",
    description:
      "Nine AI-powered tools built end to end for the ICSE Class 10 syllabus. Start free.",
    url: "https://saviours.pro",
    siteName: "Saviours AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saviours AI — Your AI-powered academic OS for ICSE success",
    description:
      "Nine AI-powered tools built end to end for the ICSE Class 10 syllabus. Start free.",
  },
};

/**
 * Public landing page at `/`.
 *
 * The middleware redirects authenticated users away before this renders:
 *   - onboarded   → /dashboard
 *   - mid-onboard → /onboarding
 * So this only ever reaches logged-out visitors. No client-side redirect,
 * no flash of landing for returning users.
 */
export default function HomePage() {
  return <LandingPage />;
}
