import { useEffect, useRef, useState } from "react";

/** Custom cyan ring cursor; grows on hover over interactive elements. */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || reduce) return;
    setEnabled(true);

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { x: target.x, y: target.y };
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX - 2}px, ${e.clientY - 2}px, 0)`;
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest("a, button, [role=button], input, textarea, label, select, [data-cursor=hover]");
      if (interactive !== hovering) {
        hovering = interactive;
        ring.classList.toggle("cursor-ring--hover", hovering);
      }
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      ring.style.transform = `translate3d(${cur.x - 16}px, ${cur.y - 16}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring pointer-events-none fixed top-0 left-0 z-[9999] w-8 h-8 rounded-full border border-cyan-400/70"
        style={{ transition: "width 180ms ease, height 180ms ease, border-color 180ms ease, background 180ms ease" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-1 h-1 rounded-full bg-cyan-300"
      />
    </>
  );
}
