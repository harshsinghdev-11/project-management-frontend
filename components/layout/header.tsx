"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface HeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export function Header({ breadcrumbs = [], actions }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header
      className="h-14 sm:h-16 px-3.5 sm:px-6 border-b border-[#DDD3C4] bg-[#F9F6F0]/95 backdrop-blur-sm flex items-center justify-between shrink-0 select-none z-10 gap-2"
      style={{
        boxShadow: "0 1px 4px rgba(45, 35, 20, 0.04)",
      }}
    >
      {/* Breadcrumb Bookmark */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#6A788A] min-w-0 overflow-hidden">
        <Link
          href="/projects"
          className="hover:text-[#1E2229] transition font-bold font-editorial text-xs sm:text-sm text-[#4E4133] shrink-0"
        >
          Projects
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span className="text-[#A49682] font-mono text-xs sm:text-sm shrink-0">/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-[#1E2229] transition font-medium text-[#554737] text-xs sm:text-sm truncate"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[#1E2229] font-editorial text-xs sm:text-sm font-bold truncate max-w-[110px] xs:max-w-[160px] sm:max-w-xs">
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {actions}
      </div>
    </header>
  );
}
