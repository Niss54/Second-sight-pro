import React, { useEffect, useRef, useState } from "react";

export const InteractiveCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
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

    let rafId: number | null = null;
    let mouseX = -100;
    let mouseY = -100;

    const render = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX + 12}px, ${mouseY + 12}px, 0)`;
      }
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }

      // Check if hovering over element with data-cursor attribute
      const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      if (target) {
        const cursorText = target.getAttribute("data-cursor") || "view";
        setText(cursorText);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isPointerDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="cursor-bubble-follower"
      style={{
        top: 0,
        left: 0,
        opacity: isVisible ? 1 : 0,
        pointerEvents: "none",
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <span className="cursor-bubble-text">{text}</span>
    </div>
  );
};
