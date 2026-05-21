import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number; // ms per char
  className?: string;
  startDelay?: number;
};

export default function TypewriterParagraph({ text, speed = 12, className = "", startDelay = 0 }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text.length);
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            setTimeout(() => setStarted(true), startDelay);
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, started, startDelay]);

  useEffect(() => {
    if (!started) return;
    if (shown >= text.length) return;
    const id = setTimeout(() => setShown((n) => Math.min(text.length, n + 1)), speed);
    return () => clearTimeout(id);
  }, [started, shown, text, speed]);

  const visible = text.slice(0, shown);
  const remaining = text.slice(shown);
  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {visible}
        <span className="opacity-0">{remaining}</span>
        {started && shown < text.length && (
          <span className="inline-block w-[2px] h-[1em] align-middle bg-primary animate-pulse ml-0.5" />
        )}
      </span>
    </p>
  );
}
