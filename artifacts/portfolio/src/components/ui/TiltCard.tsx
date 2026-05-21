import { useRef, type ReactNode, type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  max?: number; // degrees
  scale?: number;
};

export default function TiltCard({ children, max = 6, scale = 1.01, className = "", ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * (max * 2);
    const ry = (px - 0.5) * (max * 2);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(6,182,212,0.18), transparent 55%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }}
      className={`relative ${className}`}
      {...rest}
    >
      {children}
      <div
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{ opacity: 0, mixBlendMode: "screen" }}
      />
    </div>
  );
}
