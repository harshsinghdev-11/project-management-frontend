"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, CheckCircle2, Clock, Circle, Sparkles } from "lucide-react";
import { Task, TaskStatus } from "@/types/api";
import { UserAvatarView } from "@/components/ui/avatar";
import { Paperclip } from "@/components/stationery/paperclip";

interface TimelineMatrixProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function TimelineMatrix({
  tasks,
  onSelectTask,
  isOpen = true,
  onToggle,
}: TimelineMatrixProps) {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const open = onToggle !== undefined ? isOpen : internalOpen;
  const toggle = onToggle || (() => setInternalOpen(!internalOpen));

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const totalCount = tasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Split tasks across illustrative sprint phases
  const sprintPhases = [
    { id: "p1", name: "Phase 1: Specs & Planning", range: "Days 1-5" },
    { id: "p2", name: "Phase 2: Core Engineering", range: "Days 6-12" },
    { id: "p3", name: "Phase 3: Integration & Review", range: "Days 13-18" },
    { id: "p4", name: "Phase 4: QA & Release", range: "Days 19-24" },
  ];

  return (
    <div className="relative mb-4 rounded-2xl border border-[#DDD3C4] bg-[#FFFFFF] paper-shadow overflow-hidden transition-all duration-200">
      {/* Decorative brass paperclip in corner */}
      <div className="absolute top-2.5 right-6 z-10 hidden sm:block">
        <Paperclip color="brass" size="sm" rotation={12} />
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 px-6 bg-[#F8F5EE] border-b border-[#E3D8C8]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#EFE6D6] text-[#7A4E2B] border border-[#DDD0BC] shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-editorial text-base font-bold text-[#1E2229] tracking-tight">
                Sprint Roadmap & Timeline
              </h3>
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-[#D5C6B1] bg-[#F3EBE0] text-[#584835]">
                {progressPct}% Completed
              </span>
            </div>
            <p className="text-xs text-[#6A788A] mt-0.5 font-sans">
              Sprint overview · <span className="font-medium text-[#4E7545]">{completedCount} done</span> · <span className="font-medium text-[#B87C1E]">{inProgressCount} in progress</span> · <span className="text-[#6E5E4C]">{totalCount} total tasks</span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Visual progress bar capsule */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#F1EADF] rounded-lg border border-[#DDD0BC]">
            <div className="w-20 h-2 bg-[#E2D6C3] rounded-full overflow-hidden flex">
              <div
                className="bg-[#5B7553] h-full transition-all"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
              <div
                className="bg-[#D69336] h-full transition-all"
                style={{ width: `${totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[#584835] font-bold">
              {completedCount}/{totalCount}
            </span>
          </div>

          <button
            onClick={toggle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D9CEBC] bg-[#FCFAF5] hover:bg-[#F2ECE0] text-xs font-editorial font-bold text-[#4A5565] transition shadow-xs cursor-pointer select-none"
          >
            <span>{open ? "Collapse" : "Expand Roadmap"}</span>
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Roadmap Body */}
      {open && (
        <div className="p-5 overflow-x-auto drafting-grid">
          {/* Phase Grid Columns Header */}
          <div className="grid grid-cols-4 gap-3 min-w-[700px] mb-3 pb-2 border-b-2 border-dashed border-[#DDD0BC]">
            {sprintPhases.map((phase, idx) => (
              <div key={phase.id} className="text-left px-2">
                <span className="font-editorial font-bold text-xs text-[#2A3442] block">
                  {phase.name}
                </span>
                <span className="font-mono text-[10px] text-[#8C98A8] block">
                  {phase.range}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline Rows with Earthy Pill Blocks */}
          {tasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8C98A8] italic font-editorial">
              No tasks in this project yet. Add tasks below to view the roadmap.
            </div>
          ) : (
            <div className="space-y-2.5 min-w-[700px]">
              {tasks.slice(0, 7).map((task, idx) => {
                const assignedUser =
                  typeof task.assignedTo === "object" && task.assignedTo !== null
                    ? task.assignedTo
                    : null;

                // Deterministic phase span based on task status
                const isDone = task.status === "done";
                const isInProgress = task.status === "in_progress";

                // Pill theme colors
                const pillTheme = isDone
                  ? "bg-[#EAF3E7] text-[#2D5027] border-[#BCD4B7] shadow-xs"
                  : isInProgress
                  ? "bg-[#FEF6E4] text-[#87550C] border-[#EED08E] shadow-xs"
                  : "bg-[#F5EFE6] text-[#554737] border-[#D8CABE]";

                const colSpanClass = isDone
                  ? "col-span-2 col-start-1"
                  : isInProgress
                  ? "col-span-2 col-start-2"
                  : "col-span-2 col-start-3";

                return (
                  <div
                    key={task._id}
                    onClick={() => onSelectTask && onSelectTask(task)}
                    className="grid grid-cols-4 gap-3 items-center group cursor-pointer"
                  >
                    <div
                      className={`${colSpanClass} flex items-center justify-between p-2 px-3 rounded-xl border ${pillTheme} transition-transform group-hover:translate-x-1`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7545] shrink-0" />
                        ) : isInProgress ? (
                          <Clock className="w-3.5 h-3.5 text-[#B87C1E] shrink-0 animate-pulse" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-[#8E8070] shrink-0" />
                        )}
                        <span className="text-xs font-semibold truncate leading-tight">
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {assignedUser && (
                          <UserAvatarView
                            name={assignedUser.fullName || assignedUser.username}
                            url={assignedUser.avatar?.url}
                            size="xs"
                          />
                        )}
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
