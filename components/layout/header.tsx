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
      className="h-16 px-6 border-b border-[#DDD3C4] bg-[#F9F6F0]/95 backdrop-blur-sm flex items-center justify-between shrink-0 select-none z-10"
      style={{
        boxShadow: "0 1px 4px rgba(45, 35, 20, 0.04)",
      }}
    >
      {/* Breadcrumb Bookmark */}
      <nav className="flex items-center gap-2 text-xs text-[#6A788A]">
        <Link
          href="/projects"
          className="hover:text-[#1E2229] transition font-bold font-editorial text-sm text-[#4E4133]"
        >
          Projects
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span className="text-[#A49682] font-mono text-sm">/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-[#1E2229] transition font-medium text-[#554737]"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[#1E2229] font-editorial text-sm font-bold truncate max-w-xs">
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {actions}
      </div>
    </header>
  );
}
