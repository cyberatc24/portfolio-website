import { useState, useRef, useEffect, useCallback } from "react";
import { Minus, Terminal as TerminalIcon, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTerminal } from "@/context/TerminalContext";
import { useTheme } from "@/context/ThemeContext";
import {
  playKeystroke,
  playExecute,
  playOutputTick,
  playHackTick,
  playHackStart,
  playHackSuccess,
  playSuccess,
  playError,
  playMatrixBoot,
  playClear,
} from "@/lib/sounds";

const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\";

function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let drops: number[] = [];
    const fontSize = 14;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = W;
      canvas.height = H;
      const cols = Math.floor(W / fontSize);
      drops = Array(cols).fill(0).map(() => Math.floor(Math.random() * (H / fontSize)));
      ctx.fillStyle = "#02060f";
      ctx.fillRect(0, 0, W, H);
    };

    let frame = 0;
    let raf: number;

    const draw = () => {
      frame++;
      ctx.fillStyle = "rgba(2, 6, 15, 0.12)";
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const bright = Math.random() > 0.96;
        ctx.fillStyle = bright ? "#e0ffff" : frame % 3 === 0 ? "#00ffaa" : "#00cc66";
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };

    // Defer sizing/draw to ensure parent layout has settled.
    const startId = requestAnimationFrame(() => {
      resize();
      draw();
    });

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(container);

    const timer = setTimeout(() => {
      cancelAnimationFrame(raf);
      onDone();
    }, 6000);

    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      onDone();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(startId);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("keydown", handleKey);
    };
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#02060f" }}
      onClick={onDone}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <motion.div
        className="relative z-10 text-center font-mono pointer-events-none px-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-green-400 text-sm font-bold mb-3 tracking-[0.3em] animate-pulse drop-shadow-[0_0_8px_rgba(0,255,170,0.6)]">
          INITIATING MATRIX PROTOCOL
        </div>
        <div className="text-green-300 text-[11px] opacity-80">Press any key or click to exit</div>
      </motion.div>
    </div>
  );
}

type HistoryEntry =
  | { type: "input"; text: string }
  | { type: "output"; lines: OutputLine[] }
  | { type: "banner" }
  | { type: "help" };

type OutputLine = {
  text: string;
  color?: string;
  bold?: boolean;
  pre?: boolean;
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function now() {
  return new Date().toLocaleString("en-US", {
    weekday: "short", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

const NAV_COMMANDS: Record<string, string> = {
  about: "about",
  skills: "skills",
  experience: "experience",
  projects: "projects",
  contact: "contact",
};

async function resolveCommand(
  cmd: string,
  args: string[],
  cmdHistory: string[],
  themeMode: "dark" | "light" = "dark"
): Promise<{ lines: OutputLine[]; action?: "clear" | "exit" | string }> {
  switch (cmd) {
    case "help":
      return { lines: [], action: "help" };

    case "whoami": {
      const now2 = new Date();
      const timeStr = now2.toTimeString().slice(0, 8);
      const dateStr = `${String(now2.getDate()).padStart(2,"0")}/${String(now2.getMonth()+1).padStart(2,"0")}/${now2.getFullYear()}`;
      const platform = typeof navigator !== "undefined" ? (navigator.platform || navigator.userAgent.split(" ").pop() || "Unknown") : "Unknown";
      return {
        lines: [
          { text: "" },
          { text: "  Session info:", color: "text-slate-400" },
          { text: "" },
          { text: `  visitor     anonymous`, color: "text-cyan-300" },
          { text: `  time        ${timeStr}`, color: "text-cyan-300" },
          { text: `  date        ${dateStr}`, color: "text-cyan-300" },
          { text: `  platform    ${platform}`, color: "text-cyan-300" },
          { text: `  theme       ${themeMode}`, color: "text-cyan-300" },
          { text: "" },
          { text: "  You are browsing the portfolio of:", color: "text-slate-500" },
          { text: "  Amit T Chouhan — Cyber Security Architect & Researcher", color: "text-cyan-400", bold: true },
          { text: "  Contact: admin@cyberamit.in  ·  linkedin.com/in/amittchouhan", color: "text-slate-500" },
          { text: "" },
        ],
      };
    }

    case "myipaddress": {
      const fetchLines: OutputLine[] = [
        { text: "" },
        { text: "  [*] Initiating IP lookup...", color: "text-cyan-400" },
        { text: "  [*] Querying external DNS resolver...", color: "text-slate-400" },
      ];
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        const ip = data.ip || "Unknown";
        return {
          lines: [
            ...fetchLines,
            { text: `  [+] Public IP Address: ${ip}`, color: "text-green-400", bold: true },
            { text: "" },
            { text: "  ╔══════════════════════════════════════════════════╗", color: "text-red-500" },
            { text: "  ║  ⚠  WARNING: YOU ARE UNDER SURVEILLANCE  ⚠     ║", color: "text-red-400", bold: true },
            { text: "  ╠══════════════════════════════════════════════════╣", color: "text-red-500" },
            { text: "  ║  Your IP has been logged. All activity on this  ║", color: "text-red-300" },
            { text: "  ║  system is monitored by Amit T Chouhan's security ║", color: "text-red-300" },
            { text: "  ║  framework. Unauthorized access is prohibited.  ║", color: "text-red-300" },
            { text: "  ║                                                  ║", color: "text-red-500" },
            { text: "  ║  [LOG ENTRY CREATED] — timestamp: " + new Date().toISOString().slice(0, 19) + "  ║", color: "text-yellow-500" },
            { text: "  ╚══════════════════════════════════════════════════╝", color: "text-red-500" },
            { text: "" },
          ],
        };
      } catch {
        return {
          lines: [
            ...fetchLines,
            { text: "  [!] Failed to resolve IP — network error.", color: "text-red-400" },
            { text: "" },
          ],
        };
      }
    }

    case "neofetch":
      return {
        lines: [
          { text: "" },
          { text: "        .--.          atc@cyberamit", color: "text-cyan-400" },
          { text: "       |o_o |         -----------------", color: "text-cyan-400" },
          { text: "       |:_/ |         OS: SecureOS 24.04 LTS x86_64", color: "text-cyan-400" },
          { text: "      //   \\ \\        Host: Portfolio v2.0", color: "text-cyan-400" },
          { text: "     (|     | )       Kernel: 6.11.0-secure", color: "text-cyan-400" },
          { text: "    /'\\_   _/`\\       Uptime: " + Math.floor((Date.now() % 86400000) / 3600000) + " hours", color: "text-cyan-400" },
          { text: "    \\___)=(___/       Shell: secure-shell 5.2.1", color: "text-cyan-400" },
          { text: "                      Theme: CyberDark [Dark]", color: "text-cyan-400" },
          { text: "                      Terminal: SecureShell v1.0", color: "text-cyan-400" },
          { text: "                      CPU: CyberCore™ i9 (16) @ 5.2GHz", color: "text-cyan-400" },
          { text: "                      Memory: 128GB LPDDR5", color: "text-cyan-400" },
          { text: "" },
          { text: "  ████ ████ ████ ████ ████ ████ ████ ████", color: "text-slate-700" },
          { text: "" },
        ],
      };

    case "ls":
      return {
        lines: [
          { text: "" },
          { text: "  drwxr-xr-x  about/          About me & bio", color: "text-blue-400" },
          { text: "  drwxr-xr-x  skills/         Technical skill set", color: "text-blue-400" },
          { text: "  drwxr-xr-x  experience/     Work history", color: "text-blue-400" },
          { text: "  drwxr-xr-x  projects/       Portfolio projects", color: "text-blue-400" },
          { text: "  drwxr-xr-x  contact/        Get in touch", color: "text-blue-400" },
          { text: "  -rw-r--r--  resume.pdf      Curriculum vitae", color: "text-green-400" },
          { text: "  -rw-r--r--  readme.md       Portfolio readme", color: "text-slate-400" },
          { text: "" },
          { text: "  Tip: Run a directory name to navigate to it.", color: "text-slate-600" },
          { text: "" },
        ],
      };

    case "pwd":
      return { lines: [{ text: "  /home/amit/portfolio", color: "text-green-400" }, { text: "" }] };

    case "date":
      return { lines: [{ text: `  ${now()}`, color: "text-slate-300" }, { text: "" }] };

    case "uptime":
      return {
        lines: [
          {
            text: `  ${now()} up ${Math.floor(Math.random() * 200 + 10)} days, ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}, 1 user, load average: 0.12, 0.08, 0.05`,
            color: "text-slate-300",
          },
          { text: "" },
        ],
      };

    case "hostname":
      return { lines: [{ text: "  secure-shell.amitchouhan.in", color: "text-green-400" }, { text: "" }] };

    case "uname": {
      const all = args.includes("-a");
      return {
        lines: [
          {
            text: all
              ? "  SecureOS secure-shell 6.11.0-secure #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"
              : "  SecureOS",
            color: "text-slate-300",
          },
          { text: "" },
        ],
      };
    }

    case "echo":
      return {
        lines: [
          { text: args.length > 0 ? "  " + args.join(" ") : "", color: "text-slate-300" },
          { text: "" },
        ],
      };

    case "cat": {
      const file = args[0];
      if (!file) return { lines: [{ text: "  cat: missing operand", color: "text-red-400" }, { text: "" }] };
      if (file === "readme.md") {
        return {
          lines: [
            { text: "" },
            { text: "  # Amit Chouhan — Portfolio", color: "text-cyan-400", bold: true },
            { text: "" },
            { text: "  Cyber Security Architect & Researcher — 10+ yrs securing enterprise", color: "text-slate-300" },
            { text: "  systems. Specializing in Zero Trust, Cloud Security, and", color: "text-slate-300" },
            { text: "  Threat Intelligence frameworks at global scale.", color: "text-slate-300" },
            { text: "" },
            { text: "  Contact: admin@cyberamit.in", color: "text-slate-400" },
            { text: "" },
          ],
        };
      }
      if (file === "resume.pdf") {
        return { lines: [{ text: `  cat: resume.pdf: Binary file — use a PDF viewer.`, color: "text-yellow-400" }, { text: "" }] };
      }
      return { lines: [{ text: `  cat: ${file}: No such file or directory`, color: "text-red-400" }, { text: "" }] };
    }

    case "ping": {
      const host = args[0] || "amitchouhan.in";
      return {
        lines: [
          { text: "" },
          { text: `  PING ${host} (93.184.216.34): 56 data bytes`, color: "text-slate-400" },
          { text: `  64 bytes from ${host}: icmp_seq=0 ttl=56 time=${(Math.random() * 10 + 1).toFixed(3)} ms`, color: "text-green-400" },
          { text: `  64 bytes from ${host}: icmp_seq=1 ttl=56 time=${(Math.random() * 10 + 1).toFixed(3)} ms`, color: "text-green-400" },
          { text: `  64 bytes from ${host}: icmp_seq=2 ttl=56 time=${(Math.random() * 10 + 1).toFixed(3)} ms`, color: "text-green-400" },
          { text: "" },
          { text: `  --- ${host} ping statistics ---`, color: "text-slate-400" },
          { text: "  3 packets transmitted, 3 received, 0% packet loss", color: "text-slate-300" },
          { text: "" },
        ],
      };
    }

    case "history":
      if (cmdHistory.length === 0) {
        return { lines: [{ text: "  No command history yet.", color: "text-slate-500" }, { text: "" }] };
      }
      return {
        lines: [
          { text: "" },
          ...cmdHistory
            .slice()
            .reverse()
            .map((c, i) => ({
              text: `  ${String(i + 1).padStart(4, " ")}  ${c}`,
              color: "text-slate-400",
            })),
          { text: "" },
        ],
      };

    case "man": {
      const subject = args[0];
      if (!subject) return { lines: [{ text: "  man: missing operand. Usage: man [command]", color: "text-red-400" }, { text: "" }] };
      const manPages: Record<string, string> = {
        whoami: "whoami — Display current visitor session info (time, date, platform, theme).",
        certs: "certs — Display all professional certifications with verification status.",
        services: "services — List all consulting and advisory services offered.",
        socials: "socials — Display social media and contact links.",
        research: "research — Show cloud attack path research topics and findings.",
        blog: "blog — Display blog and YouTube content information.",
        theme: "theme — Toggle between dark and light mode.",
        matrix: "matrix — Enter the Matrix. Initiates a 6-second Katakana rain animation. Press any key to exit early.",
        hack: "hack [target] — Run a cinematic (fake) breach simulation against a named target. Purely theatrical.",
        myipaddress: "myipaddress — Reveal your public IP address with a surveillance warning.",
        ls: "ls — List all sections and files in the portfolio.",
        pwd: "pwd — Print the current working directory path.",
        clear: "clear — Clear all terminal output.",
        help: "help — Display the full command index.",
        ping: "ping [host] — Simulate a network ping to a host.",
        cat: "cat [file] — Display contents of a file (readme.md, resume.pdf).",
        echo: "echo [text] — Print text to the terminal output.",
        history: "history — Display previously entered commands.",
        neofetch: "neofetch — Display a fancy system info summary.",
        uptime: "uptime — Show how long the system has been running.",
        uname: "uname [-a] — Print system name. Use -a for full info.",
        date: "date — Display the current date and time.",
        sudo: "sudo [cmd] — Attempt to run a command with superuser privileges.",
        exit: "exit — Close the terminal window.",
        hostname: "hostname — Print the system hostname.",
      };
      const entry = manPages[subject];
      if (!entry) return { lines: [{ text: `  man: no manual entry for '${subject}'`, color: "text-red-400" }, { text: "" }] };
      return {
        lines: [
          { text: "" },
          { text: `  NAME`, color: "text-cyan-400", bold: true },
          { text: `      ${subject} — ${entry}`, color: "text-slate-300" },
          { text: "" },
          { text: `  USAGE`, color: "text-cyan-400", bold: true },
          { text: `      ${subject} ${subject === "echo" ? "[text]" : subject === "ping" ? "[host]" : subject === "cat" ? "[file]" : subject === "man" ? "[command]" : subject === "uname" ? "[-a]" : ""}`, color: "text-slate-400" },
          { text: "" },
        ],
      };
    }

    case "sudo": {
      const subcmd = args.join(" ");
      if (!subcmd) return { lines: [{ text: "  sudo: missing command operand", color: "text-red-400" }, { text: "" }] };
      return {
        lines: [
          { text: "" },
          { text: "  [sudo] password for amit: ", color: "text-yellow-400" },
          { text: "  Sorry, amit is not in the sudoers file.", color: "text-red-400" },
          { text: "  This incident will be reported.", color: "text-red-500" },
          { text: "" },
        ],
      };
    }

    case "certs":
      return { lines: [], action: "certs" };

    case "services":
      return {
        lines: [
          { text: "" },
          { text: "  ╔══════════════════════════════════════════════════════╗", color: "text-cyan-800" },
          { text: "  ║            CONSULTING SERVICES                       ║", color: "text-cyan-400", bold: true },
          { text: "  ╚══════════════════════════════════════════════════════╝", color: "text-cyan-800" },
          { text: "" },
          { text: "  01  Cloud Security Architecture", color: "text-cyan-300", bold: true },
          { text: "      AWS / Azure security design, IAM governance, GuardDuty,", color: "text-slate-400" },
          { text: "      WAF rule engineering, and cloud migration security.", color: "text-slate-400" },
          { text: "" },
          { text: "  02  Penetration Testing & Red Teaming", color: "text-cyan-300", bold: true },
          { text: "      CEH-certified adversarial testing, CVE exploitation,", color: "text-slate-400" },
          { text: "      firewall bypass simulation, and attack surface mapping.", color: "text-slate-400" },
          { text: "" },
          { text: "  03  Vulnerability Management", color: "text-cyan-300", bold: true },
          { text: "      Qualys VMDR programme setup, continuous scanning, CVE", color: "text-slate-400" },
          { text: "      triage, and automated remediation workflows.", color: "text-slate-400" },
          { text: "" },
          { text: "  04  Security Architecture Review", color: "text-cyan-300", bold: true },
          { text: "      Firewall policy auditing (Cisco ASA / Check Point / PA),", color: "text-slate-400" },
          { text: "      VPN design review, and zero-trust readiness assessment.", color: "text-slate-400" },
          { text: "" },
          { text: "  05  Security Training & Advisory", color: "text-cyan-300", bold: true },
          { text: "      Team upskilling on cloud security best practices,", color: "text-slate-400" },
          { text: "      incident response planning, and compliance readiness.", color: "text-slate-400" },
          { text: "" },
          { text: "  → Initiate: admin@cyberamit.in", color: "text-green-400" },
          { text: "" },
        ],
      };

    case "socials":
      return {
        lines: [
          { text: "" },
          { text: "  ┌─ Social Links ─────────────────────────────────────┐", color: "text-cyan-800" },
          { text: "" },
          { text: "  LinkedIn    linkedin.com/in/amittchouhan", color: "text-cyan-300" },
          { text: "  Email       admin@cyberamit.in", color: "text-cyan-300" },
          { text: "  Phone       +91 7045600559", color: "text-cyan-300" },
          { text: "" },
          { text: "  └────────────────────────────────────────────────────┘", color: "text-cyan-800" },
          { text: "" },
        ],
      };

    case "research":
      return {
        lines: [
          { text: "" },
          { text: "  ╔══════════════════════════════════════════════════════╗", color: "text-yellow-800" },
          { text: "  ║   RESEARCH: CLOUD ATTACK PATHS                       ║", color: "text-yellow-400", bold: true },
          { text: "  ╚══════════════════════════════════════════════════════╝", color: "text-yellow-800" },
          { text: "" },
          { text: "  Focus Areas:", color: "text-slate-400" },
          { text: "" },
          { text: "  ▸ IAM Privilege Escalation in Multi-Account AWS Environments", color: "text-yellow-300" },
          { text: "    Lateral movement through misconfigured cross-account roles.", color: "text-slate-500" },
          { text: "" },
          { text: "  ▸ Cloud-Native Firewall Bypass Techniques", color: "text-yellow-300" },
          { text: "    Security group misconfigurations enabling unintended exposure.", color: "text-slate-500" },
          { text: "" },
          { text: "  ▸ VPN Tunnel Interception & IPSec Weaknesses", color: "text-yellow-300" },
          { text: "    Weak PSK usage, IKEv1 downgrade, and traffic interception.", color: "text-slate-500" },
          { text: "" },
          { text: "  ▸ WAF Evasion via Encoding & Payload Obfuscation", color: "text-yellow-300" },
          { text: "    Bypassing AWS WAF and F5 with Unicode and HTTP smuggling.", color: "text-slate-500" },
          { text: "" },
          { text: "  ▸ Adversarial AI — Prompt Injection in Security Tooling", color: "text-yellow-300" },
          { text: "    Emerging threat vector for AI-assisted SOC platforms.", color: "text-slate-500" },
          { text: "" },
          { text: "  [!] All research is defensive — for awareness and hardening.", color: "text-red-400" },
          { text: "" },
        ],
      };

    case "blog":
      return {
        lines: [
          { text: "" },
          { text: "  ╔══════════════════════════════════════════════════════╗", color: "text-green-800" },
          { text: "  ║   BLOG & CONTENT                                      ║", color: "text-green-400", bold: true },
          { text: "  ╚══════════════════════════════════════════════════════╝", color: "text-green-800" },
          { text: "" },
          { text: "  Status: [COMING SOON] — Content under construction.", color: "text-yellow-400" },
          { text: "" },
          { text: "  Planned topics:", color: "text-slate-400" },
          { text: "  ▸ AWS IAM Attack Paths — Illustrated Deep Dives", color: "text-green-300" },
          { text: "  ▸ Building Zero Trust on a Budget", color: "text-green-300" },
          { text: "  ▸ Qualys VMDR vs Manual Pen Testing — When to Use Each", color: "text-green-300" },
          { text: "  ▸ Cisco ISE 802.1X — Full Lab Walkthrough", color: "text-green-300" },
          { text: "  ▸ AI Security: Prompt Injection for Security Engineers", color: "text-green-300" },
          { text: "" },
          { text: "  → Follow updates: linkedin.com/in/amittchouhan", color: "text-green-400" },
          { text: "" },
        ],
      };

    case "theme":
      return { lines: [], action: "theme" };

    case "hack": {
      const target = args[0] || "localhost";
      return { lines: [], action: `hack:${target}` };
    }

    case "matrix":
      return {
        lines: [
          { text: "" },
          { text: "  [*] Initializing matrix protocol...", color: "text-green-400" },
          { text: "  [*] Loading character set: Katakana + Hex", color: "text-green-400" },
          { text: "  [*] ENTERING THE MATRIX — press any key to abort", color: "text-green-300", bold: true },
          { text: "" },
        ],
        action: "matrix",
      };

    case "clear":
      return { lines: [], action: "clear" };

    case "contact":
      return { lines: [], action: "contact-init" };

    case "exit":
      return { lines: [{ text: "  Closing secure session...", color: "text-slate-400" }], action: "exit" };

    default:
      if (NAV_COMMANDS[cmd]) {
        return {
          lines: [{ text: `  Navigating to [${cmd}] section...`, color: "text-green-400" }],
          action: `nav:${cmd}`,
        };
      }
      return {
        lines: [
          { text: `  bash: ${cmd}: command not found`, color: "text-red-400" },
          { text: "  Type 'help' to see available commands.", color: "text-slate-600" },
          { text: "" },
        ],
      };
  }
}

function OutputLines({ lines }: { lines: OutputLine[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <div
          key={i}
          className={`leading-5 ${line.color ?? "text-slate-300"} ${line.bold ? "font-bold" : ""}`}
          style={{ whiteSpace: line.pre ? "pre" : undefined }}
        >
          {line.text}
        </div>
      ))}
    </>
  );
}

type HelpRow =
  | { kind: "section"; label: string }
  | { kind: "cmd"; cmd: string; args?: string; desc: string; cmdColor: string }
  | { kind: "blank" }
  | { kind: "tip"; text: string };

const HELP_ROWS: HelpRow[] = [
  { kind: "section", label: "Navigation" },
  { kind: "cmd", cmd: "about",      desc: "Who am I",                           cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "skills",     desc: "Technical expertise",                cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "experience", desc: "Work history",                       cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "services",   desc: "Consulting services",                cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "projects",   desc: "Notable operations",                 cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "certs",      desc: "Certifications & talks",             cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "contact",    desc: "Get in touch",                       cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "socials",    desc: "Social links",                       cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "research",   desc: "Cloud attack path research",         cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "blog",       desc: "Blog & YouTube",                     cmdColor: "text-green-400" },
  { kind: "cmd", cmd: "theme",      desc: "Toggle dark / light mode",           cmdColor: "text-green-400" },
  { kind: "blank" },
  { kind: "section", label: "Profile" },
  { kind: "cmd", cmd: "whoami",      desc: "Current visitor info",              cmdColor: "text-yellow-400" },
  { kind: "cmd", cmd: "myipaddress", desc: "Reveal your public IP address",     cmdColor: "text-yellow-400" },
  { kind: "cmd", cmd: "neofetch",    desc: "Fancy system info display",         cmdColor: "text-yellow-400" },
  { kind: "cmd", cmd: "uname",  args: "[-a]",   desc: "Print system name / full info",    cmdColor: "text-yellow-400" },
  { kind: "cmd", cmd: "uptime",      desc: "Show session uptime",                cmdColor: "text-yellow-400" },
  { kind: "cmd", cmd: "hostname",    desc: "Print the system hostname",          cmdColor: "text-yellow-400" },
  { kind: "blank" },
  { kind: "section", label: "Utilities" },
  { kind: "cmd", cmd: "ls",      desc: "List available sections and files",  cmdColor: "text-cyan-400" },
  { kind: "cmd", cmd: "pwd",     desc: "Print current working directory",    cmdColor: "text-cyan-400" },
  { kind: "cmd", cmd: "date",    desc: "Print current date and time",        cmdColor: "text-cyan-400" },
  { kind: "cmd", cmd: "echo",  args: "[text]",  desc: "Echo text to the terminal",        cmdColor: "text-cyan-400" },
  { kind: "cmd", cmd: "cat",   args: "[file]",  desc: "Display contents of a file",       cmdColor: "text-cyan-400" },
  { kind: "cmd", cmd: "ping",  args: "[host]",  desc: "Simulate a network ping",          cmdColor: "text-cyan-400" },
  { kind: "cmd", cmd: "history",  desc: "Show previously entered commands",   cmdColor: "text-cyan-400" },
  { kind: "cmd", cmd: "man",   args: "[cmd]",   desc: "Show manual entry for a command",  cmdColor: "text-cyan-400" },
  { kind: "cmd", cmd: "sudo",  args: "[cmd]",   desc: "Run command as superuser",         cmdColor: "text-cyan-400" },
  { kind: "blank" },
  { kind: "section", label: "Fun" },
  { kind: "cmd", cmd: "matrix",  desc: "Launch Matrix rain animation (6s)",               cmdColor: "text-green-300" },
  { kind: "cmd", cmd: "hack",  args: "[target]",  desc: "Run cinematic breach simulation on target", cmdColor: "text-green-300" },
  { kind: "blank" },
  { kind: "section", label: "Shell" },
  { kind: "cmd", cmd: "clear",  desc: "Clear all terminal output",     cmdColor: "text-slate-400" },
  { kind: "cmd", cmd: "exit",   desc: "Close the terminal window",     cmdColor: "text-slate-400" },
  { kind: "blank" },
  { kind: "tip", text: "↑ / ↓  navigate history   ·   Tab  autocomplete   ·   Ctrl+L  clear" },
];

function HelpOutput() {
  return (
    <div className="my-1 font-mono text-xs">
      <div className="text-slate-400 mb-2">
        Usage: <span className="text-slate-200">{"<command>"}</span>{" "}
        <span className="text-slate-500">[arguments]</span>
      </div>
      {HELP_ROWS.map((row, i) => {
        if (row.kind === "blank") return <div key={i} className="h-1" />;

        if (row.kind === "section") {
          return (
            <div key={i} className="flex items-center gap-2 mt-2 mb-1">
              <span className="text-slate-600 uppercase tracking-widest text-[10px]">{row.label}</span>
              <span className="flex-1 border-t border-slate-800" />
            </div>
          );
        }

        if (row.kind === "tip") {
          return (
            <div key={i} className="mt-2 text-slate-600 text-[10px] tracking-wide">
              {row.text}
            </div>
          );
        }

        return (
          <div key={i} className="flex items-baseline gap-0 leading-6 group">
            <span className={`w-28 shrink-0 ${row.cmdColor} font-semibold`}>{row.cmd}</span>
            <span className="w-16 shrink-0 text-slate-600 text-[10px]">{row.args ?? ""}</span>
            <span className="text-slate-500 select-none mx-1">—</span>
            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">{row.desc}</span>
          </div>
        );
      })}
    </div>
  );
}

function Banner() {
  return (
    <div className="mb-3 leading-5 font-mono text-xs">
      <div className="text-cyan-500 font-bold">{"╔═════════════════════════════════════════════════════╗"}</div>
      <div className="text-cyan-500 font-bold">{"║       ATC // SECURE SHELL v1.0                      ║"}</div>
      <div className="text-cyan-500 font-bold">{"║       Cyber Security Architect & Researcher         ║"}</div>
      <div className="text-cyan-500 font-bold">{"╚═════════════════════════════════════════════════════╝"}</div>
      <div className="text-slate-500 mt-1.5">
        Type <span className="text-green-400 font-bold">help</span> to see all commands.
        {" "}Try <span className="text-cyan-400">whoami</span>, <span className="text-yellow-400">myipaddress</span>, or <span className="text-green-300">matrix</span>.
      </div>
      <div className="text-slate-600 text-[11px] mt-0.5">↑/↓ history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Ctrl+L clear</div>
    </div>
  );
}

interface TerminalWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  externalCommand: string | null;
  onExternalCommandConsumed: () => void;
}

const ALL_CMDS = [
  "help", "whoami", "myipaddress", "neofetch", "certs", "matrix", "hack",
  "about", "skills", "experience", "services", "projects", "contact",
  "socials", "research", "blog", "theme",
  "ls", "pwd", "date", "uptime", "hostname", "uname",
  "echo", "cat", "ping", "history", "man", "sudo",
  "clear", "exit",
];

function TerminalWindow({ onClose, onMinimize, onMaximize, isMaximized, externalCommand, onExternalCommandConsumed }: TerminalWindowProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([{ type: "banner" }]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const { theme: themeMode, toggleTheme } = useTheme();
  const [contactFlow, setContactFlow] = useState<{
    step: "name" | "email" | "message";
    name: string;
    email: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (!isProcessing) inputRef.current?.focus();
  }, [isProcessing]);

  const runCommand = useCallback(
    async (raw: string, fromExternal = false) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      if (contactFlow) {
        if (!fromExternal) {
          setCmdHistory((prev) => [trimmed, ...prev]);
          setCmdHistoryIndex(-1);
        }
        setHistory((prev) => [...prev, { type: "input", text: raw }]);

        if (trimmed.toLowerCase() === "exit" || trimmed.toLowerCase() === "cancel") {
          setContactFlow(null);
          playOutputTick();
          setHistory((prev) => [...prev, { type: "output", lines: [
            { text: "  [i] Message session cancelled.", color: "text-slate-500" },
            { text: "" },
          ]}]);
          return;
        }

        if (contactFlow.step === "name") {
          setContactFlow({ step: "email", name: trimmed, email: "" });
          playOutputTick();
          setHistory((prev) => [...prev, { type: "output", lines: [
            { text: `  [+] Name logged: ${trimmed}`, color: "text-green-400" },
            { text: "" },
            { text: "  Enter your email address:", color: "text-cyan-400" },
            { text: "" },
          ]}]);
        } else if (contactFlow.step === "email") {
          if (!trimmed.includes("@") || !trimmed.includes(".")) {
            setHistory((prev) => [...prev, { type: "output", lines: [
              { text: "  [!] Invalid email format. Try again.", color: "text-red-400" },
            ]}]);
            return;
          }
          setContactFlow({ ...contactFlow, step: "message", email: trimmed });
          playOutputTick();
          setHistory((prev) => [...prev, { type: "output", lines: [
            { text: `  [+] Email logged: ${trimmed}`, color: "text-green-400" },
            { text: "" },
            { text: "  Enter your message:", color: "text-cyan-400" },
            { text: "" },
          ]}]);
        } else {
          const { name, email } = contactFlow;
          const subject = encodeURIComponent(`[Portfolio] Message from ${name}`);
          const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${trimmed}`);
          window.open(`mailto:admin@cyberamit.in?subject=${subject}&body=${body}`, "_blank");
          setContactFlow(null);
          playOutputTick();
          setHistory((prev) => [...prev, { type: "output", lines: [
            { text: "" },
            { text: "  ╔══════════════════════════════════════════════════════╗", color: "text-green-800" },
            { text: "  ║   ✓  MESSAGE QUEUED — OPENING MAIL CLIENT            ║", color: "text-green-400", bold: true },
            { text: "  ╠══════════════════════════════════════════════════════╣", color: "text-green-800" },
            { text: `  ║   To   : admin@cyberamit.in                          ║`, color: "text-green-300" },
            { text: `  ║   From : ${name.substring(0, 42).padEnd(43)}║`, color: "text-green-300" },
            { text: "  ╚══════════════════════════════════════════════════════╝", color: "text-green-800" },
            { text: "" },
          ]}]);
        }
        return;
      }

      const parts = trimmed.toLowerCase().split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);

      if (!fromExternal) {
        setCmdHistory((prev) => [trimmed, ...prev]);
        setCmdHistoryIndex(-1);
      }

      setHistory((prev) => [...prev, { type: "input", text: raw }]);
      setIsProcessing(true);

      const result = await resolveCommand(cmd, args, cmdHistory, themeMode);
      setIsProcessing(false);

      if (result.action === "clear") {
        playClear();
        setHistory([{ type: "banner" }]);
        return;
      }

      if (result.action === "help") {
        playOutputTick();
        setHistory((prev) => [...prev, { type: "help" }]);
        return;
      }

      if (result.action === "matrix") {
        playMatrixBoot();
        setHistory((prev) => [...prev, { type: "output", lines: result.lines }]);
        setTimeout(() => setShowMatrix(true), 400);
        return;
      }

      if (result.action === "contact-init") {
        setContactFlow({ step: "name", name: "", email: "" });
        playOutputTick();
        setHistory((prev) => [...prev, { type: "output", lines: [
          { text: "" },
          { text: "  ╔══════════════════════════════════════════════════════╗", color: "text-cyan-800" },
          { text: "  ║   SECURE MESSAGE CHANNEL — INITIATED                 ║", color: "text-cyan-400", bold: true },
          { text: "  ╚══════════════════════════════════════════════════════╝", color: "text-cyan-800" },
          { text: "" },
          { text: "  [*] Establishing encrypted link to admin@cyberamit.in", color: "text-slate-400" },
          { text: "  [+] Channel secured. Message opens your mail client.", color: "text-green-400" },
          { text: "  [i] Type 'exit' at any step to cancel.", color: "text-slate-500" },
          { text: "" },
          { text: "  Enter your name:", color: "text-cyan-400" },
          { text: "" },
        ]}]);
        setIsProcessing(false);
        return;
      }

      if (result.action === "theme") {
        const newTheme = themeMode === "dark" ? "light" : "dark";
        toggleTheme();
        const themeLines = [
          { text: "" },
          { text: `  Theme switched to: ${newTheme.toUpperCase()} MODE`, color: newTheme === "dark" ? "text-cyan-400" : "text-yellow-300", bold: true },
          { text: newTheme === "dark" ? "  Welcome back to the shadows." : "  Stepping into the light... brave choice.", color: "text-slate-400" },
          { text: "" },
        ];
        playOutputTick();
        setHistory((prev) => [...prev, { type: "output", lines: themeLines }]);
        setIsProcessing(false);
        return;
      }

      if (result.action === "certs") {
        const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
        const push = (text: string, color = "text-slate-400", bold = false) => {
          if (text.trim()) playOutputTick();
          setHistory((prev) => [...prev, { type: "output" as const, lines: [{ text, color, bold }] }]);
        };

        const CERTS = [
          {
            badge: "CCIE",
            title: "CISCO CERTIFIED INTERNETWORK EXPERT",
            detail: "Security Specialization  ·  Credential ID: #53175",
            vendor: "Cisco Systems",
            color: "text-cyan-300" as const,
            border: "text-cyan-800" as const,
          },
          {
            badge: "CCNA",
            title: "CISCO CERTIFIED NETWORK ASSOCIATE",
            detail: "Routing & Switching · Security Track",
            vendor: "Cisco Systems",
            color: "text-cyan-300" as const,
            border: "text-cyan-800" as const,
          },
          {
            badge: "AWS-S",
            title: "AWS CERTIFIED SECURITY — SPECIALTY",
            detail: "Cloud Security Architecture & Compliance",
            vendor: "Amazon Web Services",
            color: "text-yellow-300" as const,
            border: "text-yellow-800" as const,
          },
          {
            badge: "CEH",
            title: "CERTIFIED ETHICAL HACKER",
            detail: "Penetration Testing · Adversarial Research",
            vendor: "EC-Council",
            color: "text-red-300" as const,
            border: "text-red-900" as const,
          },
          {
            badge: "AWS-AI",
            title: "AWS CERTIFIED AI PRACTITIONER",
            detail: "AI Security & Emerging Threat Detection",
            vendor: "Amazon Web Services",
            color: "text-green-300" as const,
            border: "text-green-800" as const,
          },
        ];

        push(""); await delay(150);
        push("  [*] Accessing credential vault...", "text-cyan-400"); await delay(500);
        push("  [+] Vault decrypted — 5 credentials found", "text-green-400", true); await delay(300);
        push("  [*] Rendering credential cards...", "text-slate-500"); await delay(400);
        push("");

        for (const cert of CERTS) {
          push(`  ╔══════════════════════════════════════════════════════╗`, cert.border);
          push(`  ║  ★  ${cert.badge.padEnd(6)}  ${cert.title.padEnd(43)}║`, cert.color, true);
          push(`  ║         ${cert.detail.padEnd(46)}║`, "text-slate-400");
          push(`  ║         Issued by : ${cert.vendor.padEnd(34)}║`, "text-slate-500");
          push(`  ║         Status    : ████████████████████  VERIFIED ✓  ║`, "text-green-400");
          push(`  ╚══════════════════════════════════════════════════════╝`, cert.border);
          push("");
          await delay(320);
        }

        push("  [+] All credentials verified and active.", "text-green-400", true); await delay(200);
        push("  [i] Verify at: linkedin.com/in/amittchouhan", "text-slate-500"); await delay(100);
        push("");
        setIsProcessing(false);
        return;
      }

      if (result.action?.startsWith("hack:")) {
        const target = result.action.slice(5) || "localhost";
        const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
        const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1) + a);
        const randIp = () => `${rand(1,254)}.${rand(1,254)}.${rand(1,254)}.${rand(1,254)}`;
        const push = (text: string, color = "text-slate-400", bold = false) => {
          if (text.trim()) playHackTick();
          setHistory((prev) => [...prev, { type: "output" as const, lines: [{ text, color, bold }] }]);
        };
        const bar = (pct: number) => {
          const filled = Math.floor(pct / 5);
          return "  " + "█".repeat(filled) + "░".repeat(20 - filled) + `  ${pct}%`;
        };

        const ip = randIp();
        const cve = `CVE-2024-${rand(10000, 99999)}`;
        const ports = [
          `  22/tcp   open  ssh      OpenSSH 8.9p1`,
          `  80/tcp   open  http     nginx 1.24.0`,
          `  443/tcp  open  https    nginx 1.24.0`,
          `  3306/tcp open  mysql    MySQL 8.0.33`,
        ];

        playHackStart();
        push(""); await delay(200);
        push(`  [*] BREACH PROTOCOL v2.1 — Initializing...`, "text-cyan-400", true); await delay(400);
        push(`  [*] Target     : ${target}`, "text-cyan-300"); await delay(300);
        push(`  [*] Operator   : atc@cyberamit`, "text-cyan-300"); await delay(300);
        push(`  [*] Session ID : ${Math.random().toString(36).slice(2, 10).toUpperCase()}`, "text-cyan-300"); await delay(500);
        push(""); await delay(100);
        push(`  [*] Resolving hostname...`, "text-slate-400"); await delay(600);
        push(`  [+] Resolved   : ${ip}`, "text-green-400"); await delay(400);
        push(`  [+] Geo        : Unknown / Datacenter AS${rand(10000,99999)}`, "text-green-400"); await delay(500);
        push(""); await delay(100);
        push(`  [*] Running SYN port scan on ${ip}...`, "text-slate-400"); await delay(800);
        push(`  PORT       STATE  SERVICE  VERSION`, "text-slate-500"); await delay(100);
        for (const p of ports) { push(p, "text-green-400"); await delay(180); }
        push(`  [+] ${ports.length} open ports discovered`, "text-green-400"); await delay(500);
        push(""); await delay(100);
        push(`  [*] Scanning vulnerability database...`, "text-slate-400"); await delay(900);
        push(`  [!] Critical vuln found: ${cve}`, "text-yellow-400", true); await delay(300);
        push(`  [!] CVSS Score : ${(rand(85, 99) / 10).toFixed(1)} (CRITICAL)`, "text-yellow-400"); await delay(300);
        push(`  [!] Vector     : Network / No Auth Required`, "text-yellow-400"); await delay(500);
        push(""); await delay(100);
        push(`  [*] Loading exploit module for ${cve}...`, "text-slate-400"); await delay(700);
        push(`  [*] Payload    : reverse_shell/x64/meterpreter`, "text-slate-400"); await delay(400);

        push(""); await delay(100);
        push(`  [*] Uploading payload:`, "text-slate-400"); await delay(300);
        for (const pct of [0, 20, 40, 60, 80, 100]) {
          const color = pct === 100 ? "text-green-400" : "text-cyan-400";
          setHistory((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.type === "output" && (last.lines[0]?.text?.startsWith("  " + "█") || last.lines[0]?.text?.startsWith("  ░"))) {
              next[next.length - 1] = { type: "output", lines: [{ text: bar(pct), color }] };
              return next;
            }
            return [...prev, { type: "output", lines: [{ text: bar(pct), color }] }];
          });
          await delay(220);
        }
        push(`  [+] Payload delivered (${rand(180, 512)} bytes)`, "text-green-400"); await delay(400);
        push(""); await delay(100);
        push(`  [*] Bypassing IDS/IPS...`, "text-slate-400"); await delay(600);
        push(`  [*] Evading signature detection...`, "text-slate-400"); await delay(500);
        push(`  [+] Firewall bypassed`, "text-green-400"); await delay(400);
        push(`  [*] Escalating privileges...`, "text-slate-400"); await delay(700);
        push(`  [+] Root access obtained`, "text-green-400"); await delay(400);
        push(""); await delay(200);
        playHackSuccess();
        push(`  ╔══════════════════════════════════════════════════╗`, "text-green-500");
        push(`  ║                                                  ║`, "text-green-500");
        push(`  ║        ✓  BREACH SUCCESSFUL                      ║`, "text-green-400", true);
        push(`  ║        Target: ${target.padEnd(33)}║`, "text-green-300");
        push(`  ║        Access: ROOT SHELL — Full Control          ║`, "text-green-300");
        push(`  ║                                                  ║`, "text-green-500");
        push(`  ╚══════════════════════════════════════════════════╝`, "text-green-500");
        push(""); await delay(300);
        push(`  [NOTE] This is a simulated sequence. Stay ethical. 🛡`, "text-slate-600");
        push("");

        setIsProcessing(false);
        return;
      }

      if (result.action === "exit") {
        result.lines.forEach((l, i) => {
          if (l.text?.trim()) setTimeout(() => playOutputTick(), i * 40);
        });
        setHistory((prev) => [...prev, { type: "output", lines: result.lines }]);
        setTimeout(onClose, 600);
        return;
      }

      if (result.action?.startsWith("nav:")) {
        const section = result.action.slice(4);
        playSuccess();
        setHistory((prev) => [...prev, { type: "output", lines: result.lines }]);
        setTimeout(() => scrollToSection(section), 300);
        return;
      }

      const hasError = result.lines.some(
        (l) => l.color === "text-red-400" || l.color === "text-red-500"
      );
      if (hasError) {
        playError();
      } else {
        result.lines.forEach((l, i) => {
          if (l.text?.trim()) setTimeout(() => playOutputTick(), i * 35);
        });
      }
      setHistory((prev) => [...prev, { type: "output", lines: result.lines }]);
    },
    [cmdHistory, onClose, contactFlow, themeMode]
  );

  useEffect(() => {
    if (externalCommand) {
      runCommand(externalCommand, true);
      onExternalCommandConsumed();
    }
  }, [externalCommand, runCommand, onExternalCommandConsumed]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isProcessing) return;
      playExecute();
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cmdHistoryIndex + 1, cmdHistory.length - 1);
      setCmdHistoryIndex(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(cmdHistoryIndex - 1, -1);
      setCmdHistoryIndex(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input) return;
      const match = ALL_CMDS.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      playClear();
      setHistory([{ type: "banner" }]);
    } else if (showMatrix) {
      setShowMatrix(false);
    }
  };

  return (
    <div
      className="relative flex flex-col w-full h-full rounded-lg overflow-hidden border border-cyan-900/50 shadow-2xl shadow-black/60"
      style={{ background: "rgba(2, 6, 15, 0.97)" }}
      onClick={() => !isProcessing && inputRef.current?.focus()}
    >
      <AnimatePresence>
        {showMatrix && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30"
          >
            <MatrixRain
              onDone={() => {
                setShowMatrix(false);
                setHistory((prev) => [
                  ...prev,
                  {
                    type: "output",
                    lines: [
                      { text: "  [*] Matrix protocol terminated.", color: "text-green-400" },
                      { text: "  [*] Returning to secure shell...", color: "text-slate-500" },
                      { text: "" },
                    ],
                  },
                ]);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyan-900/30 shrink-0"
        style={{ background: "rgba(10, 16, 28, 0.98)" }}>
        <button
          data-testid="terminal-close"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
        />
        <button
          data-testid="terminal-minimize"
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
        />
        <button
          data-testid="terminal-maximize"
          onClick={(e) => { e.stopPropagation(); onMaximize(); }}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
        />
        <div className="flex-1 flex items-center justify-center gap-1.5 text-xs font-mono text-slate-500 select-none">
          <TerminalIcon className="w-3 h-3" />
          <span>amit@secure-shell: ~</span>
          {isProcessing && <span className="text-cyan-500 animate-pulse ml-2">processing...</span>}
        </div>
        <Maximize2
          className="w-3 h-3 text-slate-600 hover:text-slate-400 cursor-pointer transition-colors"
          onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        />
      </div>

      <div className="relative flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed scrollbar-thin scrollbar-thumb-cyan-900/40 scrollbar-track-transparent">
        {history.map((entry, i) => {
          if (entry.type === "banner") return <Banner key={i} />;
          if (entry.type === "help") return <HelpOutput key={i} />;
          if (entry.type === "input") {
            return (
              <div key={i} className="flex gap-2 text-slate-200 mt-1">
                <span className="text-cyan-500 shrink-0 select-none">amit@secure-shell:~$</span>
                <span className="text-slate-100">{entry.text}</span>
              </div>
            );
          }
          return <OutputLines key={i} lines={entry.lines} />;
        })}
        {isProcessing && (
          <div className="flex items-center gap-2 mt-1 text-cyan-500 text-xs">
            <span className="animate-pulse">▋</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div
        className="flex items-center gap-2 px-4 py-2 border-t border-cyan-900/30 shrink-0"
        style={{ background: "rgba(10, 16, 28, 0.98)" }}
      >
        <span className="text-cyan-500 font-mono text-xs shrink-0 select-none">
          {contactFlow
            ? contactFlow.step === "name"
              ? "name >"
              : contactFlow.step === "email"
              ? "email >"
              : "message >"
            : "amit@secure-shell:~$"}
        </span>
        <input
          ref={inputRef}
          data-testid="terminal-input"
          type="text"
          value={input}
          onChange={(e) => { playKeystroke(); setInput(e.target.value); }}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="flex-1 bg-transparent font-mono text-xs text-slate-100 outline-none caret-cyan-400 placeholder-slate-700 disabled:opacity-50"
          placeholder={isProcessing ? "processing..." : "type a command..."}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default function Terminal() {
  const { isOpen, setIsOpen, pendingCommand, clearPending } = useTerminal();
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  return (
    <>
      {!isOpen && !minimized && (
        <button
          data-testid="terminal-toggle-mobile"
          onClick={() => setIsOpen(true)}
          aria-label="Open terminal"
          className="md:hidden fixed bottom-5 right-5 z-[60] flex items-center gap-2 px-3 py-2 font-mono text-xs rounded-lg border shadow-lg"
          style={{
            background: "rgba(10, 16, 28, 0.95)",
            borderColor: "rgba(6, 182, 212, 0.4)",
            color: "rgb(6, 182, 212)",
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.15)",
          }}
        >
          <TerminalIcon className="w-4 h-4" />
          <span>{">_ shell"}</span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && !minimized && (
          <motion.div
            key="terminal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setMaximized(false); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !minimized && (
          <motion.div
            key="terminal"
            data-testid="terminal-window"
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`fixed z-50 ${
              maximized
                ? "inset-6"
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] h-[580px] max-w-[96vw] max-h-[90vh]"
            }`}
          >
            <TerminalWindow
              onClose={() => { setIsOpen(false); setMaximized(false); }}
              onMinimize={() => setMinimized(true)}
              onMaximize={() => setMaximized((v) => !v)}
              isMaximized={maximized}
              externalCommand={pendingCommand}
              onExternalCommandConsumed={clearPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {minimized && (
          <motion.div
            key="minimized-bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-6 z-[60]"
          >
            <button
              onClick={() => { setMinimized(false); setIsOpen(true); }}
              className="flex items-center gap-2 px-3 py-1.5 border border-yellow-500/30 text-yellow-400 font-mono text-xs rounded shadow-lg hover:border-yellow-400 transition-all"
              style={{ background: "rgba(10, 16, 28, 0.95)" }}
            >
              <Minus className="w-3 h-3" />
              amit@secure-shell — minimized
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
