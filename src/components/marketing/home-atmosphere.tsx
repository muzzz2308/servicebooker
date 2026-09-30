"use client";

import { useEffect, useRef } from "react";

export function HomeAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) {
        return;
      }

      const { clientX, clientY } = event;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        node.style.setProperty("--mx", `${clientX}px`);
        node.style.setProperty("--my", `${clientY}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] hidden lg:block"
      style={{
        background:
          "radial-gradient(520px circle at var(--mx, 70%) var(--my, 30%), rgba(139, 154, 109, 0.12), transparent 55%)",
      }}
      aria-hidden
    />
  );
}
