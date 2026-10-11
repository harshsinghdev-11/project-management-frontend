# Side-by-Side Code Examples: AI Slop vs. Crafted Code

This document provides concrete before-and-after code transformations illustrating common frontend AI slop patterns and their human-crafted solutions.

---

## Example 1: The Interactive Card

### ❌ AI Slop Implementation
```tsx
// ❌ AI Slop: Glowing gradient, unlabelled icon button, arbitrary padding, missing keyboard support
export function ProjectCard({ project, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="p-[23px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          {project.name}
        </h3>
        {/* Unlabelled icon button, no keyboard tab support */}
        <div onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}>
          <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </div>
      </div>
      <p className="text-gray-400 text-sm">{project.description}</p>
      <div className="mt-4 flex gap-2">
        <span className="text-[11px] px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
          Supercharged Sprints
        </span>
      </div>
    </div>
  );
}
```

### ✅ Human-Crafted Implementation
```tsx
// ✅ Crafted: Systematic tokens, physical tactile metaphor, semantic accessible markup, keyboard support
import Link from "next/link";
import { Folder, Users, Calendar, Trash2 } from "lucide-react";
import { Paperclip } from "@/components/stationery/paperclip";
import { RoleBadge } from "@/components/ui/role-badge";

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description?: string;
    role: "admin" | "project_admin" | "member";
    members: number;
    createdAt: string;
  };
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative flex flex-col justify-between p-5 pt-6 bg-[#FFFFFF] hover:bg-[#FCFBF8] border border-[#DDD3C4] rounded-2xl paper-shadow paper-lift transition-all select-none overflow-hidden">
      {/* Decorative brass paperclip */}
      <div className="absolute -top-2.5 right-5 z-10">
        <Paperclip color="brass" size="sm" rotation={-8} />
      </div>

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2 rounded-xl bg-[#F4EFE6] border border-[#E0D5C3] text-[#7A4E2B] group-hover:text-[#A83820] transition">
            <Folder className="w-4 h-4" />
          </div>
          <RoleBadge role={project.role} size="sm" />
        </div>

        <Link href={`/projects/${project._id}`} className="block focus:outline-hidden focus:underline">
          <h3 className="font-editorial text-lg font-bold text-[#1E2229] group-hover:text-[#A83820] transition truncate leading-snug">
            {project.name}
          </h3>
        </Link>
        <p className="text-xs text-[#5E6B7C] mt-1.5 line-clamp-2 leading-relaxed min-h-[2rem]">
          {project.description || "No project description provided."}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-[#DDD0BC] text-xs text-[#6A788A] font-mono">
        <div className="flex items-center gap-1.5" title="Team member count">
          <Users className="w-3.5 h-3.5 text-[#8A7966]" />
          <span>{project.members} {project.members === 1 ? "member" : "members"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#8A7966]" title="Created date">
          <Calendar className="w-3 h-3" />
          <span className="text-[11px]">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
```

---

## Example 2: The Accessible Form Field

### ❌ AI Slop Implementation
```tsx
// ❌ AI Slop: Missing labels, no autocomplete, generic alert, swallowed error
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      await fetch('/api/login', { body: JSON.stringify({ email, password }) });
      alert("Logged in!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <input 
        placeholder="Enter email"
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        placeholder="Enter password"
        type="password"
        onChange={e => setPassword(e.target.value)} 
      />
      <div onClick={submit}>Login</div>
    </div>
  );
}
```

### ✅ Human-Crafted Implementation
```tsx
// ✅ Crafted: Semantic <form>, explicit <label>, autocomplete, show password toggle, typed feedback
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";

export function LoginForm() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Welcome back!", "Signed in to your workspace.");
    } catch (err: any) {
      toast.error("Failed to sign in", err?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
          Email address
        </label>
        <div className="relative">
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-sm text-[#1E2229] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
          />
          <Mail className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="block font-editorial text-xs font-bold text-[#4E4133] mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-9 pr-10 py-2.5 bg-[#FAF7F0] border border-[#DDD0BC] rounded-xl text-sm text-[#1E2229] focus:border-[#C86446] focus:outline-hidden transition shadow-2xs"
          />
          <Lock className="w-4 h-4 absolute left-3 top-3 text-[#9E907E]" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-[#9E907E] hover:text-[#1E2229] transition cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !email.trim() || !password}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] shadow-sm transition disabled:opacity-60 cursor-pointer border border-[#9A371F]"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
      </button>
    </form>
  );
}
```
