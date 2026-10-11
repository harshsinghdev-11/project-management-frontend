import React from "react";

export function TornEdgeVertical({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute top-0 right-[-6px] bottom-0 w-[6px] overflow-hidden pointer-events-none select-none z-20 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-full w-[6px]"
        preserveAspectRatio="none"
        viewBox="0 0 6 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0 L2 4 L0.5 8 L3 13 L1 18 L2.5 24 L0 29 L2 35 L0.8 41 L3 47 L1.2 53 L2.5 59 L0.5 65 L2.8 71 L1 77 L2.5 83 L0.5 89 L3 94 L1 100 L0 100 Z"
          fill="#ECE3D4"
        />
        {/* Shadow line along tear */}
        <path
          d="M2 4 L0.5 8 L3 13 L1 18 L2.5 24 L0 29 L2 35 L0.8 41 L3 47 L1.2 53 L2.5 59 L0.5 65 L2.8 71 L1 77 L2.5 83 L0.5 89 L3 94 L1 100"
          stroke="rgba(80, 60, 40, 0.18)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}
