import React from "react";

interface WaxSealProps {
  text?: string;
  monogram?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export function WaxSeal({
  text,
  monogram = "PC",
  size = "md",
  color,
  className = "",
}: WaxSealProps) {
  const displayText = text || monogram;
  const sizeMap = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
  };

  const bgStyle = color
    ? {
        background: `radial-gradient(circle at 35% 30%, ${color}, #8C2C15 100%)`,
        boxShadow: "0 2px 6px rgba(125, 38, 16, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.35), inset 0 -2px 3px rgba(0, 0, 0, 0.35)",
        border: "1.5px dashed rgba(255, 230, 220, 0.35)",
      }
    : {
        background: "radial-gradient(circle at 35% 30%, #DE6341, #B34426 65%, #7D2610 100%)",
        boxShadow: "0 2px 6px rgba(125, 38, 16, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.35), inset 0 -2px 3px rgba(0, 0, 0, 0.35)",
        border: "1.5px dashed rgba(255, 230, 220, 0.35)",
      };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-serif font-black tracking-widest text-[#FFF7F2] select-none shadow-md ${sizeMap[size]} ${className}`}
      style={bgStyle}
      title="Wax Seal Mark"
    >
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] font-editorial font-bold">{displayText}</span>
    </div>
  );
}
