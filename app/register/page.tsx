"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api-client";

import { WaxSeal } from "@/components/stationery/wax-seal";
import { Paperclip } from "@/components/stationery/paperclip";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/projects");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (username.trim().length < 3) {
      setErrorMsg("Username must be at least 3 characters.");
      return;
    }

    setLoading(true);

    try {
      await register({
        username: username.toLowerCase().trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      toast.success("Account Created!", "Welcome to Project Camp.");
      router.push("/projects");
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
          const firstError = Object.values(err.errors[0])[0];
          setErrorMsg(String(firstError));
        } else {
          setErrorMsg(err.message || "Registration failed.");
        }
      } else {
        setErrorMsg("Failed to connect to backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FBF9F5] text-[#1E2229]">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <WaxSeal monogram="PC" size="md" color="#C86446" />
          </div>
          <h1 className="font-editorial text-3xl font-black tracking-tight text-[#1E2229]">
            Project Camp
          </h1>
          <p className="text-xs text-[#6A788A] mt-1 font-sans">
            Set up your workspace account
          </p>
        </div>

        {/* Papercraft Card */}
        <div className="relative bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-7 sm:p-8 paper-shadow">
          {/* Decorative brass clip */}
          <div className="absolute -top-3.5 right-6 z-10">
            <Paperclip color="brass" size="md" rotation={8} />
          </div>

          <div className="mb-6">
            <h2 className="font-editorial text-xl font-bold text-[#1E2229]">
              Create an Account
            </h2>
            <p className="text-xs text-[#6A788A] mt-1 font-sans">
              Instant registration — get started immediately
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#FDF0F0] border border-[#F2C4C4] text-[#A63838] text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
                Username (min 3 characters)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="alexdoe"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs font-mono"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#9E907E] font-mono">@</span>
              </div>
            </div>

            <div>
              <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Doe"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
                />
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
              </div>
            </div>

            <div>
              <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
                />
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
              </div>
            </div>

            <div>
              <label className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#9E907E] hover:text-[#1E2229] transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-sm transition disabled:opacity-60 cursor-pointer border border-[#9A371F] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-[#6A788A] mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#C86446] hover:text-[#9A371F] font-bold font-editorial transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
