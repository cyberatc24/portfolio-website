import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#abcdef0123456789ABCDEF";

type Props = {
  text: string;
  duration?: number; // ms
  className?: string;
};

export default function DecryptText({ text, duration = 700, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOut(text);
      return;
    }
    setOut(scramble(text));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            run();
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    let raf = 0;
    const start = () => performance.now();
    const run = () => {
      const t0 = start();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        // progress char-by-char left to right
        const resolved = Math.floor(t * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          if (i < resolved) s += text[i];
          else if (text[i] === " ") s += " ";
          else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOut(s);
        if (t < 1) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      raf = requestAnimationFrame(tick);
    };

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

function scramble(text: string) {
  let s = "";
  for (const ch of text) s += ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return s;
}
