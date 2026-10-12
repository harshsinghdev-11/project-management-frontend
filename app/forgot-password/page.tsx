"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

import { Paperclip } from "@/components/stationery/paperclip";
import { WaxSeal } from "@/components/stationery/wax-seal";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Request Sent", "Password reset instructions have been dispatched.");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || "Failed to process reset request.");
      } else {
        setErrorMsg("Failed to connect to the backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

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

        <div className="relative bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-5 sm:p-8 paper-shadow">
          {/* Decorative brass clip */}
          <div className="absolute -top-3.5 right-6 z-10 hidden xs:block">
            <Paperclip color="brass" size="sm" rotation={-10} />
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#7A6B58] hover:text-[#1E2229] transition mb-5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>

          {submitted ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EAF3E7] text-[#4E7545] border border-[#BCD4B7] mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-editorial text-lg font-bold text-[#1E2229]">
                Instructions Sent
              </h2>
              <p className="text-xs text-[#6A788A] mt-2 leading-relaxed">
                If an account exists for <span className="text-[#1E2229] font-mono font-bold">{email}</span>, password reset instructions have been sent to your inbox.
              </p>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] transition border border-[#9A371F] shadow-sm"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 sm:mb-6">
                <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#1E2229]">
                  Reset Password
                </h2>
                <p className="text-xs text-[#6A788A] mt-1 font-sans">
                  Enter your registered email to receive a password reset link
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
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
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
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
