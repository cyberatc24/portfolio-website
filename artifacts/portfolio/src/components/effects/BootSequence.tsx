import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  { text: "> initializing secure shell...", status: "OK" },
  { text: "> loading kernel modules [crypto, netfilter, audit]", status: "OK" },
  { text: "> establishing encrypted channel [TLS 1.3]", status: "OK" },
  { text: "> verifying signatures [ED25519]", status: "OK" },
  { text: "> mounting /home/operator", status: "OK" },
  { text: "> access granted. welcome, operator.", status: "OK" },
];

const STORAGE_KEY = "atc-boot-shown";

export default function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shown = sessionStorage.getItem(STORAGE_KEY);
    if (shown || reduce) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (step >= LINES.length) {
      const t = setTimeout(() => setDone(true), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 120 : 180);
    return () => clearTimeout(t);
  }, [visible, step]);

  useEffect(() => {
    if (!visible || done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible, done]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
          aria-hidden="true"
        >
          {/* scanlines */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(6,182,212,0.08) 0, rgba(6,182,212,0.08) 1px, transparent 1px, transparent 3px)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(6,182,212,0.10),transparent_70%)]" />

          <div className="relative font-mono text-sm md:text-base text-cyan-300 w-[min(640px,90vw)] px-6">
            <div className="mb-4 text-cyan-400/70 text-xs uppercase tracking-[0.3em]">
              [ ATC // secure boot v1.0 ]
            </div>
            <div className="space-y-1.5">
              {LINES.slice(0, step).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-between gap-4"
                >
                  <span>{line.text}</span>
                  <span className="text-green-400">[ {line.status} ]</span>
                </motion.div>
              ))}
              {step < LINES.length && (
                <div className="text-cyan-400/80">
                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse align-middle" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
