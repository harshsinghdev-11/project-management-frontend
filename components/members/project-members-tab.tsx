"use client";

import React, { useState } from "react";
import { UserPlus, Shield, Trash2, Calendar, Loader2 } from "lucide-react";
import { ProjectMemberDetail, UserRole } from "@/types/api";
import { UserAvatarView } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/role-badge";
import { InviteMemberModal } from "@/components/members/invite-member-modal";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

interface ProjectMembersTabProps {
  projectId: string;
  members: ProjectMemberDetail[];
  currentUserRole?: UserRole;
  currentUserId?: string;
  onRefreshMembers: () => void;
}

export function ProjectMembersTab({
  projectId,
  members,
  currentUserRole,
  currentUserId,
  onRefreshMembers,
}: ProjectMembersTabProps) {
  const toast = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const isAdmin = currentUserRole === "admin";

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingUserId(userId);
      await api.put(`/projects/${projectId}/members/${userId}`, { newRole });
      toast.success("Role updated", `Member role changed to ${newRole}`);
      onRefreshMembers();
    } catch (err: any) {
      toast.error("Failed to update role", err?.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRemoveMember = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to remove @${username} from this project?`)) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      await api.delete(`/projects/${projectId}/members/${userId}`);
      toast.success("Member removed", `@${username} has been removed.`);
      onRefreshMembers();
    } catch (err: any) {
      toast.error("Failed to remove member", err?.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD3C4]">
        <div>
          <h3 className="font-editorial text-lg font-bold text-[#1E2229]">
            Team Members ({members.length})
          </h3>
          <p className="text-xs text-[#6A788A] mt-0.5">
            Registered team members with access to this project
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-sm transition cursor-pointer select-none border border-[#9A371F]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite Member
          </button>
        )}
      </div>

      {/* Members Table */}
      <div className="rounded-2xl border border-[#DDD3C4] bg-[#FFFFFF] paper-shadow overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[580px] w-full text-left text-xs">
            <thead className="bg-[#FAF7F0] text-[#7A6B58] border-b border-[#DDD3C4] font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
                {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC]">
              {members.map((m, idx) => {
                const isUserObj = typeof m.user === "object" && m.user !== null;
                const userId = isUserObj ? m.user._id : String(m.user || `member-${idx}`);
                const username = isUserObj ? (m.user.username || "user") : "user";
                const fullName = isUserObj ? (m.user.fullName || username) : username;
                const avatarUrl = isUserObj ? m.user.avatar?.url : undefined;
                const isSelf = userId === currentUserId;
                const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—";

                return (
                  <tr key={userId} className="hover:bg-[#FCFAF5] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <UserAvatarView
                          name={fullName}
                          url={avatarUrl}
                          size="sm"
                        />
                        <div>
                          <div className="font-editorial font-bold text-[#1E2229] flex items-center gap-1.5 text-[13px]">
                            <span>{fullName}</span>
                            {isSelf && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F4EDE2] text-[#8C5E3A] font-mono border border-[#DFD3C0]">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#7E8A9B] font-mono">
                            @{username}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isAdmin && !isSelf ? (
                        <select
                          value={m.role || "member"}
                          disabled={updatingUserId === userId}
                          onChange={(e) => handleRoleChange(userId, e.target.value as UserRole)}
                          className="bg-[#FCFAF5] border border-[#DDD0BC] rounded-lg px-2.5 py-1 text-xs text-[#1E2229] font-mono focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
                        >
                          <option value="member">Member</option>
                          <option value="project_admin">Project Admin</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <RoleBadge role={m.role || "member"} size="sm" />
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#6A788A] font-mono text-[11px]">
                      {dateStr}
                    </td>

                    {isAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleRemoveMember(userId, username)}
                            disabled={updatingUserId === userId}
                            className="p-1.5 rounded-lg text-[#A6B1C0] hover:text-[#A63838] hover:bg-[#FDF0F0] border border-transparent hover:border-[#F2C4C4] transition disabled:opacity-50 cursor-pointer"
                            title="Remove from project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <InviteMemberModal
        projectId={projectId}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onMemberAdded={onRefreshMembers}
      />
    </div>
  );
}
