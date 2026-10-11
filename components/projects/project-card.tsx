import React from "react";
import Link from "next/link";
import { Users, Calendar, ArrowUpRight, Folder, FileText } from "lucide-react";
import { extractProject, NormalizedProject } from "@/lib/project-utils";
import { RoleBadge } from "@/components/ui/role-badge";
import { Paperclip } from "@/components/stationery/paperclip";

interface ProjectCardProps {
  item: any;
}

export function ProjectCard({ item }: ProjectCardProps) {
  const project: NormalizedProject | null = extractProject(item);

  if (!project) return null;

  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/projects/${project._id}`}
      className="group relative flex flex-col justify-between p-5 pt-6 bg-[#FFFFFF] hover:bg-[#FCFBF8] border border-[#DDD3C4] rounded-2xl paper-shadow paper-lift transition-all duration-150 select-none overflow-visible"
      style={{
        boxShadow: "0 1px 3px rgba(45, 35, 20, 0.05), 0 5px 14px rgba(45, 35, 20, 0.07)",
      }}
    >
      {/* Manila folder tab shape at top left */}
      <div
        className="absolute top-0 left-4 h-2.5 w-20 rounded-b-md bg-[#ECE2D0] border-x border-b border-[#D8CABE]"
        aria-hidden="true"
      />

      {/* Brass paperclip attached to card corner */}
      <div className="absolute -top-2.5 right-5 z-10">
        <Paperclip color="brass" size="sm" rotation={-8} />
      </div>

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2 rounded-xl bg-[#F4EFE6] border border-[#E0D5C3] text-[#7A4E2B] group-hover:text-[#A83820] transition">
            <Folder className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 pr-6">
            <RoleBadge role={project.role} size="sm" />
          </div>
        </div>

        <h3 className="font-editorial text-lg font-bold text-[#1E2229] group-hover:text-[#C86446] transition truncate leading-snug">
          {project.name}
        </h3>
        <p className="text-xs text-[#5E6B7C] mt-1.5 line-clamp-2 leading-relaxed min-h-[2rem]">
          {project.description || "No project description provided."}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-[#DDD0BC] text-xs text-[#6A788A] font-mono">
        <div className="flex items-center gap-1.5" title="Team members count">
          <Users className="w-3.5 h-3.5 text-[#8A7966]" />
          <span>{project.members} {project.members === 1 ? "member" : "members"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#8A7966]" title="Created date">
          <Calendar className="w-3 h-3" />
          <span className="text-[11px]">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
