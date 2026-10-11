"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, CheckCircle2, Clock, Circle, User } from "lucide-react";
import { Task, TaskStatus } from "@/types/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatarView } from "@/components/ui/avatar";

interface TaskListViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onMoveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export function TaskListView({ tasks, onSelectTask, onMoveTaskStatus }: TaskListViewProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" ? true : t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [tasks, search, filterStatus]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8A7966]" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#DDD3C4] rounded-xl text-xs text-[#1E2229] placeholder-[#8C98A8] focus:border-[#C86446] transition paper-shadow-sm font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[#FFFFFF] border border-[#DDD3C4] rounded-xl text-xs text-[#4E4133] font-editorial font-bold focus:border-[#C86446] transition paper-shadow-sm cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>
      </div>

      {/* Double-ruled Accounting Ledger Table */}
      <div className="rounded-2xl border border-[#DDD3C4] bg-[#FFFFFF] paper-shadow overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F4EC] text-[#4E4133] border-b-2 border-[#DDD0BC] font-editorial font-bold text-xs">
            <tr>
              <th className="py-3 px-5">Task</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Assignee</th>
              <th className="py-3 px-5 text-right font-mono text-[11px]">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE7DA] ledger-ruled">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-[#8C98A8] italic font-editorial">
                  No matching tasks found
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const assignedUser =
                  typeof task.assignedTo === "object" && task.assignedTo !== null
                    ? task.assignedTo
                    : null;
                const dateStr = new Date(task.createdAt).toLocaleDateString();

                return (
                  <tr
                    key={task._id}
                    onClick={() => onSelectTask(task)}
                    className="hover:bg-[#FAF7F0] transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-editorial font-bold text-sm text-[#1E2229] group-hover:text-[#A83820] transition">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-[11px] text-[#5E6B7C] truncate max-w-md mt-0.5 font-sans">
                          {task.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) => onMoveTaskStatus(task._id, e.target.value as TaskStatus)}
                        className="bg-[#FCFAF5] border border-[#DDD3C4] rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#4E4133] focus:border-[#C86446] transition cursor-pointer"
                      >
                        <option value="todo">TO DO</option>
                        <option value="in_progress">IN PROGRESS</option>
                        <option value="done">DONE</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-5">
                      {assignedUser ? (
                        <div className="flex items-center gap-2">
                          <UserAvatarView
                            name={assignedUser.fullName || assignedUser.username}
                            url={assignedUser.avatar?.url}
                            size="xs"
                          />
                          <span className="text-[#3E3428] font-medium">
                            {assignedUser.fullName || assignedUser.username}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#9A8B7A] italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right text-[#8A7966] font-mono text-[11px]">
                      {dateStr}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
