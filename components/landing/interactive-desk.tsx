"use client";

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  CheckCircle2,
  Kanban,
  List as ListIcon,
  Users,
  Settings,
  Plus,
  ArrowRight,
  UserPlus,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Paperclip } from "@/components/stationery/paperclip";
import { Pushpin } from "@/components/stationery/pushpin";
import { WashiTape } from "@/components/stationery/washi-tape";

type DemoTaskStatus = "todo" | "in_progress" | "done";

interface DemoTask {
  id: string;
  title: string;
  description: string;
  status: DemoTaskStatus;
  assignee: string;
  phaseId: number;
}

const INITIAL_TASKS: DemoTask[] = [
  {
    id: "1",
    title: "Draft Schema & API Contracts",
    description: "Define REST endpoints and JWT auth specifications in documentation.",
    status: "done",
    assignee: "Alex Rivera",
    phaseId: 1,
  },
  {
    id: "2",
    title: "Build Tactile Kanban Board",
    description: "Implement 3-column physical cardstock board with paper lift shadows.",
    status: "in_progress",
    assignee: "Maria Chen",
    phaseId: 2,
  },
  {
    id: "3",
    title: "Sprint Roadmap & Timeline Matrix",
    description: "Collapsible 4-phase milestone ledger with progress capsule.",
    status: "in_progress",
    assignee: "Jordan Patel",
    phaseId: 2,
  },
  {
    id: "4",
    title: "Cross-Device QA & Release Checklist",
    description: "Verify touch gestures, accessibility, and production bundle speed.",
    status: "todo",
    assignee: "Taylor Swift",
    phaseId: 4,
  },
];

export function InteractiveDesk() {
  const [tasks, setTasks] = useState<DemoTask[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<"board" | "list" | "members">("board");
  const [showRoadmap, setShowRoadmap] = useState(true);

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const totalCount = tasks.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const moveTask = (taskId: string, newStatus: DemoTaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const resetDemo = () => {
    setTasks(INITIAL_TASKS);
  };

  const phases = [
    { id: 1, name: "Phase 1: Specs & Planning", range: "Days 1–5" },
    { id: 2, name: "Phase 2: Core Engineering", range: "Days 6–12" },
    { id: 3, name: "Phase 3: Integration & Review", range: "Days 13–18" },
    { id: 4, name: "Phase 4: QA & Release", range: "Days 19–24" },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Decorative Washi Tape & Pushpins */}
      <div className="absolute -top-3.5 left-8 z-20 hidden sm:block">
        <WashiTape color="ochre" width={120} rotation={-2} />
      </div>
      <div className="absolute -top-3 right-8 z-20 hidden sm:block">
        <Pushpin color="red" size="md" />
      </div>

      {/* Main Workspace Frame */}
      <div className="relative rounded-2xl md:rounded-3xl border border-[#DDD3C4] bg-[#FFFFFF] paper-shadow-lg overflow-hidden">
        {/* Top App Header Strip */}
        <div className="bg-[#FAF7F0] px-5 sm:px-7 pt-6 pb-4 border-b border-[#DDD3C4]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#8C7D6B] mb-1">
                <span>Projects</span>
                <span>/</span>
                <span>Architecture Blueprint</span>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="font-editorial text-2xl font-black text-[#1E2229] tracking-tight">
                  Architecture Blueprint
                </h3>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border border-[#D5C6B1] bg-[#F3EBE0] text-[#7A4E2B]">
                  ADMIN
                </span>
              </div>
            </div>

            {/* Top Toolbar Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Interactive Roadmap Toggle Button */}
              <button
                onClick={() => setShowRoadmap(!showRoadmap)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-editorial font-bold border transition cursor-pointer select-none shadow-2xs ${
                  showRoadmap
                    ? "bg-[#FFFFFF] border-[#C86446]/40 text-[#1E2229]"
                    : "bg-[#EFE8DC] border-[#DDD0BC] text-[#6E5E4C] hover:bg-[#F5EFE4]"
                }`}
                title="Toggle sprint roadmap banner"
              >
                <Calendar className={`w-3.5 h-3.5 ${showRoadmap ? "text-[#C86446]" : "text-[#8C5E3A]"}`} />
                <span>Roadmap</span>
                {/* Physical sliding toggle switch */}
                <div
                  className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                    showRoadmap ? "bg-[#C86446] justify-end" : "bg-[#CFC2AF] justify-start"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-white shadow-2xs" />
                </div>
              </button>

              <button
                onClick={resetDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6EE] hover:bg-[#EFE7DA] border border-[#DDD0BC] rounded-xl text-xs font-editorial font-bold text-[#6E5E4C] transition cursor-pointer"
                title="Reset interactive demo"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Sprint Roadmap & Timeline Banner */}
        {showRoadmap && (
          <div className="p-4 sm:p-6 bg-[#FCFAF6] border-b border-[#E3D8C8] animate-in fade-in duration-200">
            <div className="rounded-2xl border border-[#DDD3C4] bg-[#FFFFFF] paper-shadow overflow-hidden">
              {/* Banner Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 px-5 bg-[#F8F5EE] border-b border-[#E3D8C8]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#EFE6D6] text-[#7A4E2B] border border-[#DDD0BC]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-editorial text-sm font-bold text-[#1E2229]">
                        Sprint Roadmap & Timeline
                      </span>
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-full border border-[#D5C6B1] bg-[#F3EBE0] text-[#584835]">
                        {progressPct}% Completed
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6A788A] font-sans">
                      Sprint overview · <span className="font-medium text-[#4E7545]">{completedCount} done</span> · <span className="font-medium text-[#B87C1E]">{inProgressCount} in progress</span> · <span className="text-[#6E5E4C]">{totalCount} total tasks</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F1EADF] rounded-lg border border-[#DDD0BC]">
                    <div className="w-16 h-2 bg-[#E2D6C3] rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#5B7553] h-full transition-all duration-300"
                        style={{ width: `${(completedCount / totalCount) * 100}%` }}
                      />
                      <div
                        className="bg-[#D69336] h-full transition-all duration-300"
                        style={{ width: `${(inProgressCount / totalCount) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[#584835] font-bold">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4-Phase Grid */}
              <div className="p-4 overflow-x-auto drafting-grid">
                <div className="grid grid-cols-4 gap-3 min-w-[640px] mb-3 pb-2.5 border-b-2 border-dashed border-[#DDD0BC]">
                  {phases.map((p) => (
                    <div key={p.id} className="text-left px-2">
                      <span className="font-editorial font-bold text-xs text-[#2A3442] block">
                        {p.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#8C98A8] block">
                        {p.range}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Milestone Track Rows */}
                <div className="min-w-[640px] space-y-2">
                  {tasks.map((task) => {
                    const isDone = task.status === "done";
                    const isInProgress = task.status === "in_progress";
                    const pillTheme = isDone
                      ? "bg-[#EAF3E7] text-[#2D5027] border-[#BCD4B7]"
                      : isInProgress
                      ? "bg-[#FEF6E4] text-[#87550C] border-[#EED08E]"
                      : "bg-[#F5EFE6] text-[#554737] border-[#D8CABE]";

                    // Span phase columns based on task's phaseId
                    const colPlacement =
                      task.id === "1"
                        ? "col-start-1 col-span-1"
                        : task.id === "2"
                        ? "col-start-2 col-span-1"
                        : task.id === "3"
                        ? "col-start-2 col-span-2"
                        : "col-start-4 col-span-1";

                    return (
                      <div key={task.id} className="grid grid-cols-4 gap-3 items-center">
                        <div
                          className={`${colPlacement} flex items-center justify-between p-2 px-3 rounded-xl border ${pillTheme} shadow-2xs transition-all`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7545] shrink-0" />
                            ) : isInProgress ? (
                              <Clock className="w-3.5 h-3.5 text-[#B87C1E] shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-[#8E8070] shrink-0" />
                            )}
                            <span className="text-[11px] font-sans font-semibold truncate leading-tight">
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="w-4 h-4 rounded-full bg-white/80 text-[#7A4E2B] font-mono text-[9px] font-bold flex items-center justify-center border border-black/10">
                              {task.assignee.split(" ").map((n) => n[0]).join("")}
                            </span>
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                              {task.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Tab Bar */}
        <div className="px-5 sm:px-7 pt-3 bg-[#FAF7F0] border-b border-[#DDD3C4] flex items-center gap-1.5 text-xs select-none overflow-x-auto">
          <button
            onClick={() => setActiveTab("board")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-sans font-semibold text-xs tracking-[-0.01em] transition cursor-pointer border-t border-x ${
              activeTab === "board"
                ? "bg-[#FFFFFF] text-[#1E2229] border-[#DDD3C4] shadow-2xs translate-y-[1px]"
                : "bg-[#EFE8DC] text-[#6E5E4C] border-[#DDD0BC] hover:bg-[#F5EFE4]"
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-[#8C5E3A]" />
            <span>Board</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAE0D0] font-mono text-[#584835]">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-sans font-semibold text-xs tracking-[-0.01em] transition cursor-pointer border-t border-x ${
              activeTab === "list"
                ? "bg-[#FFFFFF] text-[#1E2229] border-[#DDD3C4] shadow-2xs translate-y-[1px]"
                : "bg-[#EFE8DC] text-[#6E5E4C] border-[#DDD0BC] hover:bg-[#F5EFE4]"
            }`}
          >
            <ListIcon className="w-3.5 h-3.5 text-[#8C5E3A]" />
            <span>List View</span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-sans font-semibold text-xs tracking-[-0.01em] transition cursor-pointer border-t border-x ${
              activeTab === "members"
                ? "bg-[#FFFFFF] text-[#1E2229] border-[#DDD3C4] shadow-2xs translate-y-[1px]"
                : "bg-[#EFE8DC] text-[#6E5E4C] border-[#DDD0BC] hover:bg-[#F5EFE4]"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#8C5E3A]" />
            <span>Team Members</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAE0D0] font-mono text-[#584835]">
              3
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-5 sm:p-7 bg-[#FCFBF8]">
          {activeTab === "board" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* TO DO Column */}
              <div className="rounded-2xl border border-[#E8DEC7] bg-[#FEFAED] overflow-hidden flex flex-col paper-shadow-sm">
                <div className="p-3.5 px-4 bg-[#FBF6E9] border-b border-[#E8DEC7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3.5 h-3.5 text-[#8E8070]" />
                    <span className="font-editorial text-sm font-bold text-[#1E2229]">To Do</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#7A6A55] bg-white/80 px-2 py-0.5 rounded-full border border-[#DCD0BE]">
                    {tasks.filter((t) => t.status === "todo").length}
                  </span>
                </div>
                <div className="p-3 space-y-3 flex-1 min-h-[180px]">
                  {tasks
                    .filter((t) => t.status === "todo")
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 bg-white border border-[#DDD3C4] rounded-xl paper-shadow paper-lift transition group"
                      >
                        <h4 className="font-sans font-semibold text-[13px] text-[#1E2229] mb-1 leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-xs text-[#6A788A] leading-relaxed mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F0E8DC]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#EAE0D0] text-[#7A4E2B] font-mono text-[9px] font-bold flex items-center justify-center shrink-0 border border-[#D5C6AF]">
                              {task.assignee.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="text-[#6A5A48] font-medium text-[11px]">{task.assignee}</span>
                          </div>
                          <button
                            onClick={() => moveTask(task.id, "in_progress")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#7A4E2B] font-sans font-semibold text-xs border border-[#DDD0BC] transition cursor-pointer shadow-2xs hover:-translate-y-0.5 active:scale-[0.98]"
                            title="Move to In Progress"
                          >
                            <span>Start</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="rounded-2xl border border-[#E3D8C4] bg-[#FCF9F2] overflow-hidden flex flex-col paper-shadow-sm">
                <div className="p-3.5 px-4 bg-[#F9F4E6] border-b border-[#E3D8C4] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#B87C1E]" />
                    <span className="font-editorial text-sm font-bold text-[#1E2229]">In Progress</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#B87C1E] bg-white/80 px-2 py-0.5 rounded-full border border-[#DCD0BE]">
                    {tasks.filter((t) => t.status === "in_progress").length}
                  </span>
                </div>
                <div className="p-3 space-y-3 flex-1 min-h-[180px]">
                  {tasks
                    .filter((t) => t.status === "in_progress")
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 bg-white border border-[#DDD3C4] rounded-xl paper-shadow paper-lift transition group"
                      >
                        <h4 className="font-sans font-semibold text-[13px] text-[#1E2229] mb-1 leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-xs text-[#6A788A] leading-relaxed mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F0E8DC]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#EAE0D0] text-[#7A4E2B] font-mono text-[9px] font-bold flex items-center justify-center shrink-0 border border-[#D5C6AF]">
                              {task.assignee.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="text-[#6A5A48] font-medium text-[11px]">{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => moveTask(task.id, "todo")}
                              className="px-2 py-1 rounded-lg bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#8C7D6B] font-mono text-[10px] border border-[#DDD0BC] transition cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              onClick={() => moveTask(task.id, "done")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EAF3E7] hover:bg-[#DCECD8] text-[#2D5027] font-sans font-semibold text-xs border border-[#BCD4B7] transition cursor-pointer shadow-2xs hover:-translate-y-0.5 active:scale-[0.98]"
                              title="Mark as Done"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Done</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* DONE Column */}
              <div className="rounded-2xl border border-[#D2E4CE] bg-[#F8FCF7] overflow-hidden flex flex-col paper-shadow-sm">
                <div className="p-3.5 px-4 bg-[#F3F8F1] border-b border-[#CBE0C7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7545]" />
                    <span className="font-editorial text-sm font-bold text-[#1E2229]">Done</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#4E7545] bg-white/80 px-2 py-0.5 rounded-full border border-[#CBE0C7]">
                    {tasks.filter((t) => t.status === "done").length}
                  </span>
                </div>
                <div className="p-3 space-y-3 flex-1 min-h-[180px]">
                  {tasks
                    .filter((t) => t.status === "done")
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 bg-white border border-[#D2E4CE] rounded-xl paper-shadow transition group opacity-90 hover:opacity-100"
                      >
                        <h4 className="font-sans font-semibold text-[13px] text-[#1E2229] line-through text-[#8C98A8] mb-1 leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-xs text-[#8C98A8] line-through leading-relaxed mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#E8F0E6]">
                          <span className="text-[#5B7553] font-mono font-medium text-xs">✓ Completed</span>
                          <button
                            onClick={() => moveTask(task.id, "in_progress")}
                            className="px-2 py-1 rounded-lg bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#7A4E2B] font-mono text-[10px] border border-[#DDD0BC] transition cursor-pointer"
                          >
                            Reopen
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "list" && (
            <div className="rounded-2xl border border-[#DDD3C4] bg-white paper-shadow overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F4EC] text-[#554737] border-b border-[#DDD0BC] font-sans font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Task</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assignee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE7DA] ledger-ruled">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-[#FAF7F0] transition">
                      <td className="py-3.5 px-4 font-sans font-semibold text-xs text-[#1E2229]">
                        {task.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                            task.status === "done"
                              ? "bg-[#EAF3E7] text-[#2D5027] border-[#BCD4B7]"
                              : task.status === "in_progress"
                              ? "bg-[#FEF6E4] text-[#87550C] border-[#EED08E]"
                              : "bg-[#F5EFE6] text-[#554737] border-[#D8CABE]"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5E6B7C] font-medium">
                        {task.assignee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "members" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Alex Rivera", role: "ADMIN", email: "alex@example.com" },
                { name: "Maria Chen", role: "PROJECT_ADMIN", email: "maria@example.com" },
                { name: "Jordan Patel", role: "MEMBER", email: "jordan@example.com" },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-[#DDD3C4] rounded-xl paper-shadow-sm flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-[#EAE0D0] text-[#7A4E2B] font-editorial font-bold flex items-center justify-center">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-editorial text-xs font-bold text-[#1E2229]">{m.name}</h5>
                    <span className="font-mono text-[10px] text-[#8A7966]">{m.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Hint Banner */}
        <div className="p-3 px-6 bg-[#FAF7F0] border-t border-[#DDD3C4] text-center text-xs text-[#7A6C58] font-editorial">
          Interactive Live Demo · Click buttons to move tasks and watch sprint progress recalculate in real-time.
        </div>
      </div>
    </div>
  );
}
