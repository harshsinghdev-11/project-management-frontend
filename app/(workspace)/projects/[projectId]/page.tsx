"use client";

import React, { useState, useEffect, use, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Kanban,
  List as ListIcon,
  Users,
  Settings,
  Plus,
  UserPlus,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskListView } from "@/components/tasks/task-list-view";
import { TimelineMatrix } from "@/components/tasks/timeline-matrix";
import { ProjectMembersTab } from "@/components/members/project-members-tab";
import { ProjectSettingsTab } from "@/components/projects/project-settings-tab";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { InviteMemberModal } from "@/components/members/invite-member-modal";
import { RoleBadge } from "@/components/ui/role-badge";
import { api, ApiError } from "@/lib/api-client";
import { Project, ProjectMemberDetail, Task, TaskStatus, UserRole } from "@/types/api";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { Paperclip } from "@/components/stationery/paperclip";

function ProjectWorkspaceContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.projectId;

  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<"board" | "list" | "members" | "settings">("board");
  const [showRoadmap, setShowRoadmap] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMemberDetail[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createTaskInitialStatus, setCreateTaskInitialStatus] = useState<TaskStatus>("todo");
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Fetch all project data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Parallel fetching: project details, members, tasks
      const [projData, membersData, tasksData] = await Promise.all([
        api.get<any>(`/projects/${projectId}`),
        api.get<any>(`/projects/${projectId}/members`),
        api.get<any>(`/tasks/${projectId}`).catch(() => [] as Task[]),
      ]);

      const unwrappedProject = projData?.project || projData;
      setProject(unwrappedProject);
      setMembers(Array.isArray(membersData) ? membersData : membersData?.members || []);
      setTasks(Array.isArray(tasksData) ? tasksData : tasksData?.tasks || []);
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.statusCode === 404 || err.statusCode === 400) {
          setErrorMsg("Project not found or you do not have permission to view this project.");
        } else {
          setErrorMsg(err.message || "Failed to load project");
        }
      } else {
        setErrorMsg("Failed to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Determine current user's role in this project safely
  const currentMember = members.find((m) => {
    const mUserId = typeof m?.user === "object" && m?.user !== null ? m.user._id : String(m?.user || "");
    return mUserId === user?._id;
  });
  const currentUserRole: UserRole = currentMember?.role || "member";
  const canManageProject = currentUserRole === "admin";

  // Fast status move handler
  const handleMoveTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.put(`/tasks/${projectId}/t/${taskId}`, { status: newStatus });
      toast.success("Status updated", `Moved to ${newStatus.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update status");
      loadData(); // Revert
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9F5]">
        <Header breadcrumbs={[{ label: "Loading..." }]} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-[#8C98A8] gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#C86446]" />
          <span className="text-xs font-mono tracking-widest uppercase text-[#8C7B68]">
            Loading project...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg || !project) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9F5]">
        <Header breadcrumbs={[{ label: "Project Not Found" }]} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div className="p-3 rounded-2xl bg-[#FDF0ED] border border-[#EAA896] text-[#A83820] mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-xl font-bold text-[#1E2229]">Project Unavailable</h2>
          <p className="text-xs text-[#6A788A] mt-1.5 mb-6">{errorMsg || "Project does not exist."}</p>
          <button
            onClick={() => router.push("/projects")}
            className="px-5 py-2 bg-[#F2ECE0] hover:bg-[#E5DDCB] text-xs font-bold text-[#4E4133] border border-[#DDD0BC] rounded-xl transition cursor-pointer font-editorial"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9F5]">
      <Header
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: project.name },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setCreateTaskInitialStatus("todo");
                setCreateTaskOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-md transition cursor-pointer select-none border border-[#9A371F]"
              style={{
                boxShadow: "0 2px 6px rgba(180, 60, 30, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="font-editorial text-[13px]">New Task</span>
            </button>
          </div>
        }
      />

      {/* Project Banner & Tab Navigation */}
      <div className="px-6 md:px-8 pt-6 pb-0 bg-[#FAF7F0] border-b border-[#DDD3C4]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-editorial text-2xl md:text-3xl font-black text-[#1E2229] tracking-tight">
                {project.name}
              </h1>
              <RoleBadge role={currentUserRole} size="sm" />
            </div>
            {project.description && (
              <p className="text-xs text-[#5E6B7C] mt-1.5 max-w-3xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Tactile "Roadmap" Switch Button */}
            <button
              onClick={() => setShowRoadmap(!showRoadmap)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-editorial font-bold border transition cursor-pointer select-none shadow-xs ${
                showRoadmap
                  ? "bg-[#FFFFFF] border-[#C86446]/40 text-[#1E2229]"
                  : "bg-[#EFE8DC] border-[#DDD0BC] text-[#6E5E4C] hover:bg-[#F5EFE4]"
              }`}
              title="Toggle sprint roadmap overview banner"
            >
              <Calendar className={`w-3.5 h-3.5 ${showRoadmap ? "text-[#C86446]" : "text-[#8C5E3A]"}`} />
              <span>Roadmap</span>
              {/* Physical sliding toggle switch */}
              <div
                className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                  showRoadmap ? "bg-[#C86446] justify-end" : "bg-[#CFC2AF] justify-start"
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
              </div>
            </button>

            {canManageProject && (
              <button
                onClick={() => setInviteMemberOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFFFF] hover:bg-[#F8F4EC] border border-[#DDD3C4] rounded-xl text-xs font-medium text-[#4A3D2D] transition cursor-pointer paper-shadow-sm font-editorial font-bold"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#8C5E3A]" />
                Invite Team
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Overview Banner Above Workspace Tabs */}
        {showRoadmap && (
          <div className="mb-4 animate-in fade-in duration-200">
            <TimelineMatrix
              tasks={tasks}
              onSelectTask={(task) => setSelectedTaskId(task._id)}
              isOpen={showRoadmap}
              onToggle={() => setShowRoadmap(!showRoadmap)}
            />
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 text-xs select-none">
          <button
            onClick={() => setActiveTab("board")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-editorial font-bold transition cursor-pointer border-t border-x ${
              activeTab === "board"
                ? "bg-[#FFFFFF] text-[#1E2229] border-[#DDD3C4] shadow-xs translate-y-[1px]"
                : "bg-[#EFE8DC] text-[#6E5E4C] border-[#DDD0BC] hover:bg-[#F5EFE4] hover:text-[#1E2229]"
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-[#8C5E3A]" />
            Board
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAE0D0] font-mono text-[#584835]">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-editorial font-bold transition cursor-pointer border-t border-x ${
              activeTab === "list"
                ? "bg-[#FFFFFF] text-[#1E2229] border-[#DDD3C4] shadow-xs translate-y-[1px]"
                : "bg-[#EFE8DC] text-[#6E5E4C] border-[#DDD0BC] hover:bg-[#F5EFE4] hover:text-[#1E2229]"
            }`}
          >
            <ListIcon className="w-3.5 h-3.5 text-[#8C5E3A]" />
            List View
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-editorial font-bold transition cursor-pointer border-t border-x ${
              activeTab === "members"
                ? "bg-[#FFFFFF] text-[#1E2229] border-[#DDD3C4] shadow-xs translate-y-[1px]"
                : "bg-[#EFE8DC] text-[#6E5E4C] border-[#DDD0BC] hover:bg-[#F5EFE4] hover:text-[#1E2229]"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#8C5E3A]" />
            Team Members
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAE0D0] font-mono text-[#584835]">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-editorial font-bold transition cursor-pointer border-t border-x ${
              activeTab === "settings"
                ? "bg-[#FFFFFF] text-[#1E2229] border-[#DDD3C4] shadow-xs translate-y-[1px]"
                : "bg-[#EFE8DC] text-[#6E5E4C] border-[#DDD0BC] hover:bg-[#F5EFE4] hover:text-[#1E2229]"
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-[#8C5E3A]" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === "board" && (
          <KanbanBoard
            tasks={tasks}
            onSelectTask={(task) => setSelectedTaskId(task._id)}
            onOpenCreateTask={(status) => {
              setCreateTaskInitialStatus(status);
              setCreateTaskOpen(true);
            }}
            onMoveTaskStatus={handleMoveTaskStatus}
          />
        )}

        {activeTab === "list" && (
          <TaskListView
            tasks={tasks}
            onSelectTask={(task) => setSelectedTaskId(task._id)}
            onMoveTaskStatus={handleMoveTaskStatus}
          />
        )}

        {activeTab === "members" && (
          <ProjectMembersTab
            projectId={projectId}
            members={members}
            currentUserRole={currentUserRole}
            currentUserId={user?._id}
            onRefreshMembers={loadData}
          />
        )}

        {activeTab === "settings" && (
          <ProjectSettingsTab
            project={project}
            currentUserRole={currentUserRole}
            onProjectUpdated={(updated) => setProject(updated)}
          />
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        projectId={projectId}
        members={members}
        initialStatus={createTaskInitialStatus}
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onTaskCreated={(newTask) => {
          setTasks((prev) => [newTask, ...prev]);
        }}
      />

      {/* Manila Case File Task Detail Modal */}
      <TaskDetailModal
        projectId={projectId}
        taskId={selectedTaskId}
        members={members}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdated={loadData}
        onTaskDeleted={(deletedId) => {
          setTasks((prev) => prev.filter((t) => t._id !== deletedId));
          setSelectedTaskId(null);
        }}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal
        projectId={projectId}
        isOpen={inviteMemberOpen}
        onClose={() => setInviteMemberOpen(false)}
        onMemberAdded={loadData}
      />
    </div>
  );
}

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#8C98A8] bg-[#FBF9F5]">
          <Loader2 className="w-6 h-6 animate-spin text-[#C86446]" />
        </div>
      }
    >
      <ProjectWorkspaceContent params={params} />
    </Suspense>
  );
}
