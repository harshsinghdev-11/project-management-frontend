"use client";

import React, { useState, useRef, useEffect } from "react";
import { Circle, Clock, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { ProjectStatus, UserRole } from "@/types/api";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  projectId?: string;
  currentUserRole?: UserRole;
  onStatusChanged?: (newStatus: ProjectStatus) => void;
  size?: "sm" | "md";
  className?: string;
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  todo: {
    label: "To Do",
    bg: "bg-[#F5EFE6]",
    text: "text-[#705F4D]",
    border: "border-[#DFD3C2]",
    icon: Circle,
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-[#FDF1ED]",
    text: "text-[#C86446]",
    border: "border-[#F2CEBF]",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    bg: "bg-[#EDF5EB]",
    text: "text-[#2D6A4F]",
    border: "border-[#C5DEC0]",
    icon: CheckCircle2,
  },
};

export function ProjectStatusBadge({
  status,
  projectId,
  currentUserRole,
  onStatusChanged,
  size = "md",
  className = "",
}: ProjectStatusBadgeProps) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ProjectStatus>(status);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Security & UX: strictly only admin role can modify project status
  const isAdmin = currentUserRole === "admin";
  const canChangeStatus = Boolean(isAdmin && projectId);

  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.todo;
  const Icon = config.icon;

  const handleStatusSelect = async (
    e: React.MouseEvent,
    newStatus: ProjectStatus
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (newStatus === currentStatus || !projectId) {
      setIsOpen(false);
      return;
    }

    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    setIsOpen(false);
    setIsUpdating(true);
    onStatusChanged?.(newStatus);

    try {
      await api.put(`/projects/${projectId}`, { status: newStatus });
      toast.success(
        "Status updated",
        `Project marked as ${STATUS_CONFIG[newStatus].label}.`
      );
    } catch (err: any) {
      // Rollback on failure
      setCurrentStatus(previousStatus);
      onStatusChanged?.(previousStatus);
      const msg = err instanceof ApiError ? err.message : "Failed to update status";
      toast.error("Status update failed", msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const padding =
    size === "sm"
      ? "px-2 py-0.5 text-[10px]"
      : "px-2.5 py-1 text-xs";
  const iconSize = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";

  // If read-only (not admin or no projectId)
  if (!canChangeStatus) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono font-bold tracking-wide uppercase rounded-md border ${config.bg} ${config.text} ${config.border} ${padding} select-none ${className}`}
        style={{ borderWidth: "1.2px" }}
        title={`Status: ${config.label}`}
      >
        <Icon className={iconSize} />
        <span>{config.label}</span>
      </span>
    );
  }

  // Interactive for Admins
  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
      onClick={(e) => {
        // Prevent parent links from navigating when clicking the status changer
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        type="button"
        disabled={isUpdating}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`inline-flex items-center gap-1.5 font-mono font-bold tracking-wide uppercase rounded-md border ${config.bg} ${config.text} ${config.border} ${padding} transition hover:shadow-xs active:scale-98 cursor-pointer select-none`}
        style={{ borderWidth: "1.2px" }}
        title="Admin: Click to change project status"
      >
        {isUpdating ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : (
          <Icon className={iconSize} />
        )}
        <span>{config.label}</span>
        <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-1.5 w-40 rounded-xl bg-[#FFFFFF] border border-[#DDD3C4] shadow-lg z-50 py-1.5 paper-shadow-lg animate-in fade-in zoom-in-95 duration-100"
          style={{
            boxShadow:
              "0 4px 16px rgba(45, 35, 20, 0.12), 0 1px 3px rgba(45, 35, 20, 0.08)",
          }}
        >
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#8A7966] border-b border-[#F0E8DD] mb-1">
            Change Status
          </div>
          {(["todo", "in_progress", "completed"] as ProjectStatus[]).map((st) => {
            const itemConf = STATUS_CONFIG[st];
            const ItemIcon = itemConf.icon;
            const isSelected = st === currentStatus;

            return (
              <button
                key={st}
                type="button"
                onClick={(e) => handleStatusSelect(e, st)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition font-sans cursor-pointer ${
                  isSelected
                    ? "bg-[#FAF5ED] font-bold text-[#1E2229]"
                    : "text-[#586370] hover:bg-[#F6EFE5] hover:text-[#1E2229]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">{itemConf.label}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C86446]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
