"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Loader2,
  AlertTriangle,
  Paperclip as ClipIcon,
  CheckSquare,
} from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { TaskDetail, TaskStatus, ProjectMemberDetail, Subtask } from "@/types/api";
import { UserAvatarView } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { Paperclip } from "@/components/stationery/paperclip";

interface TaskDetailModalProps {
  projectId: string;
  taskId: string | null;
  members: ProjectMemberDetail[];
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  onTaskDeleted: (taskId: string) => void;
}

export function TaskDetailModal({
  projectId,
  taskId,
  members,
  isOpen,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}: TaskDetailModalProps) {
  const toast = useToast();

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittingSubtask, setSubmittingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [assignedToId, setAssignedToId] = useState<string>("");

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await api.get<TaskDetail>(`/tasks/${projectId}/t/${taskId}`);
      setTask(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setStatus(data.status || "todo");
      setAssignedToId(data.assignedTo?._id || "");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || "Failed to load task details");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
      setConfirmDelete(false);
    } else {
      setTask(null);
    }
  }, [isOpen, taskId, projectId]);

  if (!isOpen || !taskId) return null;

  const handleUpdateTask = async () => {
    if (!title.trim()) return;
    try {
      setSaving(true);
      await api.put(`/tasks/${projectId}/t/${taskId}`, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        assignedTo: assignedToId || undefined,
      });
      toast.success("Case file updated", "Changes inked to record.");
      onTaskUpdated();
    } catch (err: any) {
      toast.error("Update failed", err?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setStatus(newStatus);
    try {
      await api.put(`/tasks/${projectId}/t/${taskId}`, {
        status: newStatus,
      });
      toast.success("Status stamped", `Moved to ${newStatus.replace("_", " ")}`);
      onTaskUpdated();
    } catch (err: any) {
      toast.error("Failed to update status", err?.message);
    }
  };

  const handleToggleSubtask = async (subtask: Subtask) => {
    const updatedStatus = !subtask.isCompleted;

    // Optimistic update
    setTask((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        subtasks: prev.subtasks.map((st) =>
          st._id === subtask._id ? { ...st, isCompleted: updatedStatus } : st
        ),
      };
    });

    try {
      await api.put(`/tasks/${projectId}/st/${subtask._id}`, {
        isCompleted: updatedStatus,
      });
      onTaskUpdated();
    } catch {
      toast.error("Failed to tick subtask");
      fetchTaskDetails();
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    try {
      setSubmittingSubtask(true);
      await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, {
        title: newSubtaskTitle.trim(),
      });
      setNewSubtaskTitle("");
      toast.success("Checklist item added");
      await fetchTaskDetails();
      onTaskUpdated();
    } catch (err: any) {
      toast.error("Failed to add subtask", err?.message);
    } finally {
      setSubmittingSubtask(false);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await api.delete(`/tasks/${projectId}/st/${subtaskId}`);
      setTask((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subtasks: prev.subtasks.filter((st) => st._id !== subtaskId),
        };
      });
      toast.info("Checklist item removed");
      onTaskUpdated();
    } catch (err: any) {
      toast.error("Failed to delete subtask", err?.message);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await api.delete(`/tasks/${projectId}/t/${taskId}`);
      toast.success("Task deleted");
      onTaskDeleted(taskId);
      onClose();
    } catch (err: any) {
      toast.error("Failed to delete task", err?.message);
    }
  };

  const completedSubtasks = task?.subtasks?.filter((s) => s.isCompleted).length || 0;
  const totalSubtasks = task?.subtasks?.length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl flex flex-col paper-shadow-lg overflow-hidden">
        {/* Manila file folder tab shape */}
        <div
          className="absolute top-0 left-6 h-3 w-28 rounded-b-md bg-[#ECE2D0] border-x border-b border-[#D8CABE]"
          aria-hidden="true"
        />

        {/* Paperclip in corner */}
        <div className="absolute top-2 right-12 z-10">
          <Paperclip color="brass" size="sm" rotation={-10} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 pt-5 border-b border-[#EAE0D2] bg-[#FAF7F0] shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-[#6A788A] font-mono">
            <span className="font-bold text-[#8C7A65]">TASK #{taskId.slice(-5).toUpperCase()}</span>
            <span>•</span>
            <StatusBadge status={status} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="text-[#8C98A8] hover:text-[#1E2229] p-1.5 rounded-lg hover:bg-[#F4EFE6] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-14 flex flex-col items-center justify-center text-[#8C98A8] gap-2.5">
            <Loader2 className="w-6 h-6 animate-spin text-[#C86446]" />
            <span className="text-xs font-mono tracking-wider uppercase text-[#8C7B68]">
              Opening manila file folder...
            </span>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center text-[#A83820] text-xs font-mono bg-[#FDF0ED]">{errorMsg}</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 ledger-ruled">
            {/* Title & Status */}
            <div className="space-y-3 bg-[#FFFFFF]/90 p-4 rounded-xl border border-[#EAE0D2] paper-shadow-sm">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleUpdateTask}
                className="w-full font-editorial text-xl font-bold text-[#1E2229] bg-transparent border-b border-dashed border-[#DDD0BC] hover:border-[#C86446] focus:border-[#C86446] focus:bg-[#FAF7F2] rounded px-1.5 py-1 transition"
                placeholder="Task title..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-editorial font-bold text-[#4E4133] mb-1">
                    Phase Column Stamp
                  </label>
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                    className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-xs font-mono font-bold text-[#1E2229] focus:border-[#C86446] transition cursor-pointer"
                  >
                    <option value="todo">TO DO</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="done">COMPLETED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-editorial font-bold text-[#4E4133] mb-1">
                    Assigned Writer
                  </label>
                  <select
                    value={assignedToId}
                    onChange={(e) => {
                      setAssignedToId(e.target.value);
                      setTimeout(handleUpdateTask, 100);
                    }}
                    className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-xs font-medium text-[#1E2229] focus:border-[#C86446] transition cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => {
                      const isUserObj = typeof m.user === "object" && m.user !== null;
                      const uId = isUserObj ? m.user._id : String(m.user || "");
                      const uName = isUserObj ? (m.user.username || "user") : "user";
                      const fName = isUserObj ? (m.user.fullName || uName) : uName;
                      return (
                        <option key={uId} value={uId}>
                          {fName} (@{uName})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Description Memo */}
            <div className="bg-[#FFFFFF]/90 p-4 rounded-xl border border-[#EAE0D2] paper-shadow-sm">
              <label className="block text-[11px] font-editorial font-bold text-[#4E4133] mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleUpdateTask}
                placeholder="Task description, acceptance criteria, or reference notes..."
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-xs text-[#1E2229] placeholder-[#8C98A8] focus:border-[#C86446] focus:bg-[#FFFFFF] transition resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Subtasks Checklist (Legal Pad style) */}
            <div className="p-4 rounded-xl border border-[#E4D9C5] bg-[#FEFBF2] paper-shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#8C5E3A]" />
                  <h4 className="font-editorial text-xs font-bold text-[#2A2219] uppercase tracking-wider">
                    Checklist & Subtasks
                  </h4>
                </div>
                <span className="font-mono text-xs text-[#6A5A48] font-bold">
                  {completedSubtasks}/{totalSubtasks} completed ({progressPercent}%)
                </span>
              </div>

              {/* Progress meter */}
              <div className="w-full h-1.5 bg-[#EAE0CE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5B7553] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Items */}
              <div className="space-y-1.5 pt-1">
                {task?.subtasks && task.subtasks.length > 0 ? (
                  task.subtasks.map((st) => (
                    <div
                      key={st._id}
                      className="group flex items-center justify-between p-2.5 bg-[#FFFFFF] hover:bg-[#FAF7F0] border border-[#EAE0D2] rounded-xl text-xs transition"
                    >
                      <button
                        onClick={() => handleToggleSubtask(st)}
                        className="flex items-center gap-2.5 flex-1 text-left cursor-pointer"
                      >
                        {st.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#B5A694] hover:text-[#7A6C58] shrink-0" />
                        )}
                        <span
                          className={`truncate ${
                            st.isCompleted
                              ? "line-through text-[#8C98A8] italic"
                              : "text-[#1E2229] font-medium"
                          }`}
                        >
                          {st.title}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeleteSubtask(st._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#9A8B7A] hover:text-[#A63838] transition rounded"
                        title="Cross off checklist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#9A8B7A] italic py-1 font-editorial">
                    No checklist items added yet
                  </p>
                )}
              </div>

              {/* Add subtask */}
              <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a new checklist item..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#DDD3C4] rounded-xl text-xs text-[#1E2229] placeholder-[#8C98A8] focus:border-[#C86446] transition font-sans"
                />
                <button
                  type="submit"
                  disabled={submittingSubtask || !newSubtaskTitle.trim()}
                  className="px-3.5 py-2 bg-[#F2ECE0] hover:bg-[#E5DDCB] text-xs font-bold text-[#4E4133] border border-[#DDD0BC] rounded-xl transition disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer shrink-0 font-editorial"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tick Item
                </button>
              </form>
            </div>

            {/* Attachments Section */}
            {task?.attachments && task.attachments.length > 0 && (
              <div className="bg-[#FFFFFF]/90 p-4 rounded-xl border border-[#EAE0D2] paper-shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <ClipIcon className="w-4 h-4 text-[#8C5E3A]" />
                  <h4 className="font-editorial text-xs font-bold text-[#2A2219] uppercase tracking-wider">
                    Paperclipped Documents ({task.attachments.length})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {task.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD3C4] text-xs text-[#3E4F63] hover:text-[#1E2229] hover:bg-[#F2ECE0] flex items-center justify-between group transition"
                    >
                      <span className="truncate font-medium">{att.url.split("/").pop()}</span>
                      <span className="text-[10px] text-[#8C98A8] font-mono">
                        {(att.size / 1024).toFixed(1)} KB
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 px-6 border-t border-[#EAE0D2] bg-[#FAF7F0] flex items-center justify-between shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A83820] font-bold font-editorial">Delete this task permanently?</span>
              <button
                onClick={handleDeleteTask}
                className="px-3 py-1 text-xs font-bold bg-[#A63838] hover:bg-[#8D2B2B] text-white rounded-lg transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 text-xs font-medium bg-[#EFE8DC] hover:bg-[#E3D7C4] text-[#4E4133] rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#9A8B7A] hover:text-[#A63838] transition font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Task
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-[#4E4133] hover:bg-[#EFE8DC] border border-[#DDD3C4] rounded-xl transition cursor-pointer font-editorial"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
