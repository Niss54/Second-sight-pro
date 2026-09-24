import React from "react";

interface AmbientParticlesProps {
  count?: number;
  className?: string;
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ count = 16, className = "" }) => {
  // Deterministic positions to avoid hydration mismatch
  const particles = Array.from({ length: count }, (_, i) => {
    const left = ((i * 19 + 7) % 94) + 3;
    const top = ((i * 29 + 13) % 90) + 5;
    const size = ((i * 3) % 6) + 4;
    const delay = (i * 0.4).toFixed(1);
    const duration = (((i % 3) + 2) * 1.2).toFixed(1);
    const colors = [
      "var(--color-orange, #f5693c)",
      "var(--teal, #0d7c73)",
      "var(--color-pink, #f0befa)",
      "var(--color-lightblue, #82a0ff)",
      "var(--color-lightgreen, #a3e635)"
    ];
    const color = colors[i % colors.length];

    return { id: i, left, top, size, delay, duration, color };
  });

  return (
    <div className={`particles-container ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
