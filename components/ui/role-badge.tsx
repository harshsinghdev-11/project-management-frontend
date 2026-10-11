import React from "react";
import { UserRole } from "@/types/api";

interface RoleBadgeProps {
  role: UserRole;
  size?: "sm" | "md";
  className?: string;
}

export function RoleBadge({ role, size = "md", className = "" }: RoleBadgeProps) {
  const configs: Record<UserRole, { label: string; bg: string; text: string; border: string; angle: string }> = {
    admin: {
      label: "ADMIN",
      bg: "bg-[#FDF0EC]",
      text: "text-[#A83820]",
      border: "border-[#EAA896]",
      angle: "-rotate-1",
    },
    project_admin: {
      label: "LEAD",
      bg: "bg-[#EEF4F9]",
      text: "text-[#1E4263]",
      border: "border-[#A8C7E2]",
      angle: "rotate-1",
    },
    member: {
      label: "MEMBER",
      bg: "bg-[#F4EFE6]",
      text: "text-[#586370]",
      border: "border-[#D8CEBC]",
      angle: "rotate-0",
    },
  };

  const config = configs[role] || configs.member;
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center font-mono font-bold tracking-widest uppercase rounded border ${config.bg} ${config.text} ${config.border} ${padding} shadow-xs select-none ${config.angle} transition-transform hover:rotate-0 ${className}`}
      style={{
        borderWidth: "1.2px",
      }}
    >
      {config.label}
    </span>
  );
}
