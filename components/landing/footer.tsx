"use client";

import React from "react";
import Link from "next/link";
import { WaxSeal } from "@/components/stationery/wax-seal";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#E7DDCE] bg-[#FAF7F0] pt-12 pb-8 px-4 sm:px-6 text-xs text-[#7A6C58]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
        {/* Brand Column */}
        <div className="flex items-center gap-3">
          <WaxSeal text="PC" size="md" />
          <div>
            <span className="font-editorial text-base font-bold text-[#1E2229] block">
              Project Camp
            </span>
            <span className="font-mono text-[11px] text-[#8C7D6B] block">
              Tactile Papercraft Project Management
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-sans font-medium text-xs text-[#5C4F3F] tracking-[-0.01em]">
          <Link href="/login" className="hover:text-[#C86446] transition">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-[#A83820] transition">
            Create Account
          </Link>
          <Link href="/forgot-password" className="hover:text-[#A83820] transition">
            Reset Password
          </Link>
          <a href="#live-desk" className="hover:text-[#A83820] transition">
            Live Demo
          </a>
          <a href="#features" className="hover:text-[#A83820] transition">
            Features
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-[#DDD0BC] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#9A8B7A]">
        <div>
          © 2026 Project Camp. Handcrafted with tactile papercraft principles.
        </div>
        <div>
          Distraction-Free · Next.js · Production Grade
        </div>
      </div>
    </footer>
  );
}
