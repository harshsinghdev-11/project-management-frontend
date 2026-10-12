"use client";

import React, { useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

import { Paperclip } from "@/components/stationery/paperclip";
import { WaxSeal } from "@/components/stationery/wax-seal";

function ResetPasswordForm({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const unwrappedParams = use(params);
  const resetToken = unwrappedParams.token;
  const router = useRouter();
  const toast = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${resetToken}`, { newPassword });
      setIsSuccess(true);
      toast.success("Success", "Password reset successfully. You can now log in.");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || "Failed to reset password. Token may be invalid or expired.");
      } else {
        setErrorMsg("Failed to connect to the backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-5 sm:p-8 paper-shadow">
      {/* Decorative brass clip */}
      <div className="absolute -top-3.5 right-6 z-10 hidden xs:block">
        <Paperclip color="brass" size="sm" rotation={-10} />
      </div>

      {isSuccess ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EAF3E7] text-[#4E7545] border border-[#BCD4B7] mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-lg font-bold text-[#1E2229]">
            Password Reset Complete
          </h2>
          <p className="text-xs text-[#6A788A] mt-2">
            Your new password has been saved securely.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] transition border border-[#9A371F] shadow-sm"
            >
              Sign in with new password
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 sm:mb-6">
            <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#1E2229]">
              Set New Password
            </h2>
            <p className="text-xs text-[#6A788A] mt-1 font-sans">
              Enter your replacement password below
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#FDF0F0] border border-[#F2C4C4] text-[#A63838] text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
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
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-sm transition disabled:opacity-60 cursor-pointer border border-[#9A371F]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving new password...
                </>
              ) : (
                <>
                  Confirm Password Reset
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-3.5 sm:p-4 bg-[#FBF9F5] text-[#1E2229]">
      <div className="w-full max-w-md my-auto">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <WaxSeal monogram="PC" size="sm" color="#C86446" />
          </div>
          <h1 className="font-editorial text-2xl font-black tracking-tight text-[#1E2229]">
            Project Camp
          </h1>
        </div>

        <Suspense
          fallback={
            <div className="bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-8 flex items-center justify-center text-[#8C98A8] paper-shadow">
              <Loader2 className="w-6 h-6 animate-spin text-[#C86446]" />
            </div>
          }
        >
          <ResetPasswordForm params={params} />
        </Suspense>
      </div>
    </div>
  );
}
