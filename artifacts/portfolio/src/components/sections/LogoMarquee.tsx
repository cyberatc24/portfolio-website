const ITEMS = [
  "AWS",
  "Azure",
  "GCP",
  "Cisco",
  "EC-Council",
  "ISC²",
  "Palo Alto",
  "Check Point",
  "Kubernetes",
  "Terraform",
  "Zscaler",
  "Qualys",
  "F5",
  "Forcepoint",
];

export default function LogoMarquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-label="Tools and platforms"
      className="relative border-y border-border/50 bg-card/20 py-6 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="marquee-track flex gap-12 whitespace-nowrap will-change-transform">
        {row.map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground/70 hover:text-primary transition-colors"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
