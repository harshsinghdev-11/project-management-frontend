"use client";

import React from "react";
import { Pushpin } from "@/components/stationery/pushpin";
import { FolderPlus, CheckSquare, Rocket } from "lucide-react";

export function WorkflowSection() {
  const steps = [
    {
      num: "01",
      icon: <FolderPlus className="w-5 h-5 text-[#8C5E3A]" />,
      pinColor: "red" as const,
      title: "Open Your Workspace",
      description:
        "Sign up in under 10 seconds. Create your first project workspace with zero complex configuration or credit cards required.",
    },
    {
      num: "02",
      icon: <CheckSquare className="w-5 h-5 text-[#8C5E3A]" />,
      pinColor: "brass" as const,
      title: "Pin Tasks & Milestones",
      description:
        "Draft tasks on tactile index cards. Attach checklists, assign teammates, and schedule your 4-phase sprint roadmap.",
    },
    {
      num: "03",
      icon: <Rocket className="w-5 h-5 text-[#8C5E3A]" />,
      pinColor: "sage" as const,
      title: "Ship with Clarity",
      description:
        "Watch cards move across To Do, In Progress, and Done. Keep your team aligned and celebrate finished milestones without digital fatigue.",
    },
  ];

  return (
    <section id="workflow" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C6C57] font-bold block mb-2">
          FRICTIONLESS ONBOARDING
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl font-black text-[#1E2229] tracking-tight">
          From zero to sprint in three steps.
        </h2>
        <p className="text-sm text-[#5E6B7C] mt-2 font-sans leading-relaxed">
          No mandatory onboarding flows or multi-day configuration. Your workspace is ready the instant you sign in.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="relative p-7 rounded-2xl bg-[#FFFFFF] border border-[#DDD3C4] paper-shadow paper-lift transition flex flex-col justify-between overflow-visible"
          >
            {/* Pinned pushpin in top-center */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <Pushpin color={step.pinColor} size="md" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-black text-[#CFC2AF]">
                  {step.num}
                </span>
                <div className="p-2 bg-[#F6EFE5] rounded-xl border border-[#E0D2C0]">
                  {step.icon}
                </div>
              </div>

              <h3 className="font-editorial text-lg font-bold text-[#1E2229] mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-[#5E6B7C] leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-[#DDD0BC] text-[11px] font-mono text-[#8C7D6B]">
              Step {idx + 1} of 3
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
