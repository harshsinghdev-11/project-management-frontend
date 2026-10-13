"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  Plus,
  LogOut,
  KeyRound,
  PanelLeftClose,
  PanelLeftOpen,
  Feather,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { UserAvatarView } from "@/components/ui/avatar";
import { ChangePasswordModal } from "@/components/auth/change-password-modal";
import { api } from "@/lib/api-client";
import { extractProject, NormalizedProject } from "@/lib/project-utils";
import { WaxSeal } from "@/components/stationery/wax-seal";
import { Paperclip } from "@/components/stationery/paperclip";
import { TornEdgeVertical } from "@/components/stationery/torn-edge";

interface SidebarProps {
  onOpenCreateProject?: () => void;
}

export function Sidebar({ onOpenCreateProject }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [recentProjects, setRecentProjects] = useState<NormalizedProject[]>([]);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Fetch projects for sidebar shortcuts
  useEffect(() => {
    let mounted = true;
    async function fetchShortcuts() {
      if (!user) return;
      try {
        const rawData = await api.get<any[]>("/projects");
        if (mounted && Array.isArray(rawData)) {
          const parsed = rawData
            .map(extractProject)
            .filter((p): p is NormalizedProject => p !== null);
          setRecentProjects(parsed.slice(0, 6));
        }
      } catch {
        // Ignore
      }
    }
    fetchShortcuts();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      {/* MOBILE TOP NAVBAR (Visible only on < md screens) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden w-full bg-[#ECE3D4] border-b border-[#D9CDB8] shadow-xs select-none z-30 shrink-0"
      >
        <div className="flex items-center justify-between h-14 px-3.5 sm:px-4">
          {/* Brand Logo & Name */}
          <Link
            href="/projects"
            className="flex items-center gap-2.5 min-w-0 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <WaxSeal text="PC" size="sm" />
            <div className="min-w-0">
              <span className="block text-sm sm:text-base font-bold tracking-tight text-[#1E2229] font-editorial truncate group-hover:text-[#A83820] transition">
                Project Camp
              </span>
              <span className="block text-[9px] text-[#7A6A55] font-mono tracking-widest uppercase truncate -mt-0.5">
                Workspace
              </span>
            </div>
          </Link>

          {/* Mobile Top Actions: New Project & Menu Toggle */}
          <div className="flex items-center gap-1.5">
            {onOpenCreateProject && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateProject();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-xs transition cursor-pointer border border-[#9A371F]"
                title="New Project"
                aria-label="New Project"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">New</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#5C4F3F] hover:text-[#1E2229] hover:bg-[#DDD0BE] transition cursor-pointer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              title={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#A83820]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#D9CDB8] bg-[#FAF7F0] p-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
            {/* Main Navigation Links */}
            <div className="space-y-1">
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  pathname === "/projects" || pathname === "/dashboard"
                    ? "bg-[#FFFFFF] text-[#1E2229] border border-[#D5C6AF] paper-shadow font-editorial text-[13px]"
                    : "text-[#5C4F3F] hover:text-[#1E2229] hover:bg-[#EAE0D0]"
                }`}
              >
                <FolderKanban className="w-4 h-4 shrink-0 text-[#8C5E3A]" />
                <span>All Projects</span>
              </Link>
            </div>

            {/* Active Projects List */}
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7C6C57]">
                  Active Projects ({recentProjects.length})
                </span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {recentProjects.length === 0 ? (
                  <p className="px-2 py-1 text-[11px] text-[#8C7D6B] italic font-editorial">
                    No projects found
                  </p>
                ) : (
                  recentProjects.map((p) => {
                    const isActive = pathname.startsWith(`/projects/${p._id}`);
                    return (
                      <Link
                        key={p._id}
                        href={`/projects/${p._id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                          isActive
                            ? "bg-[#FFFFFF] text-[#1E2229] font-bold border border-[#D0BFAB] paper-shadow"
                            : "text-[#5A4D3D] hover:text-[#1E2229] hover:bg-[#EAE0D0]"
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded border border-[#DACDB9] bg-[#EAE0D0] text-[#695A47]">
                          {p.members} {p.members === 1 ? "mbr" : "mbrs"}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* User Profile & Security Strip */}
            <div className="pt-3 border-t border-[#DCD0BE] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <UserAvatarView
                  name={user?.fullName || user?.username}
                  url={user?.avatar?.url}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1E2229] truncate font-editorial leading-tight">
                    {user?.fullName || user?.username || "User"}
                  </p>
                  <p className="text-[10px] text-[#7A6C58] truncate font-mono">
                    @{user?.username || "user"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowPasswordModal(true);
                  }}
                  className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg text-[11px] font-medium text-[#5C4F3F] hover:text-[#1E2229] hover:bg-[#E2D6C3] border border-[#DDD0BC] transition cursor-pointer"
                  title="Change Password"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#7C6C57]" />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg text-[11px] font-medium text-[#A63838] hover:text-[#7A1E1E] hover:bg-[#F4DCDA] border border-[#EAC2C0] transition cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#A63838]" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* DESKTOP ASIDE SIDEBAR (Visible on md: and above) */}
      <aside
        className={`hidden md:flex relative flex-col shrink-0 h-screen bg-[#ECE3D4] border-r border-[#D9CDB8] shadow-md transition-all duration-200 select-none z-20 book-spine-stitch ${
          isCollapsed ? "w-16" : "w-64"
        }`}
        style={{
          boxShadow: "2px 0 10px rgba(45, 30, 15, 0.08)",
        }}
      >
        {/* Raw Torn Deckle-Paper Right Border */}
        <TornEdgeVertical />

        {/* Workspace Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#D8CABE] bg-[#E5DBCA]/60">
          {!isCollapsed && (
            <Link href="/projects" className="flex items-center gap-3 min-w-0 group">
              <WaxSeal text="PC" size="md" />
              <div className="min-w-0">
                <span className="block text-base font-bold tracking-tight text-[#1E2229] font-editorial truncate group-hover:text-[#A83820] transition">
                  Project Camp
                </span>
                <span className="block text-[10px] text-[#7A6A55] font-mono tracking-widest uppercase truncate">
                  Project Workspace
                </span>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <div className="flex items-center justify-center w-full">
              <WaxSeal text="PC" size="sm" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-[#7C6C57] hover:text-[#1E2229] hover:bg-[#DDD0BE] transition cursor-pointer ${
              isCollapsed ? "hidden" : "block"
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle when collapsed */}
        {isCollapsed && (
          <div className="p-2 flex justify-center border-b border-[#D8CABE]">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-lg text-[#7C6C57] hover:text-[#1E2229] hover:bg-[#DDD0BE] transition cursor-pointer"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Rail */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4">
          <div className="space-y-1">
            <Link
              href="/projects"
              className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                pathname === "/projects" || pathname === "/dashboard"
                  ? "bg-[#FCFAF5] text-[#1E2229] border border-[#D5C6AF] paper-shadow font-editorial text-[13px]"
                  : "text-[#5C4F3F] hover:text-[#1E2229] hover:bg-[#E2D6C3]"
              }`}
              title="All Projects"
            >
              {(pathname === "/projects" || pathname === "/dashboard") && !isCollapsed && (
                <div className="absolute -top-3 right-3 z-10">
                  <Paperclip color="brass" size="sm" rotation={-10} />
                </div>
              )}
              <FolderKanban className="w-4 h-4 shrink-0 text-[#8C5E3A]" />
              {!isCollapsed && <span>Projects</span>}
            </Link>
          </div>

          {/* Active Projects Index Card Stack */}
          {!isCollapsed && (
            <div className="pt-2">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7C6C57]">
                  Active Projects
                </span>
                {onOpenCreateProject && (
                  <button
                    onClick={onOpenCreateProject}
                    className="p-1 rounded-md text-[#7C6C57] hover:text-[#1E2229] hover:bg-[#D9CCB8] transition cursor-pointer"
                    title="New Project"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {recentProjects.length === 0 ? (
                  <p className="px-2 py-1 text-[11px] text-[#8C7D6B] italic font-editorial">
                    No projects found
                  </p>
                ) : (
                  recentProjects.map((p) => {
                    const isActive = pathname.startsWith(`/projects/${p._id}`);
                    return (
                      <Link
                        key={p._id}
                        href={`/projects/${p._id}`}
                        className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition group ${
                          isActive
                            ? "bg-[#FFFFFF] text-[#1E2229] font-bold border border-[#D0BFAB] paper-shadow"
                            : "text-[#5A4D3D] hover:text-[#1E2229] hover:bg-[#E0D4C0]"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute -top-3 right-1 z-10">
                            <Paperclip color="silver" size="sm" rotation={5} />
                          </div>
                        )}
                        <span className="truncate">{p.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded border border-[#DACDB9] bg-[#EAE0D0] text-[#695A47]">
                          {p.members}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ink Reservoir Health Status */}
       


        {/* User Card Footer */}
        <div className="p-3 border-t border-[#D8CABE] bg-[#E7DDD0]">
          <div className="flex items-center gap-2.5 p-1 rounded-xl">
            <UserAvatarView
              name={user?.fullName || user?.username}
              url={user?.avatar?.url}
              size={isCollapsed ? "sm" : "md"}
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1E2229] truncate font-editorial leading-tight">
                  {user?.fullName || user?.username || "User"}
                </p>
                <p className="text-[10px] text-[#7A6C58] truncate font-mono">
                  @{user?.username || "user"}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 pt-2 border-t border-[#D6C7B2]">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] text-[#5C4F3F] hover:text-[#1E2229] hover:bg-[#D9CCB8] transition cursor-pointer font-medium"
                title="Change Password"
              >
                <KeyRound className="w-3 h-3 text-[#7C6C57]" />
                Security
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] text-[#A63838] hover:text-[#7A1E1E] hover:bg-[#F4DCDA] transition cursor-pointer font-medium"
                title="Log out"
              >
                <LogOut className="w-3 h-3 text-[#A63838]" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Security Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
