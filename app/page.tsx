import React from "react";
import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { InteractiveDesk } from "@/components/landing/interactive-desk";
import { FeatureBento } from "@/components/landing/feature-bento";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { CTASection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";
import { SoftwareAppJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Project Camp — Tactile Project Management for Modern Teams",
  description:
    "Escape digital noise. Organize sprints, track roadmaps, and collaborate with team members using physical papercraft stationery design.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Project Camp — Tactile Project Management for Modern Teams",
    description:
      "Escape digital noise. Organize sprints, track roadmaps, and collaborate with team members using physical papercraft stationery design.",
    url: "/",
    siteName: "Project Camp",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Camp — Tactile Project Management for Modern Teams",
    description:
      "Escape digital noise. Organize sprints, track roadmaps, and collaborate with team members using physical papercraft stationery design.",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1E2229] flex flex-col font-sans selection:bg-[#E2D4BC] selection:text-[#1E2229]">
      {/* Schema.org Structured Data */}
      <SoftwareAppJsonLd />

      {/* Header & Sticky Nav */}
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <LandingHero />

        {/* Live Interactive Desk Section */}
        <section id="live-desk" className="pt-4 pb-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C6C57] font-bold block mb-1">
              TRY IT YOURSELF
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1E2229]">
              The Live Interactive Desk
            </h2>
            <p className="text-xs sm:text-sm text-[#6A788A] mt-1 font-sans">
              Click buttons to move sample tasks across phases and toggle the sprint roadmap banner.
            </p>
          </div>

          <InteractiveDesk />
        </section>

        {/* Feature Bento Grid */}
        <FeatureBento />

        {/* Comparison Section */}
        <ComparisonSection />

        {/* 3-Step Workflow */}
        <WorkflowSection />

        {/* Final CTA */}
        <CTASection />
      </main>

      {/* Semantic Footer */}
      <LandingFooter />
    </div>
  );
}
