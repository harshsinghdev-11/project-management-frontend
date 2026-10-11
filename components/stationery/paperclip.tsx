import React from "react";

interface PaperclipProps {
  color?: "brass" | "silver" | "copper";
  size?: "sm" | "md" | "lg";
  className?: string;
  rotation?: number;
}

export function Paperclip({
  color = "brass",
  size = "md",
  className = "",
  rotation = 0,
}: PaperclipProps) {
  const colorMap = {
    brass: {
      wire: "#C6963E",
      highlight: "#E6BA68",
      shadow: "#7D581A",
    },
    silver: {
      wire: "#9CA7B5",
      highlight: "#D4DCE6",
      shadow: "#5B6675",
    },
    copper: {
      wire: "#B86646",
      highlight: "#DF8E6D",
      shadow: "#6E3621",
    },
  };

  const c = colorMap[color];

  const sizeMap = {
    sm: { width: 14, height: 32 },
    md: { width: 18, height: 42 },
    lg: { width: 22, height: 52 },
  };

  const s = sizeMap[size];

  return (
    <div
      className={`inline-block select-none pointer-events-none drop-shadow-sm ${className}`}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      aria-hidden="true"
    >
      <svg
        width={s.width}
        height={s.height}
        viewBox="0 0 24 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shadow under clip */}
        <path
          d="M12 4C7.5 4 4 7.5 4 12V44C4 48.5 7.5 52 12 52C16.5 52 20 48.5 20 44V16C20 12.5 17.5 10 14.5 10C11.5 10 9 12.5 9 16V40C9 41.5 10.2 43 12 43C13.8 43 15 41.5 15 40V18"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="3.2"
          strokeLinecap="round"
          transform="translate(1, 1.5)"
        />
        {/* Main wire body */}
        <path
          d="M12 4C7.5 4 4 7.5 4 12V44C4 48.5 7.5 52 12 52C16.5 52 20 48.5 20 44V16C20 12.5 17.5 10 14.5 10C11.5 10 9 12.5 9 16V40C9 41.5 10.2 43 12 43C13.8 43 15 41.5 15 40V18"
          stroke={c.wire}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Wire metallic highlight shine */}
        <path
          d="M11 5C8 5 5.5 7.5 5.5 12V43"
          stroke={c.highlight}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M19 18V44C19 47 16.5 50.5 12 50.5"
          stroke={c.highlight}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}
