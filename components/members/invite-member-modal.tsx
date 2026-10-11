"use client";

import React, { useState } from "react";
import { X, UserPlus, Mail, Shield, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { UserRole } from "@/types/api";
import { useToast } from "@/components/ui/toast";

interface InviteMemberModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

import { Paperclip } from "@/components/stationery/paperclip";

export function InviteMemberModal({
  projectId,
  isOpen,
  onClose,
  onMemberAdded,
}: InviteMemberModalProps) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      await api.post(`/projects/${projectId}/members`, {
        email: email.trim(),
        role,
      });

      toast.success("Member added", `${email} was added as ${role}.`);
      setEmail("");
      setRole("member");
      onMemberAdded();
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.statusCode === 404) {
          setErrorMsg("User with this email is not registered yet.");
        } else if (err.statusCode === 403) {
          setErrorMsg("Only project admins can add team members.");
        } else if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
          const first = Object.values(err.errors[0])[0];
          setErrorMsg(String(first));
        } else {
          setErrorMsg(err.message || "Failed to add member.");
        }
      } else {
        setErrorMsg("Failed to connect to backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#FAF7F0] border border-[#DDD3C4] rounded-2xl p-6 paper-shadow-lg">
        {/* Brass Paperclip accent */}
        <div className="absolute -top-3.5 right-6 z-10">
          <Paperclip color="brass" size="sm" rotation={-10} />
        </div>

        <div className="flex items-center justify-between pb-3.5 border-b border-[#DDD3C4] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#EFE6D6] rounded-xl text-[#7A4E2B] border border-[#DDD0BC] shadow-2xs">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-base font-bold text-[#1E2229]">
                Invite Team Member
              </h2>
              <p className="text-xs text-[#7A6B58]">
                Give a registered user access to this project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#968875] hover:text-[#1E2229] p-1.5 rounded-lg hover:bg-[#EFE8DC] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-[#FDF0F0] border border-[#F2C4C4] text-[#A63838] text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
              Member Email Address <span className="text-[#C86446]">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#DDD0BC] rounded-xl text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
              />
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
            </div>
            <p className="text-[11px] text-[#7A6B58] mt-1 font-mono">
              Note: User must already have a registered account.
            </p>
          </div>

          <div>
            <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
              Project Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("member")}
                className={`py-2 px-3 rounded-xl border text-xs font-editorial font-bold transition cursor-pointer text-center ${
                  role === "member"
                    ? "bg-[#FFFFFF] border-[#C86446] text-[#C86446] shadow-xs"
                    : "bg-[#EFE8DC] border-[#DDD0BC] text-[#6E5E4C] hover:bg-[#F5EFE4]"
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setRole("project_admin")}
                className={`py-2 px-3 rounded-xl border text-xs font-editorial font-bold transition cursor-pointer text-center ${
                  role === "project_admin"
                    ? "bg-[#FFFFFF] border-[#2C4258] text-[#2C4258] shadow-xs"
                    : "bg-[#EFE8DC] border-[#DDD0BC] text-[#6E5E4C] hover:bg-[#F5EFE4]"
                }`}
              >
                Project Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 px-3 rounded-xl border text-xs font-editorial font-bold transition cursor-pointer text-center ${
                  role === "admin"
                    ? "bg-[#FFFFFF] border-[#7A4E2B] text-[#7A4E2B] shadow-xs"
                    : "bg-[#EFE8DC] border-[#DDD0BC] text-[#6E5E4C] hover:bg-[#F5EFE4]"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-editorial font-bold text-[#6E5E4C] hover:text-[#1E2229] hover:bg-[#EFE8DC] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] rounded-xl shadow-sm border border-[#9A371F] disabled:opacity-50 transition cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Add to Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
