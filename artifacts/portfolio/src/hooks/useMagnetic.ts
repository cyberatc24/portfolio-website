import { useEffect, useRef } from "react";

export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const max = Math.max(rect.width, rect.height) * 0.9;
      if (dist > max) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = "translate(0px, 0px)";
        });
        return;
      }
      const falloff = 1 - dist / max;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${dx * strength * falloff}px, ${dy * strength * falloff}px)`;
      });
    };

    const handleLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = "translate(0px, 0px)";
      });
    };

    el.style.willChange = "transform";
    el.style.transition = "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)";

    window.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return ref;
}
