"use client";

import React, { useState } from "react";
import { X, Lock, KeyRound, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api-client";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { Paperclip } from "@/components/stationery/paperclip";

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { changePassword } = useAuth();
  const toast = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({ oldPassword, newPassword });
      toast.success("Credentials Updated", "Your security password has been updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || "Failed to update security credentials");
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FAF7F0] border border-[#DDD3C4] rounded-2xl p-4 sm:p-6 paper-shadow-lg">
        {/* Brass Paperclip accent */}
        <div className="absolute -top-3.5 right-6 z-10 hidden sm:block">
          <Paperclip color="brass" size="sm" rotation={-12} />
        </div>

        <div className="flex items-center justify-between pb-3 sm:pb-3.5 border-b border-[#DDD3C4] mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#EFE6D6] rounded-xl text-[#7A4E2B] border border-[#DDD0BC] shadow-2xs">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-sm sm:text-base font-bold text-[#1E2229] leading-tight">
                Change Password
              </h2>
              <p className="text-[11px] sm:text-xs text-[#7A6B58] font-normal">
                Update your account login password
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

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 sm:py-2.5 bg-[#FFFFFF] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#A6B1C0] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs font-sans"
              />
              <Lock className="w-4 h-4 absolute right-3.5 top-2.5 sm:top-3 text-[#A6B1C0]" />
            </div>
          </div>

          <div>
            <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 sm:py-2.5 bg-[#FFFFFF] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#A6B1C0] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs font-sans"
              />
              <Lock className="w-4 h-4 absolute right-3.5 top-2.5 sm:top-3 text-[#A6B1C0]" />
            </div>
          </div>

          <div>
            <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 sm:py-2.5 bg-[#FFFFFF] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#A6B1C0] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs font-sans"
              />
              <Lock className="w-4 h-4 absolute right-3.5 top-2.5 sm:top-3 text-[#A6B1C0]" />
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
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] rounded-xl shadow-sm border border-[#9A371F] disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
