"use client";

import React, { useState } from "react";
import { X, FolderPlus, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { Project } from "@/types/api";
import { useToast } from "@/components/ui/toast";
import { Paperclip } from "@/components/stationery/paperclip";
import { Pushpin } from "@/components/stationery/pushpin";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (project: Project) => void;
}

export function CreateProjectModal({ isOpen, onClose, onCreated }: CreateProjectModalProps) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const newProject = await api.post<Project>("/projects", {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      toast.success("Project created", `"${newProject.name}" has been created.`);
      setName("");
      setDescription("");
      onCreated(newProject);
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
          const first = Object.values(err.errors[0])[0];
          setErrorMsg(String(first));
        } else {
          setErrorMsg(err.message || "Failed to create project");
        }
      } else {
        setErrorMsg("Failed to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-4 sm:p-6 paper-shadow-lg">
        {/* Pinned fastener accent */}
        <div className="absolute top-3 right-12 z-10 hidden sm:block">
          <Paperclip color="brass" size="sm" rotation={-12} />
        </div>

        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#EAE0D2] mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F6EFE5] rounded-xl text-[#7A4E2B] border border-[#E0D2C0]">
              <FolderPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-base sm:text-lg font-bold text-[#1E2229]">Create New Project</h2>
              <p className="text-[11px] sm:text-xs text-[#7A889B]">Set up a new workspace for your team</p>
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

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E3428] font-editorial mb-1.5">
              Project Name <span className="text-[#C86446]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Architecture Blueprint, Design System v2"
              className="w-full px-3.5 py-2 sm:py-2.5 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#8C98A8] focus:border-[#C86446] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#C86446] transition font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E3428] font-editorial mb-1.5">
              Project Description (optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key objectives, deliverables, or project notes..."
              className="w-full px-3.5 py-2 sm:py-2.5 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#8C98A8] focus:border-[#C86446] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#C86446] transition resize-none font-sans"
            />
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
              disabled={loading || !name.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#C86446] hover:bg-[#B34F34] rounded-xl shadow-md border border-[#9A371F] disabled:opacity-50 transition cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span className="font-editorial text-sm">Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
