import { motion } from "framer-motion";

// Subjective mastery 0..1 across nine domains, used as a visual summary only.
const AXES = [
  { label: "Cloud Sec", value: 0.95 },
  { label: "Network", value: 0.95 },
  { label: "Pentest", value: 0.78 },
  { label: "AI/ML Sec", value: 0.72 },
  { label: "Compliance", value: 0.85 },
  { label: "IAM / ZT", value: 0.9 },
  { label: "DevSecOps", value: 0.8 },
  { label: "SIEM / SOC", value: 0.82 },
  { label: "Threat Intel", value: 0.75 },
];

const SIZE = 360;
const CENTER = SIZE / 2;
const RADIUS = 140;
const RINGS = 4;

function polar(angle: number, r: number) {
  return { x: CENTER + Math.cos(angle - Math.PI / 2) * r, y: CENTER + Math.sin(angle - Math.PI / 2) * r };
}

export default function SkillRadar() {
  const step = (Math.PI * 2) / AXES.length;
  const points = AXES.map((a, i) => polar(i * step, RADIUS * a.value));
  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative bg-card/40 border border-border rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="shrink-0">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-label="Skill radar chart">
          {/* concentric rings */}
          {Array.from({ length: RINGS }).map((_, i) => (
            <circle
              key={i}
              cx={CENTER}
              cy={CENTER}
              r={(RADIUS / RINGS) * (i + 1)}
              fill="none"
              stroke="rgba(6,182,212,0.15)"
              strokeDasharray="2 4"
            />
          ))}
          {/* spokes */}
          {AXES.map((_, i) => {
            const p = polar(i * step, RADIUS);
            return (
              <line key={i} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke="rgba(6,182,212,0.15)" />
            );
          })}
          {/* polygon */}
          <motion.polygon
            points={polygon}
            fill="rgba(6,182,212,0.18)"
            stroke="rgb(6,182,212)"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />
          {/* node dots */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#d946ef"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.04 }}
            />
          ))}
          {/* labels */}
          {AXES.map((a, i) => {
            const p = polar(i * step, RADIUS + 20);
            const anchor = Math.abs(p.x - CENTER) < 4 ? "middle" : p.x > CENTER ? "start" : "end";
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fill="rgba(148,163,184,0.9)"
              >
                {a.label}
              </text>
            );
          })}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">Mastery Profile</p>
        <h3 className="text-xl font-bold text-foreground mb-2">Where I operate strongest</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A decade of hands-on work concentrated in cloud and network security, with deep cross-coverage of identity,
          compliance, and security operations. AI/ML security is the active research frontier.
        </p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {AXES.map((a) => (
            <li key={a.label} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">{a.label}</span>
              <span className="font-mono text-primary">{Math.round(a.value * 100)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
