import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Linkedin, Mail, ArrowRight, Shield, ChevronDown } from "lucide-react";
import { useTerminal } from "@/context/TerminalContext";
import { playHoverClick } from "@/lib/sounds";
import ParticleField from "@/components/effects/ParticleField";
import RotatingTagline from "@/components/ui/RotatingTagline";
import { MagneticButton } from "@/components/ui/MagneticButton";
import CountUp from "@/components/ui/CountUp";

const badges = [
  { icon: Shield, label: "CCIE Security", sub: "#53175" },
  { icon: Shield, label: "CEH Certified", sub: "EC-Council" },
  { icon: Shield, label: "AWS Security", sub: "Specialty" },
];

const socials = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/amittchouhan/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:admin@cyberamit.in", label: "Email" },
];

const ROLE_TEXT = "Cybersecurity Architect and Researcher";

function RoleBadge() {
  const letters = ROLE_TEXT.split("");
  return (
    <span className="relative inline-flex items-center gap-2.5 px-5 py-2 rounded-full font-mono text-sm role-badge-glow overflow-hidden">
      {/* Animated conic gradient border */}
      <span className="role-badge-border" aria-hidden="true" />
      {/* Inner fill */}
      <span className="absolute inset-[1px] rounded-full bg-background/95 backdrop-blur-sm" aria-hidden="true" />

      {/* Pulsing status dot with concentric ring */}
      <span className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
        <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        <span className="relative w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
      </span>

      {/* Letter-by-letter reveal with shimmer sweep */}
      <span className="relative inline-flex role-badge-shimmer text-primary font-semibold tracking-wide whitespace-nowrap">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.35, delay: 0.4 + i * 0.025, ease: "easeOut" }}
            style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : "normal" }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

export default function Hero() {
  const { openWithCommand } = useTerminal();
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxParticles = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 120]);
  const parallaxGrid = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 60]);
  const parallaxGlow = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 200]);
  const parallaxContent = useTransform(scrollY, [0, 800], [0, reduce ? 0 : -40]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="hero-spotlight relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden text-center"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "40%" }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* particle network — parallax */}
        <motion.div className="absolute inset-0" style={{ y: parallaxParticles }}>
          <ParticleField />
        </motion.div>
        {/* base ambient glow */}
        <motion.div
          style={{ y: parallaxGlow }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(6,182,212,0.06),transparent)]"
        />
        {/* grid — parallax */}
        <motion.div
          style={{ y: parallaxGrid }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff04_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff04_1px,transparent_1px)] bg-[size:4rem_4rem]"
        />
        {/* cursor spotlight — cyan core */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx) var(--my), rgba(6,182,212,0.22), rgba(168,85,247,0.10) 35%, transparent 65%)",
          }}
        />
        {/* cursor spotlight — grid reveal (brighter grid near cursor) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(6,182,212,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.35) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
            WebkitMaskImage:
              "radial-gradient(280px circle at var(--mx) var(--my), black 0%, transparent 70%)",
            maskImage:
              "radial-gradient(280px circle at var(--mx) var(--my), black 0%, transparent 70%)",
          }}
        />
        {/* scanline pulse following cursor */}
        <div
          className="absolute pointer-events-none rounded-full blur-3xl opacity-60 mix-blend-screen"
          style={{
            width: "260px",
            height: "260px",
            left: "var(--mx)",
            top: "var(--my)",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.25), rgba(6,182,212,0.10) 50%, transparent 75%)",
            transition: "left 120ms ease-out, top 120ms ease-out",
          }}
        />
      </div>

      <motion.div
        style={{ y: parallaxContent }}
        className="relative z-10 container px-4 md:px-6 mx-auto flex flex-col items-center gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RoleBadge />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-1"
        >
          <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">Hi, I'm</p>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hero-name text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none"
          >
            Amit T Chouhan
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-lg text-muted-foreground leading-relaxed"
        >
          A decade <RotatingTagline /> — covering architecture review, threat modeling,
          penetration testing, compliance, and offensive security across AWS, Azure, and GCP.
        </motion.p>

        {/* Live stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="grid grid-cols-3 gap-6 md:gap-12 pt-2 pb-1"
        >
          {[
            { value: 10, suffix: "+", label: "Years" },
            { value: 50, suffix: "+", label: "Engagements" },
            { value: 5, suffix: "", label: "Certifications" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <span
                key={b.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-default"
                onMouseEnter={playHoverClick}
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono">{b.label}</span>
                <span className="text-primary/60 text-xs">{b.sub}</span>
              </span>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-3"
        >
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                onMouseEnter={playHoverClick}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <MagneticButton
            href="#contact"
            onMouseEnter={playHoverClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-sm font-bold hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-200"
          >
            Discuss Your Project <ArrowRight className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton
            href="#services"
            onMouseEnter={playHoverClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card/40 text-foreground font-mono text-sm hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
          >
            View Services
          </MagneticButton>
          <MagneticButton
            as="button"
            onClick={() => openWithCommand("help")}
            onMouseEnter={playHoverClick}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-primary/30 bg-primary/5 text-primary font-mono text-sm hover:bg-primary/15 hover:border-primary transition-colors duration-200"
          >
            &gt;_ open terminal
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
