import React from "react";

export const SpinningStar: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 32,
  color = "#f5693c",
  className = ""
}) => {
  return (
    <div className={`sticker-star-wrap ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="sticker-star-svg"
        style={{ width: "100%", height: "100%", color }}
      >
        <path
          d="M27 0L30.8 20.2L51 24L30.8 27.8L27 48L23.2 27.8L3 24L23.2 20.2L27 0Z"
          fill="currentColor"
        />
        <circle cx="27" cy="24" r="5" fill="#ffffff" />
      </svg>
    </div>
  );
};

export const WobblySmiley: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = ""
}) => {
  return (
    <div className={`sticker-smiley-wrap ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="sticker-smiley-svg"
        style={{ width: "100%", height: "100%" }}
      >
        <circle cx="24" cy="24" r="22" fill="#fef08a" stroke="#111111" strokeWidth="2.5" />
        <ellipse cx="17" cy="19" rx="3" ry="4" fill="#111111" />
        <ellipse cx="31" cy="19" rx="3" ry="4" fill="#111111" />
        <path
          d="M14 28C16.5 35 31.5 35 34 28"
          stroke="#111111"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="26" r="2.5" fill="#f472b6" opacity="0.6" />
        <circle cx="36" cy="26" r="2.5" fill="#f472b6" opacity="0.6" />
      </svg>
    </div>
  );
};

export const HandDrawnUnderline: React.FC<{ color?: string; className?: string }> = ({
  color = "var(--color-orange, #f5693c)",
  className = ""
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 20"
      fill="none"
      className={`hand-drawn-underline-svg ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 14C55 5 130 3 205 7C245 9 295 12 318 6C275 14 200 17 145 15C100 13 40 16 12 18"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HandDrawnOval: React.FC<{ color?: string; className?: string }> = ({
  color = "var(--color-pink, #f0befa)",
  className = ""
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 70"
      fill="none"
      className={`hand-drawn-oval-svg ${className}`}
      aria-hidden="true"
    >
      <path
        d="M15 35C15 18 45 6 85 6C130 6 152 20 152 35C152 52 118 64 78 64C35 64 8 50 8 35C8 22 25 12 55 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const NeoPill: React.FC<{
  label: string;
  theme?: "orange" | "green" | "pink" | "blue" | "yellow";
  className?: string;
  tilt?: number;
}> = ({ label, theme = "orange", className = "", tilt = 0 }) => {
  return (
    <span
      className={`neo-pill neo-pill--${theme} ${className}`}
      style={{ transform: tilt !== 0 ? `rotate(${tilt}deg)` : undefined }}
    >
      {label}
    </span>
  );
};
