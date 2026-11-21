"use client";

import React from "react";
import { Plus, ArrowRight, ArrowLeft, CheckCircle2, Clock, Circle, Paperclip as ClipIcon } from "lucide-react";
import { Task, TaskStatus } from "@/types/api";
import { UserAvatarView } from "@/components/ui/avatar";
import { Paperclip } from "@/components/stationery/paperclip";

interface KanbanBoardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: (status: TaskStatus) => void;
  onMoveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export function KanbanBoard({
  tasks,
  onSelectTask,
  onOpenCreateTask,
  onMoveTaskStatus,
}: KanbanBoardProps) {
  const columns: Array<{
    status: TaskStatus;
    title: string;
    sublabel: string;
    icon: React.ReactNode;
    headerBg: string;
    boardBg: string;
    borderColor: string;
    pinColor: "brass" | "sage" | "red";
  }> = [
    {
      status: "todo",
      title: "To Do",
      sublabel: "Pending tasks",
      icon: <Circle className="w-3.5 h-3.5 text-[#8E8070]" />,
      headerBg: "bg-[#FBF6E9] border-b border-[#E8DEC7]",
      boardBg: "bg-[#FEFAED]",
      borderColor: "border-[#E8DEC7]",
      pinColor: "brass",
    },
    {
      status: "in_progress",
      title: "In Progress",
      sublabel: "Currently active",
      icon: <Clock className="w-3.5 h-3.5 text-[#B87C1E]" />,
      headerBg: "bg-[#F9F4E6] border-b border-[#E3D8C4]",
      boardBg: "bg-[#FCF9F2]",
      borderColor: "border-[#E3D8C4]",
      pinColor: "red",
    },
    {
      status: "done",
      title: "Done",
      sublabel: "Completed tasks",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7545]" />,
      headerBg: "bg-[#F3F8F1] border-b border-[#CBE0C7]",
      boardBg: "bg-[#F8FCF7]",
      borderColor: "border-[#D2E4CE]",
      pinColor: "sage",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className={`relative flex flex-col rounded-2xl border ${col.borderColor} ${col.boardBg} paper-shadow overflow-hidden`}
          >
            {/* Top Wooden Clipboard Clip Visual Accent */}
            <div className="flex justify-start px-6 pt-2">
              <div
                className="w-20 h-3 rounded-t-md bg-[#D9CAB3] border-t border-x border-[#BCAC95] flex items-center justify-center shadow-xs"
                title="Clipboard Wire Clip"
              >
                <div className="w-10 h-1 rounded-full bg-[#B29E84]" />
              </div>
            </div>

            {/* Board Header Bar */}
            <div className={`flex items-center justify-between p-3 sm:p-3.5 px-4 sm:px-6 ${col.headerBg}`}>
              <div className="flex items-center gap-2.5">
                {col.icon}
                <div>
                  <h3 className="font-editorial text-sm font-bold text-[#1E2229]">
                    {col.title}
                  </h3>
                  <span className="text-[10px] text-[#7A6C58] font-mono block -mt-0.5">
                    {col.sublabel}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-[#DCD0BE] text-[#4A3D2D]">
                  {columnTasks.length} {columnTasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>

              <button
                onClick={() => onOpenCreateTask(col.status)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-editorial font-bold text-[#6E5E4C] hover:text-[#1E2229] bg-white/60 hover:bg-white border border-[#DDD0BC] rounded-lg transition cursor-pointer paper-shadow-xs"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Horizontally Scrollable Tasks Tray */}
            <div className="p-3 sm:p-4 overflow-x-auto ledger-ruled">
              <div className="flex flex-row items-stretch gap-4 min-w-full pb-2">
                {columnTasks.length === 0 ? (
                  <div className="w-full py-8 px-6 text-center border-2 border-dashed border-[#E0D5C3] rounded-xl text-[#9A8B7A] text-xs font-editorial italic bg-white/40">
                    No tasks in this board — click &quot;Add Task&quot; above to create one
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const assignedUser =
                      typeof task.assignedTo === "object" && task.assignedTo !== null
                        ? task.assignedTo
                        : null;

                    return (
                      <div
                        key={task._id}
                        className="group relative flex flex-col justify-between w-[280px] sm:w-[320px] shrink-0 p-4 bg-[#FFFFFF] hover:bg-[#FCFBF8] border border-[#DDD3C4] rounded-xl paper-shadow paper-lift transition-all duration-150 cursor-pointer select-none"
                        style={{
                          boxShadow: "0 1px 3px rgba(45, 35, 20, 0.05), 0 3px 8px rgba(45, 35, 20, 0.06)",
                        }}
                        onClick={() => onSelectTask(task)}
                      >
                        {/* Brass Paperclip for tasks with attachments */}
                        {task.attachments && task.attachments.length > 0 && (
                          <div className="absolute -top-3 right-3 z-10">
                            <Paperclip color="brass" size="sm" rotation={10} />
                          </div>
                        )}

                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="font-sans font-semibold text-[13px] text-[#1E2229] group-hover:text-[#C86446] transition leading-snug line-clamp-2">
                              {task.title}
                            </h4>
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-[#6A788A] line-clamp-2 leading-relaxed mb-3">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-dashed border-[#E3D8C8] text-xs">
                          {/* Assignee */}
                          <div className="flex items-center gap-1.5">
                            {assignedUser ? (
                              <>
                                <UserAvatarView
                                  name={assignedUser.fullName || assignedUser.username}
                                  url={assignedUser.avatar?.url}
                                  size="xs"
                                />
                                <span className="text-[11px] text-[#554737] font-medium truncate max-w-[110px]">
                                  {assignedUser.fullName || assignedUser.username}
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] text-[#9E9080] italic">Unassigned</span>
                            )}
                          </div>

                          {/* Quick Column Advancement */}
                          <div
                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {col.status !== "todo" && (
                              <button
                                onClick={() => onMoveTaskStatus(task._id, "todo")}
                                title="Return to To-Do"
                                className="p-1 rounded bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#5A4D3D] transition cursor-pointer"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.status !== "in_progress" && (
                              <button
                                onClick={() => onMoveTaskStatus(task._id, "in_progress")}
                                title="Advance to In Progress"
                                className="p-1 rounded bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#B87C1E] transition cursor-pointer"
                              >
                                <Clock className="w-3 h-3" />
                              </button>
                            )}
                            {col.status !== "done" && (
                              <button
                                onClick={() => onMoveTaskStatus(task._id, "done")}
                                title="Mark Finished"
                                className="p-1 rounded bg-[#EBF4E9] hover:bg-[#DCEBD9] text-[#4E7545] transition cursor-pointer"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
