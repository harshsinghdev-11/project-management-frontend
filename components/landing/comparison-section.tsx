"use client";

import React from "react";
import { Check, X, Sparkles } from "lucide-react";
import { WaxSeal } from "@/components/stationery/wax-seal";
import { WashiTape } from "@/components/stationery/washi-tape";

export function ComparisonSection() {
  const comparisonItems = [
    {
      capability: "Visual Environment",
      typical: "Dark gradients, harsh neon glowing blobs, eye fatigue",
      projectCamp: "Calm warm ivory canvas (#FBF9F5) and physical cardstock",
    },
    {
      capability: "Sprint Roadmap",
      typical: "Bloated, 20-level multi-page Gantt charts nobody reads",
      projectCamp: "Collapsible 4-phase overview banner toggled in 1 click",
    },
    {
      capability: "Task Creation",
      typical: "15 mandatory fields, dropdowns, and popup dialogs",
      projectCamp: "Clean index card: title, scope, checklist, and assignee",
    },
    {
      capability: "Learning Curve",
      typical: "Weeks of certification, training videos, and onboarding",
      projectCamp: "Instant comprehension in under 30 seconds",
    },
    {
      capability: "Performance & Weight",
      typical: "Heavy client bundles, 5s initial loads, laggy inputs",
      projectCamp: "Ultra-lean Next.js Turbopack, sub-100ms transitions",
    },
  ];

  return (
    <section id="contrast" className="py-20 px-4 sm:px-6 bg-[#FAF7F0] border-y border-[#E7DDCE]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE6D6] text-[#7A4E2B] text-xs font-mono font-bold border border-[#DDD0BC] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C86446]" />
            <span>THE CONTRAST</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-black text-[#1E2229] tracking-tight">
            Why physical metaphors outperform digital noise.
          </h2>
          <p className="text-sm text-[#5E6B7C] mt-2 font-sans leading-relaxed">
            When software mimics the physical boundaries of paper, teams focus on finishing work instead of endlessly managing tickets.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="relative rounded-2xl md:rounded-3xl border border-[#DDD3C4] bg-[#FFFFFF] paper-shadow-lg overflow-hidden">
          <div className="absolute -top-3 right-10 z-10 hidden sm:block">
            <WashiTape color="terracotta" width={110} rotation={2} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3D8C8] bg-[#F7F3EA]">
                  <th className="py-4 px-6 font-sans font-semibold text-xs uppercase tracking-wider text-[#695A47] w-1/4">
                    Capability
                  </th>
                  <th className="py-4 px-6 font-sans font-semibold text-xs uppercase tracking-wider text-[#8C98A8] w-3/8">
                    Generic SaaS Tools
                  </th>
                  <th className="py-4 px-6 font-editorial font-bold text-sm text-[#1E2229] w-3/8 bg-[#FEFBF2] border-l border-[#EADFCF]">
                    <div className="flex items-center gap-2">
                      <WaxSeal text="PC" size="sm" />
                      <span>Project Camp</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7DA]">
                {comparisonItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FCFAF6] transition">
                    <td className="py-4 px-6 font-sans font-semibold text-xs text-[#1E2229]">
                      {item.capability}
                    </td>
                    <td className="py-4 px-6 text-[#6B7888] font-sans text-xs">
                      <div className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-[#A63838] shrink-0 mt-0.5" />
                        <span>{item.typical}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#1E2229] font-sans font-medium text-xs bg-[#FEFDF9] border-l border-[#EADFCF]">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#4E7545] shrink-0 mt-0.5" />
                        <span>{item.projectCamp}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
