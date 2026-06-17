"use client";

import "./landing.css";
import SmoothScrollProvider from "@/components/landing/SmoothScrollProvider";
import CustomCursor from "@/components/landing/CustomCursor";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import TractionStats from "@/components/landing/TractionStats";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import ProductPreview from "@/components/landing/ProductPreview";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const MARQUEE_SUBJECTS = [
  { label: "Mathematics", color: "#3B82F6" },
  { label: "Physics", color: "#F59E0B" },
  { label: "Chemistry", color: "#00D4FF" },
  { label: "Biology", color: "#22c55e" },
  { label: "History & Civics", color: "#FB923C" },
  { label: "Geography", color: "#14B8A6" },
  { label: "English", color: "#A78BFA" },
  { label: "Computer Applications", color: "#F97316" },
];

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <div className="sa-grid-bg" aria-hidden="true" />
      <main style={{ background: "var(--bg-base)", position: "relative", overflowX: "hidden" }}>
        <Nav />
        <Hero />
        <FeaturesGrid />
        <TractionStats />
        <Marquee items={MARQUEE_SUBJECTS} reverse />
        <ProductPreview />
        <Testimonials />
        <Marquee items={MARQUEE_SUBJECTS} />
        <Pricing />
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
