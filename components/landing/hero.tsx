"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { ArrowRight, Sparkles, LayoutDashboard } from "lucide-react";
import { Paperclip } from "@/components/stationery/paperclip";
import { WashiTape } from "@/components/stationery/washi-tape";
import { WaxSeal } from "@/components/stationery/wax-seal";

export function LandingHero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
      {/* Top Value Pill */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F5ECE0] border border-[#DFD1BE] text-[#69543E] text-[11px] font-mono font-bold tracking-wider uppercase shadow-2xs mb-7 select-none">
        <WaxSeal text="PC" size="sm" />
        <span>Tactile Project Management</span>
      </div>

      {/* Single H1 For The Page */}
      <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-black text-[#1A1612] tracking-[-0.03em] leading-[1.08] mb-6 max-w-4xl mx-auto">
        Project management crafted with the tactile clarity of paper.
      </h1>

      {/* Editorial Sub-copy */}
      <p className="text-base sm:text-lg md:text-[19px] text-[#554D43] font-sans font-normal leading-relaxed max-w-2xl mx-auto mb-10">
        Escape the cognitive noise of bloated software. Organize sprints, align collaborators, and track roadmaps using the focus and simplicity of physical stationery.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
        {isAuthenticated ? (
          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-[0_2px_8px_rgba(200,100,70,0.22)] hover:shadow-[0_4px_16px_rgba(200,100,70,0.32)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border border-[#9A371F] transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Open Your Projects Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-[0_2px_8px_rgba(200,100,70,0.22)] hover:shadow-[0_4px_16px_rgba(200,100,70,0.32)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border border-[#9A371F] transition-all cursor-pointer"
            >
              <span>Start Managing Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#live-desk"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-editorial font-bold text-[#4E4133] bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-[#DDD3C4] shadow-2xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer"
            >
              Try Interactive Demo ↓
            </a>
          </>
        )}
      </div>

      {/* Hand-Stamped Trust Badge with Brass Paperclip */}
      <div className="inline-flex relative items-center gap-2 px-4 py-2 bg-[#FFFFFF] rounded-xl border border-[#DDD3C4] paper-shadow-sm text-xs font-mono text-[#6E6152] select-none">
        <div className="absolute -top-3.5 -right-2 z-10">
          <Paperclip color="brass" size="sm" rotation={12} />
        </div>
        <span className="text-[#4E7545] font-bold">✓</span>
        <span>Free forever for teams</span>
        <span className="text-[#D5C7B5]">·</span>
        <span>No credit card required</span>
        <span className="text-[#D5C7B5]">·</span>
        <span>Instant 10s setup</span>
      </div>
    </section>
  );
}
