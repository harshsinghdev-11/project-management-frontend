"use client";

import React, { useState } from "react";

interface AvatarProps {
  name?: string;
  url?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const paperColors = [
  "bg-[#EFE8DC] text-[#4A3B2C] border-[#D6C7B2]",
  "bg-[#F3DC9B] text-[#5C4512] border-[#D9BD71]",
  "bg-[#D8E6D3] text-[#294524] border-[#B9CCA4]",
  "bg-[#F4C8BA] text-[#592618] border-[#DF9F8D]",
  "bg-[#D4E3EF] text-[#1E3A52] border-[#ABC5DC]",
  "bg-[#E5DCD3] text-[#3D3328] border-[#C8B8A6]",
];

function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getColor(name?: string): string {
  if (!name) return paperColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % paperColors.length;
  return paperColors[index];
}

const sizeClasses = {
  xs: "w-5 h-5 text-[9px]",
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-xs",
  lg: "w-11 h-11 text-sm",
};

export function UserAvatarView({ name, url, size = "md", className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const color = getColor(name);
  const sizeClass = sizeClasses[size];

  const isValidUrl = url && !url.includes("placehold.co") && !imageError;

  if (isValidUrl) {
    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 border border-[#D5C9B5] shadow-xs ${sizeClass} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={name || "User avatar"}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-mono font-bold shrink-0 select-none border shadow-xs ${color} ${sizeClass} ${className}`}
      title={name}
      style={{
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.7), 0 1px 2px rgba(40,30,20,0.12)",
      }}
    >
      {initials}
    </div>
  );
}
