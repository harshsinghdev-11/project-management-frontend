import React from "react";
import { TaskStatus } from "@/types/api";

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = "md", showDot = true, className = "" }: StatusBadgeProps) {
  const configs: Record<TaskStatus, { label: string; bg: string; text: string; dot: string; border: string; stampAngle: string }> = {
    todo: {
      label: "To Do",
      bg: "bg-[#F5EFE6]",
      text: "text-[#5A6472]",
      dot: "bg-[#8A95A5]",
      border: "border-[#D8CABE]",
      stampAngle: "-rotate-1",
    },
    in_progress: {
      label: "In Progress",
      bg: "bg-[#FDF7E7]",
      text: "text-[#A86E12]",
      dot: "bg-[#D69336]",
      border: "border-[#EAD397]",
      stampAngle: "rotate-1",
    },
    done: {
      label: "Done",
      bg: "bg-[#EEF5EC]",
      text: "text-[#3D6336]",
      dot: "bg-[#5B7553]",
      border: "border-[#C1D9BA]",
      stampAngle: "-rotate-1",
    },
  };

  const config = configs[status] || configs.todo;
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold tracking-wider uppercase rounded border ${config.bg} ${config.text} ${config.border} ${padding} shadow-xs select-none ${config.stampAngle} transition-transform hover:rotate-0 ${className}`}
      style={{
        borderStyle: "dashed",
        borderWidth: "1.2px",
      }}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />}
      <span>{config.label}</span>
    </span>
  );
}
