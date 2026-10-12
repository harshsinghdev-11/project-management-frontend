"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Project, UserRole } from "@/types/api";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

interface ProjectSettingsTabProps {
  project: Project;
  currentUserRole?: UserRole;
  onProjectUpdated: (updated: Project) => void;
}

export function ProjectSettingsTab({
  project,
  currentUserRole,
  onProjectUpdated,
}: ProjectSettingsTabProps) {
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAdmin = currentUserRole === "admin";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setErrorMsg(null);
    setIsSaving(true);

    try {
      const updated = await api.put<Project>(`/projects/${project._id}`, {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      toast.success("Project updated", "General details saved successfully.");
      onProjectUpdated(updated);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || "Failed to update project");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirmText !== project.name) return;

    setIsDeleting(true);
    try {
      await api.delete(`/projects/${project._id}`);
      toast.success("Project deleted", `"${project.name}" has been removed.`);
      router.replace("/projects");
    } catch (err: any) {
      toast.error("Failed to delete project", err?.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6">
      {/* General Settings */}
      <div className="bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-4 sm:p-6 paper-shadow">
        <div className="flex items-center gap-2.5 mb-1">
          <Settings className="w-4 h-4 text-[#8C5E3A]" />
          <h3 className="font-editorial text-base font-bold text-[#1E2229]">
            Project Settings
          </h3>
        </div>
        <p className="text-xs text-[#6A788A] mb-4 sm:mb-5">
          Update project name and general description
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-[#FDF0F0] border border-[#F2C4C4] text-[#A63838] text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              disabled={!isAdmin}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 sm:py-2.5 bg-[#FCFAF5] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] disabled:opacity-60 focus:border-[#C86446] focus:outline-hidden transition shadow-2xs font-editorial font-bold"
            />
          </div>

          <div>
            <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
              Project Description
            </label>
            <textarea
              rows={3}
              disabled={!isAdmin}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 sm:py-2.5 bg-[#FCFAF5] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] disabled:opacity-60 focus:border-[#C86446] focus:outline-hidden transition resize-none shadow-2xs font-sans"
            />
          </div>

          {isAdmin && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving || !name.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer border border-[#9A371F]"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone (Admin Only) */}
      {isAdmin && (
        <div className="bg-[#FDF3F3] border border-[#F2C4C4] rounded-2xl p-4 sm:p-6 paper-shadow-sm">
          <div className="flex items-center gap-2 text-[#A63838] mb-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <h3 className="font-editorial text-sm font-bold">Danger Zone</h3>
          </div>
          <p className="text-xs text-[#7A5050] mb-4 leading-relaxed">
            Deleting this project will permanently remove all associated tasks, checklists, member assignments, and timeline history.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-editorial font-bold text-[#A63838] bg-[#FFFFFF] hover:bg-[#FBEAEA] border border-[#E8AAAA] rounded-xl transition cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Project
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FAF7F0] border border-[#DDD3C4] rounded-2xl p-4 sm:p-6 paper-shadow-lg">
            <h3 className="font-editorial text-base font-bold text-[#A63838] mb-2">
              Confirm Project Deletion
            </h3>
            <p className="text-xs text-[#5E6B7C] mb-4">
              This action cannot be undone. To confirm permanent deletion, type{" "}
              <span className="font-mono font-bold text-[#1E2229] bg-[#EFE8DC] px-1.5 py-0.5 rounded border border-[#DDD0BC]">
                {project.name}
              </span>{" "}
              below:
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={project.name}
              className="w-full px-3.5 py-2 bg-[#FFFFFF] border border-[#DDD0BC] rounded-xl text-base sm:text-xs text-[#1E2229] mb-4 focus:border-[#A63838] focus:outline-hidden font-mono shadow-2xs"
            />

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                className="px-3.5 py-1.5 text-xs font-editorial font-bold text-[#6E5E4C] hover:bg-[#EFE8DC] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== project.name || isDeleting}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-editorial font-bold text-white bg-[#A63838] hover:bg-[#8F2E2E] rounded-xl disabled:opacity-50 transition cursor-pointer border border-[#8F2E2E] shadow-xs"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
