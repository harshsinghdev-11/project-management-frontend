"use client";

import React, { useState } from "react";
import { X, CheckSquare, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { ProjectMemberDetail, Task, TaskStatus } from "@/types/api";
import { useToast } from "@/components/ui/toast";
import { Paperclip } from "@/components/stationery/paperclip";

interface CreateTaskModalProps {
  projectId: string;
  members: ProjectMemberDetail[];
  initialStatus?: TaskStatus;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

export function CreateTaskModal({
  projectId,
  members,
  initialStatus = "todo",
  isOpen,
  onClose,
  onTaskCreated,
}: CreateTaskModalProps) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        assignedTo: assignedTo || undefined,
      };

      const task = await api.post<Task>(`/tasks/${projectId}`, payload);
      toast.success("Task created", `"${task.title}" added to project.`);
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setStatus(initialStatus);
      onTaskCreated(task);
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
          const first = Object.values(err.errors[0])[0];
          setErrorMsg(String(first));
        } else {
          setErrorMsg(err.message || "Failed to create task");
        }
      } else {
        setErrorMsg("Failed to connect to backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-6 paper-shadow-lg">
        {/* Brass Paperclip accent */}
        <div className="absolute top-2 right-12 z-10">
          <Paperclip color="brass" size="sm" rotation={10} />
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D2] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F6EFE5] rounded-xl text-[#7A4E2B] border border-[#E0D2C0]">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-bold text-[#1E2229]">Create Task</h2>
              <p className="text-xs text-[#7A889B]">Add a new work item to the project board</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C98A8] hover:text-[#1E2229] p-1.5 rounded-lg hover:bg-[#F4EFE6] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-[#FDF0ED] border border-[#EAA896] text-[#A83820] text-xs font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E3428] font-editorial mb-1.5">
              Task Title <span className="text-[#C86446]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design responsive navbar, Write JWT middleware"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-sm text-[#1E2229] placeholder-[#8C98A8] focus:border-[#C86446] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#C86446] transition font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E3428] font-editorial mb-1.5">
              Description (optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details, acceptance criteria, or reference notes..."
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-sm text-[#1E2229] placeholder-[#8C98A8] focus:border-[#C86446] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#C86446] transition resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#3E3428] font-editorial mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-xs text-[#1E2229] font-mono font-bold focus:border-[#C86446] transition cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3428] font-editorial mb-1.5">
                Assignee
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-xs text-[#1E2229] font-medium focus:border-[#C86446] transition cursor-pointer"
              >
                <option value="">Unassigned</option>
                {members.map((m) => {
                  const isUserObj = typeof m.user === "object" && m.user !== null;
                  const userId = isUserObj ? m.user._id : String(m.user || "");
                  const username = isUserObj ? (m.user.username || "user") : "user";
                  const fullName = isUserObj ? (m.user.fullName || username) : username;
                  return (
                    <option key={userId} value={userId}>
                      {fullName} (@{username})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE0D2]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5E5142] hover:text-[#1E2229] hover:bg-[#F4EFE6] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#C86446] hover:bg-[#B34F34] rounded-xl shadow-md border border-[#9A371F] disabled:opacity-50 transition cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span className="font-editorial text-sm">Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
