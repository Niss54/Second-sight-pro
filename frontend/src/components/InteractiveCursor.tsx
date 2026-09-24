import React, { useEffect, useState } from "react";

export const InteractiveCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [text, setText] = useState<string>("click");
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    // Only enable on devices that have a precise pointer (mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsPointerDevice(true);
    } else {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over element with data-cursor attribute
      const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      if (target) {
        setText(target.getAttribute("data-cursor") || "view");
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isPointerDevice) return null;

  return (
    <div
      className="cursor-bubble-follower"
      style={{
        left: `${position.x + 14}px`,
        top: `${position.y + 14}px`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1) rotate(-4deg)" : "scale(0.5) rotate(0deg)",
      }}
      aria-hidden="true"
    >
      <span className="cursor-bubble-text">{text}</span>
    </div>
  );
};
