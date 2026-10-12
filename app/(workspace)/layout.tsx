"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { Loader2 } from "lucide-react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] text-[#7A6B58]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#C86446]" />
          <p className="text-xs font-mono tracking-wider uppercase text-[#8C7B68]">
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#FBF9F5] text-[#1E2229]">
      <Sidebar onOpenCreateProject={() => setShowCreateModal(true)} />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#FBF9F5]">
        {children}
      </main>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(project) => {
          setShowCreateModal(false);
          router.push(`/projects/${project._id}`);
        }}
      />
    </div>
  );
}
