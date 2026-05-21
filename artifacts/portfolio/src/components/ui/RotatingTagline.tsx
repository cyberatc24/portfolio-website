import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cloud, Search, Bug, Network, BrainCircuit, type LucideIcon } from "lucide-react";

type Phrase = { text: string; icon: LucideIcon };

const PHRASES: Phrase[] = [
  { text: "securing cloud infrastructure", icon: Cloud },
  { text: "hunting threats across AWS, Azure, and GCP", icon: Search },
  { text: "breaking systems to make them stronger", icon: Bug },
  { text: "architecting zero-trust networks", icon: Network },
  { text: "defending the AI/ML attack surface", icon: BrainCircuit },
];

export default function RotatingTagline() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % PHRASES.length), 3400);
    return () => clearInterval(id);
  }, []);

  const current = PHRASES[i];
  const Icon = current.icon;

  return (
    <>
      {/* Leading icon — swaps per phrase with rotate + glow */}
      <span className="relative inline-block w-4 h-4 mr-1.5" style={{ verticalAlign: "-2px" }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={`icon-${i}`}
            initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 inline-flex items-center justify-center text-primary"
            style={{ filter: "drop-shadow(0 0 6px rgba(6,182,212,0.75))" }}
          >
            <Icon className="w-4 h-4" />
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Phrase — whole-word swap; inline so the paragraph wraps cleanly */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`phrase-${i}`}
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent rotating-tagline-shimmer"
        >
          {current.text}
        </motion.span>
      </AnimatePresence>

      {/* Glowing terminal caret */}
      <span
        aria-hidden="true"
        className="ml-1 inline-block w-[2px] h-[1em] align-middle bg-primary animate-pulse"
        style={{ boxShadow: "0 0 6px rgba(6,182,212,0.9), 0 0 14px rgba(6,182,212,0.5)" }}
      />
    </>
  );
}
