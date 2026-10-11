import React from "react";

interface WashiTapeProps {
  color?: "cream" | "ochre" | "sage" | "terracotta" | "linen";
  width?: number | string;
  className?: string;
  rotation?: number;
}

export function WashiTape({
  color = "ochre",
  width = 90,
  className = "",
  rotation = -2,
}: WashiTapeProps) {
  const colorMap = {
    cream: "bg-[#F7EFE1]/85 border-[#E2D2B8]/80 text-[#6D5A40]",
    ochre: "bg-[#F3DC9B]/85 border-[#DABF73]/80 text-[#7A5E1A]",
    sage: "bg-[#D8E6D3]/85 border-[#BDCEB7]/80 text-[#3A5235]",
    terracotta: "bg-[#F3C4B6]/85 border-[#DC9E8C]/80 text-[#6B2F1F]",
    linen: "bg-[#EAE2D5]/85 border-[#CFC3B0]/80 text-[#544837]",
  };

  const styleClass = colorMap[color] || colorMap.ochre;

  return (
    <div
      className={`relative inline-block h-5 select-none pointer-events-none border-y shadow-xs backdrop-blur-[1px] ${styleClass} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        transform: `rotate(${rotation}deg)`,
        clipPath: "polygon(0 0, 96% 1px, 100% 4px, 98% 8px, 100% 12px, 96% 16px, 100% 100%, 4% 99%, 0 94%, 3% 90%, 0 84%, 4% 80%, 0 0)",
      }}
      aria-hidden="true"
    >
      {/* Subtle fiber line texture */}
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.12)_5px)]" />
    </div>
  );
}
