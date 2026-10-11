import React from "react";

interface PushpinProps {
  color?: "red" | "brass" | "sage" | "navy";
  size?: "sm" | "md";
  className?: string;
  rotation?: number;
}

export function Pushpin({
  color = "red",
  size = "md",
  className = "",
  rotation = 0,
}: PushpinProps) {
  const colorMap = {
    red: {
      head: "#C24128",
      headHighlight: "#E26952",
      headShadow: "#7D2211",
    },
    brass: {
      head: "#C6963E",
      headHighlight: "#E6BA68",
      headShadow: "#7D581A",
    },
    sage: {
      head: "#526E4A",
      headHighlight: "#75966B",
      headShadow: "#30442B",
    },
    navy: {
      head: "#24394E",
      headHighlight: "#415C77",
      headShadow: "#14212E",
    },
  };

  const c = colorMap[color];
  const sizePx = size === "sm" ? 18 : 24;

  return (
    <div
      className={`inline-block select-none pointer-events-none drop-shadow-md ${className}`}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      aria-hidden="true"
    >
      <svg
        width={sizePx}
        height={sizePx}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft ground shadow */}
        <ellipse cx="14" cy="19" rx="6" ry="2.5" fill="rgba(0,0,0,0.18)" />

        {/* Needle metal tip */}
        <polygon points="12,12 11,21 13,12" fill="#8896A6" />
        <line x1="12" y1="12" x2="12" y2="21" stroke="#CAD4DF" strokeWidth="0.8" />

        {/* Pin base rim */}
        <ellipse cx="12" cy="11.5" rx="5" ry="2" fill={c.headShadow} />

        {/* Pin body bulb */}
        <path
          d="M8.5 7.5C8.5 5 10 3.5 12 3.5C14 3.5 15.5 5 15.5 7.5C15.5 9 14.5 10.5 12 11C9.5 10.5 8.5 9 8.5 7.5Z"
          fill={c.head}
        />

        {/* Pin highlight bubble */}
        <ellipse cx="10.5" cy="5.8" rx="2" ry="1.2" fill={c.headHighlight} opacity="0.9" />
      </svg>
    </div>
  );
}
