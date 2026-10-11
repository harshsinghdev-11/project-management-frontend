"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Paperclip } from "@/components/stationery/paperclip";
import { Pushpin } from "@/components/stationery/pushpin";
import { WaxSeal } from "@/components/stationery/wax-seal";

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="relative rounded-3xl border border-[#DDD3C4] bg-[#FFFFFF] p-8 sm:p-14 text-center paper-shadow-lg overflow-hidden">
        {/* Stationery Corner Accents */}
        <div className="absolute -top-3 left-10 z-10 hidden sm:block">
          <Paperclip color="brass" size="md" rotation={-10} />
        </div>
        <div className="absolute -top-3 right-10 z-10 hidden sm:block">
          <Pushpin color="red" size="md" />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-5">
            <WaxSeal text="PC" size="lg" />
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-black text-[#1E2229] tracking-tight leading-tight mb-4">
            Your desk is ready. Reclaim your team&apos;s focus.
          </h2>

          <p className="text-sm sm:text-base text-[#5E6B7C] font-sans leading-relaxed mb-8 max-w-lg mx-auto">
            Stop fighting with over-engineered project tools. Open a clean, tactile workspace and start shipping with physical clarity today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-sans font-semibold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-[0_2px_8px_rgba(200,100,70,0.22)] hover:shadow-[0_4px_16px_rgba(200,100,70,0.32)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border border-[#9A371F] transition cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-sans font-semibold text-[#4E4133] bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-[#DDD3C4] shadow-2xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition cursor-pointer"
            >
              Sign In to Existing Project
            </Link>
          </div>

          <p className="text-xs text-[#8C7D6B] font-mono mt-6">
            Free forever for teams · Instant access · No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
