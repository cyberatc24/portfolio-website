import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalSquare, Sun, Moon, Volume2, VolumeX } from "lucide-react";
import { useTerminal } from "@/context/TerminalContext";
import { useTheme } from "@/context/ThemeContext";
import { playHoverClick, isMuted, toggleMuted } from "@/lib/sounds";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useMagnetic } from "@/hooks/useMagnetic";
import SoundIndicator from "@/components/ui/SoundIndicator";

function MagneticNavLink({
  link,
  i,
  active,
  onClick,
}: {
  link: { name: string; href: string };
  i: number;
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.25);
  return (
    <motion.a
      ref={ref}
      href={link.href}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={playHoverClick}
      onClick={(e) => onClick(e, link.href)}
      className="relative font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200 group py-1"
    >
      {link.name}
      <span
        className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </motion.a>
  );
}

function AtcLogo() {
  return (
    <svg viewBox="0 0 32 32" className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="atc-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      {/* hex shield */}
      <path
        d="M16 2.5 L27 8 V18 C27 23.5 22.5 28 16 30 C9.5 28 5 23.5 5 18 V8 Z"
        stroke="url(#atc-logo-grad)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* inner circuit ring */}
      <circle cx="16" cy="16" r="4.5" stroke="url(#atc-logo-grad)" strokeWidth="1.4" />
      {/* circuit nodes */}
      <circle cx="16" cy="11.5" r="1" fill="url(#atc-logo-grad)" />
      <circle cx="16" cy="20.5" r="1" fill="url(#atc-logo-grad)" />
      <circle cx="11.5" cy="16" r="1" fill="url(#atc-logo-grad)" />
      <circle cx="20.5" cy="16" r="1" fill="url(#atc-logo-grad)" />
      {/* center keyhole dot */}
      <circle cx="16" cy="16" r="1.4" fill="url(#atc-logo-grad)" />
    </svg>
  );
}

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

// Stable module-level reference so useActiveSection doesn't churn listeners on every Navbar re-render.
const SECTION_IDS = navLinks.map((l) => l.href.replace("#", ""));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [muted, setMutedState] = useState(false);
  const { openWithCommand } = useTerminal();
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    setMutedState(isMuted());
    const onMute = (e: Event) => setMutedState((e as CustomEvent<boolean>).detail);
    window.addEventListener("atc:mute", onMute);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("atc:mute", onMute);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    playHoverClick();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a
          href="#hero"
          onMouseEnter={playHoverClick}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
        >
          <AtcLogo />
          <span className="font-mono font-bold text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">ATC</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 font-mono text-sm">
          {navLinks.map((link, i) => (
            <MagneticNavLink
              key={link.name}
              link={link}
              i={i}
              active={active === link.href.replace("#", "")}
              onClick={handleNavClick}
            />
          ))}

          <button
            onClick={() => { toggleMuted(); }}
            className="flex items-center gap-1.5 px-2 h-8 border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            title={muted ? "Sound off" : "Sound on"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <SoundIndicator muted={muted} />
          </button>

          <button
            onClick={() => { playHoverClick(); toggleTheme(); }}
            className="w-8 h-8 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => { playHoverClick(); openWithCommand("help"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-200"
            data-testid="nav-terminal"
          >
            <TerminalSquare className="w-3.5 h-3.5" />
            &gt;_ Shell
          </button>
        </nav>
      </div>
    </header>
  );
}
