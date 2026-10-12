"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api-client";

import { WaxSeal } from "@/components/stationery/wax-seal";
import { Paperclip } from "@/components/stationery/paperclip";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/projects";

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [authLoading, isAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login({ email, password });
      toast.success("Welcome back!", "Signed in to Project Camp.");
      router.push(redirectUrl);
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
          const firstError = Object.values(err.errors[0])[0];
          setErrorMsg(String(firstError));
        } else {
          setErrorMsg(err.message || "Failed to log in.");
        }
      } else {
        setErrorMsg("Failed to connect to the server. Ensure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-5 sm:p-8 paper-shadow">
      {/* Brass Paperclip accent */}
      <div className="absolute -top-3.5 right-6 z-10 hidden xs:block">
        <Paperclip color="brass" size="md" rotation={-10} />
      </div>

      <div className="mb-5 sm:mb-6">
        <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#1E2229]">
          Sign in to your account
        </h2>
        <p className="text-xs text-[#6A788A] mt-1 font-sans">
          Enter your credentials to access your projects
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
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
            />
            <Mail className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block font-editorial text-xs font-bold text-[#4E4133]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#C86446] hover:text-[#9A371F] font-medium transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-base sm:text-sm text-[#1E2229] placeholder-[#9E907E] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
            />
            <Lock className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 p-1 text-[#9E907E] hover:text-[#1E2229] transition cursor-pointer"
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
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-3.5 sm:p-4 bg-[#FBF9F5] text-[#1E2229]">
      <div className="w-full max-w-md my-auto">
        {/* Brand header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <WaxSeal monogram="PC" size="md" color="#C86446" />
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-black tracking-tight text-[#1E2229]">
            Project Camp
          </h1>
          <p className="text-xs text-[#6A788A] mt-1 font-sans">
            Tactile project & sprint management
          </p>
        </div>

        <Suspense
          fallback={
            <div className="bg-[#FFFFFF] border border-[#DDD3C4] rounded-2xl p-8 flex items-center justify-center text-[#8C98A8] paper-shadow">
              <Loader2 className="w-6 h-6 animate-spin text-[#C86446]" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Footer link */}
        <p className="text-center text-xs text-[#6A788A] mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#C86446] hover:text-[#9A371F] font-bold font-editorial transition"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
