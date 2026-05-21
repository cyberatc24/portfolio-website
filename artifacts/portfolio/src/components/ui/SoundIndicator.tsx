import { useEffect, useState } from "react";

/** Tiny 4-bar EQ that pulses whenever a sound is played (via window 'atc:sound' event). */
export default function SoundIndicator({ muted }: { muted: boolean }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const onSound = () => {
      setActive(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setActive(false), 280);
    };
    window.addEventListener("atc:sound", onSound);
    return () => {
      window.removeEventListener("atc:sound", onSound);
      window.clearTimeout(timer);
    };
  }, []);

  const bars = [0, 1, 2, 3];
  return (
    <div className="flex items-end gap-[2px] h-3" aria-hidden="true">
      {bars.map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-sm"
          style={{
            height: muted ? "20%" : active ? `${30 + ((i * 23) % 70)}%` : "40%",
            background: muted ? "rgba(148,163,184,0.5)" : active ? "rgb(6,182,212)" : "rgba(6,182,212,0.5)",
            transition: "height 120ms ease, background 120ms ease",
            animation: !muted && active ? `eq-bar-${i} 0.28s ease-in-out` : "none",
          }}
        />
      ))}
    </div>
  );
}
