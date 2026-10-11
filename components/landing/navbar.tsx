"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { WaxSeal } from "@/components/stationery/wax-seal";
import { ArrowRight, Menu, X, LayoutDashboard } from "lucide-react";

export function LandingNavbar() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E7DDCE] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <WaxSeal text="PC" size="md" />
          <div className="flex flex-col">
            <span className="font-editorial text-lg font-bold text-[#1E2229] group-hover:text-[#A83820] transition leading-tight">
              Project Camp
            </span>
            <span className="font-mono text-[10px] text-[#7C6C57] tracking-widest uppercase">
              Project Workspace
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-sans font-medium text-[#4A4036] tracking-[-0.01em]">
          <a
            href="#live-desk"
            className="hover:text-[#C86446] transition py-1"
          >
            Live Demo
          </a>
          <a
            href="#features"
            className="hover:text-[#C86446] transition py-1"
          >
            Features
          </a>
          <a
            href="#contrast"
            className="hover:text-[#C86446] transition py-1"
          >
            Why Tactile
          </a>
          <a
            href="#workflow"
            className="hover:text-[#C86446] transition py-1"
          >
            How It Works
          </a>
        </nav>

        {/* Auth CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-semibold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-[0_1px_4px_rgba(200,100,70,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border border-[#9A371F] transition cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Go to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-[#5C4F3F] hover:text-[#1E2229] hover:bg-[#EFE8DC] transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-sans font-semibold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-[0_1px_4px_rgba(200,100,70,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border border-[#9A371F] transition cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-[#5C4F3F] hover:bg-[#EFE8DC] transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#E7DDCE] bg-[#FAF7F0] px-4 py-4 space-y-3 animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-2 text-sm font-editorial font-bold text-[#5C4F3F]">
            <a
              href="#live-desk"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC]"
            >
              Live Demo
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC]"
            >
              Features
            </a>
            <a
              href="#contrast"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC]"
            >
              Why Tactile
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC]"
            >
              How It Works
            </a>
          </nav>

          <div className="pt-2 border-t border-[#DDD3C4] flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                href="/projects"
                className="w-full text-center py-2.5 rounded-xl text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-sm border border-[#9A371F]"
              >
                Go to Workspace ({user?.username})
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center py-2 rounded-xl text-xs font-editorial font-bold text-[#5C4F3F] bg-[#FFFFFF] border border-[#DDD3C4]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 rounded-xl text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-sm border border-[#9A371F]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
