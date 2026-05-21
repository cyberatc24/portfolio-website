import { motion, useReducedMotion } from "framer-motion";

// Coordinates approximated on an equirectangular projection (lon 0..360 → x 0..1000, lat 90..-90 → y 0..500)
// Then trimmed viewBox to focus on land masses.
type City = { name: string; x: number; y: number; home?: boolean };

const CITIES: City[] = [
  { name: "Pune", x: 695, y: 235, home: true }, // India
  { name: "London", x: 488, y: 145 },
  { name: "Frankfurt", x: 505, y: 155 },
  { name: "New York", x: 280, y: 180 },
  { name: "San Francisco", x: 175, y: 195 },
  { name: "Singapore", x: 765, y: 280 },
  { name: "Sydney", x: 880, y: 360 },
  { name: "Tokyo", x: 855, y: 195 },
  { name: "São Paulo", x: 340, y: 340 },
];

const HOME = CITIES.find((c) => c.home)!;

export default function WorldMap() {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card/40 p-6 mb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Reach</p>
          <h3 className="font-bold text-foreground">Global engagement footprint</h3>
        </div>
        <p className="hidden md:block font-mono text-xs text-muted-foreground">
          Americas · Europe · APAC · Australia
        </p>
      </div>

      <svg viewBox="0 0 1000 500" className="w-full h-auto" role="img" aria-label="World map of engagement cities">
        {/* faint dot grid as map texture */}
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(6,182,212,0.18)" />
          </pattern>
          <radialGradient id="city-glow">
            <stop offset="0%" stopColor="rgba(6,182,212,0.7)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="500" fill="url(#dot-grid)" />

        {/* arcs from home to every city */}
        {CITIES.filter((c) => !c.home).map((c, i) => {
          const mx = (HOME.x + c.x) / 2;
          const my = Math.min(HOME.y, c.y) - 80;
          const d = `M ${HOME.x} ${HOME.y} Q ${mx} ${my} ${c.x} ${c.y}`;
          return (
            <motion.path
              key={c.name}
              d={d}
              fill="none"
              stroke="url(#arc-grad)"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.85 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.4, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
        <defs>
          <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* city nodes */}
        {CITIES.map((c, i) => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r="14" fill="url(#city-glow)" opacity={reduce ? 0.6 : 1}>
              {!reduce && (
                <>
                  <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                </>
              )}
            </circle>
            <circle
              cx={c.x}
              cy={c.y}
              r={c.home ? 4 : 2.6}
              fill={c.home ? "#d946ef" : "#22d3ee"}
              stroke={c.home ? "#fff" : "none"}
              strokeWidth={c.home ? 0.8 : 0}
            />
            <text
              x={c.x + 8}
              y={c.y - 8}
              fontSize="11"
              fontFamily="ui-monospace, monospace"
              fill={c.home ? "#d946ef" : "rgba(148,163,184,0.85)"}
              fontWeight={c.home ? 700 : 400}
            >
              {c.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
