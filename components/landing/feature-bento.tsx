"use client";

import React from "react";
import { Kanban, Calendar, Table2, ShieldCheck, Check, Sparkles } from "lucide-react";
import { Paperclip } from "@/components/stationery/paperclip";
import { Pushpin } from "@/components/stationery/pushpin";
import { WashiTape } from "@/components/stationery/washi-tape";

export function FeatureBento() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE6D6] text-[#7A4E2B] text-xs font-mono font-bold border border-[#DDD0BC] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C86446]" />
          <span>PHYSICAL ANALOG METAPHORS</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-black text-[#1E2229] tracking-tight">
          Tools crafted for calm execution.
        </h2>
        <p className="text-sm text-[#5E6B7C] mt-2 font-sans leading-relaxed">
          Every screen feels like an organized stationery studio—tactile cards, double-ruled ledgers, and clear milestones designed to keep your team focused on shipping.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Kanban Board (Wide card on desktop) */}
        <div className="lg:col-span-2 relative p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] border border-[#DDD3C4] paper-shadow paper-lift transition flex flex-col justify-between overflow-visible">
          <div className="absolute -top-3 right-8 z-10">
            <Paperclip color="brass" size="sm" rotation={-8} />
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-[#F6EFE5] rounded-xl text-[#7A4E2B] border border-[#E0D2C0]">
                <Kanban className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A7966]">Cardstock Flow</span>
                <h3 className="font-editorial text-xl font-bold text-[#1E2229]">
                  Fluid 3-Column Kanban Board
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#5E6B7C] leading-relaxed mb-6 max-w-xl font-sans">
              Organize priorities with index cards that elevate with realistic depth shadows. Move items from To Do to In Progress and Done without cognitive friction or modal interruptions.
            </p>

            {/* Visual Mini Graphic */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-[#FAF7F0] rounded-xl border border-[#E7DEC8]">
              <div className="p-2.5 bg-white rounded-lg border border-[#DDD0BC] shadow-2xs">
                <div className="text-[9px] font-mono text-[#8C7D6B] uppercase tracking-wider mb-1">To Do</div>
                <div className="text-[11px] font-sans font-semibold text-[#1E2229] truncate">API Contracts</div>
                <div className="text-[9px] text-[#8C7D6B] font-mono mt-1">@alex</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#DDD0BC] shadow-2xs">
                <div className="text-[9px] font-mono text-[#B87C1E] uppercase tracking-wider mb-1 font-bold">In Progress</div>
                <div className="text-[11px] font-sans font-semibold text-[#1E2229] truncate">Kanban Board</div>
                <div className="text-[9px] text-[#8C7D6B] font-mono mt-1">@maria</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#BCD4B7] shadow-2xs">
                <div className="text-[9px] font-mono text-[#4E7545] uppercase tracking-wider mb-1 font-bold">Done</div>
                <div className="text-[11px] font-sans font-semibold text-[#8C98A8] line-through truncate">User Auth</div>
                <div className="text-[9px] text-[#4E7545] font-mono mt-1">✓ complete</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5 text-xs text-[#7A6C58] font-mono">
            <Check className="w-4 h-4 text-[#4E7545]" />
            <span>Subtask checklists, assignees, and instant status updates</span>
          </div>
        </div>

        {/* Card 2: 4-Phase Sprint Roadmap */}
        <div className="relative p-6 sm:p-7 rounded-2xl bg-[#FCFAF5] border border-[#DDD3C4] paper-shadow paper-lift transition flex flex-col justify-between overflow-visible">
          <div className="absolute -top-3.5 right-6 z-10">
            <Pushpin color="red" size="sm" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-[#F6EFE5] rounded-xl text-[#7A4E2B] border border-[#E0D2C0]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A7966]">Milestone Ledger</span>
                <h3 className="font-editorial text-lg font-bold text-[#1E2229]">
                  Sprint Roadmap & Timeline
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#5E6B7C] leading-relaxed mb-4 font-sans">
              A collapsible overview banner positioned right above the sprint board. View sprint milestones at a glance with a dedicated toggle switch.
            </p>

            <div className="p-3 bg-white rounded-xl border border-[#DDD0BC] drafting-grid space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-[#8C98A8]">
                <span>Phase 1: Specs</span>
                <span>Phase 4: Release</span>
              </div>
              <div className="w-full h-2 bg-[#EFE5D7] rounded-full overflow-hidden flex">
                <div className="bg-[#4E7545] w-2/3 h-full" />
                <div className="bg-[#B87C1E] w-1/4 h-full" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6A5A48]">
                <span>2 Milestones Finished</span>
                <span className="text-[#4E7545] font-bold">75%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5 text-xs text-[#7A6C58] font-mono">
            <Check className="w-4 h-4 text-[#4E7545]" />
            <span>Zero Gantt chart bloat, 100% clarity</span>
          </div>
        </div>

        {/* Card 3: Double-Ruled Accounting Ledger */}
        <div className="relative p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] border border-[#DDD3C4] paper-shadow paper-lift transition flex flex-col justify-between overflow-visible">
          <div className="absolute -top-3 left-10 z-10">
            <WashiTape color="sage" width={80} rotation={-1} />
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-[#F6EFE5] rounded-xl text-[#7A4E2B] border border-[#E0D2C0]">
                <Table2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A7966]">Ruled Accounting</span>
                <h3 className="font-editorial text-lg font-bold text-[#1E2229]">
                  Tabular List View
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#5E6B7C] leading-relaxed mb-4 font-sans">
              Prefer tables? Switch from the visual board to a lined accounting ledger. Filter tasks by status, search by keywords, and review team workloads in seconds.
            </p>

            {/* Mini Ledger Preview */}
            <div className="rounded-xl border border-[#DDD0BC] bg-white overflow-hidden ledger-ruled text-[10px] p-2.5 space-y-1.5 font-mono text-[#554737] shadow-2xs">
              <div className="flex justify-between font-bold border-b border-[#E8DEC7] pb-1 text-[#8C7D6B]">
                <span>TASK</span>
                <span>STATUS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 font-sans font-medium text-[11px] text-[#1E2229]">Blueprint Scope</span>
                <span className="text-[#2D5027] bg-[#EAF3E7] px-1.5 py-0.2 rounded border border-[#BCD4B7] text-[9px] font-bold">DONE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 font-sans font-medium text-[11px] text-[#1E2229]">QA Checklist</span>
                <span className="text-[#87550C] bg-[#FEF6E4] px-1.5 py-0.2 rounded border border-[#EED08E] text-[9px] font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5 text-xs text-[#7A6C58] font-mono">
            <Check className="w-4 h-4 text-[#4E7545]" />
            <span>Keyboard-friendly fast triage</span>
          </div>
        </div>

        {/* Card 4: Team Collaboration (Wide card on desktop) */}
        <div className="lg:col-span-2 relative p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] border border-[#DDD3C4] paper-shadow paper-lift transition flex flex-col justify-between overflow-visible">
          <div className="absolute -top-3 right-8 z-10">
            <Paperclip color="silver" size="sm" rotation={8} />
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-[#F6EFE5] rounded-xl text-[#7A4E2B] border border-[#E0D2C0]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A7966]">Team Roles</span>
                <h3 className="font-editorial text-xl font-bold text-[#1E2229]">
                  Crystal-Clear Roles & Permissions
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#5E6B7C] leading-relaxed mb-4 max-w-xl">
              Granular project-level access controls without enterprise complexity. Assign Admins, Project Admins, and Members to keep workspaces secure while enabling swift collaboration.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F4EDE2] text-[#8C5E3A] border border-[#DFD3C0]">
                ADMIN
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EBF0F5] text-[#2C4258] border border-[#CAD4DF]">
                PROJECT ADMIN
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FAF6EE] text-[#554737] border border-[#DDD0BC]">
                MEMBER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5 text-xs text-[#7A6C58] font-mono">
            <Check className="w-4 h-4 text-[#4E7545]" />
            <span>Instant email invites for registered team accounts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
