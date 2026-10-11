"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  FolderKanban,
  Shield,
  Users,
  Layers,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { RoleBadge } from "@/components/ui/role-badge";
import { api } from "@/lib/api-client";
import { extractProject, NormalizedProject } from "@/lib/project-utils";
import { Paperclip } from "@/components/stationery/paperclip";
import { Pushpin } from "@/components/stationery/pushpin";
import { WaxSeal } from "@/components/stationery/wax-seal";


export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<NormalizedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "member">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const rawData = await api.get<any[]>("/projects");
      if (Array.isArray(rawData)) {
        const parsed = rawData
          .map(extractProject)
          .filter((p): p is NormalizedProject => p !== null);
        setProjects(parsed);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all"
          ? true
          : roleFilter === "admin"
          ? item.role === "admin" || item.role === "project_admin"
          : item.role === "member";

      return matchesSearch && matchesRole;
    });
  }, [projects, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    const total = projects.length;
    const adminCount = projects.filter((p) => p.role === "admin" || p.role === "project_admin").length;
    const totalMembers = projects.reduce((acc, p) => acc + p.members, 0);
    return { total, adminCount, totalMembers };
  }, [projects]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9F5]">
      <Header
        breadcrumbs={[{ label: "Projects" }]}
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#FFFFFF] bg-[#C86446] hover:bg-[#B34F34] shadow-md transition cursor-pointer select-none border border-[#9A371F]"
            style={{
              boxShadow: "0 2px 6px rgba(180, 60, 30, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="font-editorial text-[13px]">New Project</span>
          </button>
        }
      />

      <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-7">
        {/* Modular Metric Cards Strip (Layered Stationery Notes with Pins & Clips) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Active Projects (Pinned 3x5 index note) */}
          <div className="relative p-5 rounded-2xl bg-[#FFFFFF] border border-[#DDD3C4] paper-shadow paper-lift overflow-visible">
            <div className="absolute -top-3.5 right-6 z-10">
              <Pushpin color="red" size="sm" rotation={15} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#7C6C57] px-2 py-0.5 rounded border border-[#E0D5C3] bg-[#F7F2E8]">
                Note 01
              </span>
            </div>
            <p className="font-editorial text-2xl font-black text-[#1E2229]">
              {stats.total}
            </p>
            <p className="text-xs text-[#6A788A] mt-1 font-medium">
              Active Projects in workspace
            </p>
          </div>

          {/* Card 2: Admin & Lead Roles (Clipped Kraft Tag) */}
          <div className="relative p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BD] paper-shadow paper-lift overflow-visible">
            <div className="absolute -top-3 right-5 z-10">
              <Paperclip color="brass" size="sm" rotation={-8} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A5E1A] px-2 py-0.5 rounded border border-[#EAD59E] bg-[#FEF7E6]">
                Note 02
              </span>
            </div>
            <p className="font-editorial text-2xl font-black text-[#1E2229]">
              {stats.adminCount}
            </p>
            <p className="text-xs text-[#6A788A] mt-1 font-medium">
              Administrative & Lead Roles
            </p>
          </div>

          {/* Card 3: Collaborators Network (Lined Linen Ledger) */}
          <div className="relative p-5 rounded-2xl bg-[#FFFFFF] border border-[#DDD3C4] paper-shadow paper-lift overflow-visible">
            <div className="absolute -top-3 right-5 z-10">
              <Paperclip color="silver" size="sm" rotation={10} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#3B6234] px-2 py-0.5 rounded border border-[#C6DCBF] bg-[#EEF6EB]">
                Note 03
              </span>
            </div>
            <p className="font-editorial text-2xl font-black text-[#1E2229]">
              {stats.totalMembers}
            </p>
            <p className="text-xs text-[#6A788A] mt-1 font-medium">
              Team Members across all projects
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#8A7966]" />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] border border-[#DDD3C4] rounded-xl text-xs text-[#1E2229] placeholder-[#8C98A8] focus:border-[#C86446] focus:ring-1 focus:ring-[#C86446] transition paper-shadow-sm font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Role Filter Tabs */}
            <div className="flex items-center p-1 bg-[#EFE8DC] border border-[#D8CABE] rounded-xl text-xs shadow-inner">
              <button
                onClick={() => setRoleFilter("all")}
                className={`px-3 py-1 rounded-lg font-editorial font-bold transition cursor-pointer ${
                  roleFilter === "all"
                    ? "bg-[#FFFFFF] text-[#1E2229] paper-shadow-sm"
                    : "text-[#6C5D4B] hover:text-[#1E2229]"
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setRoleFilter("admin")}
                className={`px-3 py-1 rounded-lg font-editorial font-bold transition cursor-pointer ${
                  roleFilter === "admin"
                    ? "bg-[#FFFFFF] text-[#1E2229] paper-shadow-sm"
                    : "text-[#6C5D4B] hover:text-[#1E2229]"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setRoleFilter("member")}
                className={`px-3 py-1 rounded-lg font-editorial font-bold transition cursor-pointer ${
                  roleFilter === "member"
                    ? "bg-[#FFFFFF] text-[#1E2229] paper-shadow-sm"
                    : "text-[#6C5D4B] hover:text-[#1E2229]"
                }`}
              >
                Member
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-[#EFE8DC] border border-[#D8CABE] rounded-xl text-xs shadow-inner">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#FFFFFF] text-[#1E2229] paper-shadow-sm"
                    : "text-[#7C6C57] hover:text-[#1E2229]"
                }`}
                title="Project Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#FFFFFF] text-[#1E2229] paper-shadow-sm"
                    : "text-[#7C6C57] hover:text-[#1E2229]"
                }`}
                title="List View"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-[#FAF7F0] border border-[#E3D8C8] animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E8DDCC]" />
                  <div className="w-3/4 h-5 rounded bg-[#E8DDCC]" />
                  <div className="w-full h-3 rounded bg-[#EFE5D7]" />
                </div>
                <div className="w-1/3 h-3 rounded bg-[#EFE5D7]" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 px-6 text-center rounded-2xl border-2 border-dashed border-[#DDD0BC] bg-[#F7F2E8]/60 paper-shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EFE4D2] text-[#8C5E3A] border border-[#DACBB5] mb-3">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#1E2229]">
              {searchQuery ? "No matching projects found" : "No projects in workspace"}
            </h3>
            <p className="text-xs text-[#6A788A] mt-1.5 max-w-sm mx-auto">
              {searchQuery
                ? `No project matched "${searchQuery}". Try a different search term or filter.`
                : "Create your first project to begin organizing tasks, tracking progress, and collaborating with your team."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-md transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="font-editorial text-sm">Create First Project</span>
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((item) => (
              <ProjectCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          /* Ruled Ledger Table */
          <div className="rounded-2xl border border-[#DDD3C4] bg-[#FFFFFF] paper-shadow overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F4EC] text-[#5A4D3D] border-b-2 border-[#DDD0BC] font-editorial font-bold text-xs">
                <tr>
                  <th className="py-3 px-5">Project Name</th>
                  <th className="py-3 px-5">Description</th>
                  <th className="py-3 px-5">Your Role</th>
                  <th className="py-3 px-5">Team Members</th>
                  <th className="py-3 px-5 text-right font-mono text-[11px]">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7DA] ledger-ruled">
                {filteredProjects.map((item) => {
                  const dateStr = new Date(item.createdAt).toLocaleDateString();
                  return (
                    <tr
                      key={item._id}
                      onClick={() => router.push(`/projects/${item._id}`)}
                      className="hover:bg-[#FAF7F0] transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-5 font-editorial font-bold text-sm text-[#1E2229] group-hover:text-[#A83820]">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-5 text-[#5E6B7C] max-w-xs truncate">
                        {item.description || "—"}
                      </td>
                      <td className="py-3.5 px-5">
                        <RoleBadge role={item.role} size="sm" />
                      </td>
                      <td className="py-3.5 px-5 text-[#6A788A] font-mono">
                        {item.members} {item.members === 1 ? "member" : "members"}
                      </td>
                      <td className="py-3.5 px-5 text-right text-[#8A7966] font-mono text-[11px]">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(project) => {
          setShowCreateModal(false);
          router.push(`/projects/${project._id}`);
        }}
      />
    </div>
  );
}
