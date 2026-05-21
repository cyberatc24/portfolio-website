import { motion } from "framer-motion";
import { Shield, ShieldAlert, Cloud, Bot, Award } from "lucide-react";
import { playHoverClick } from "@/lib/sounds";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import TiltCard from "@/components/ui/TiltCard";

const credentials = [
  {
    category: "CISCO — SECURITY",
    icon: Shield,
    title: "CCIE Security Expert",
    sub: "Credential #53175",
    desc: "One of the most elite networking and security certifications globally. Validates expert-level design, implementation, and troubleshooting of complex enterprise security architectures.",
  },
  {
    category: "EC-COUNCIL",
    icon: ShieldAlert,
    title: "Certified Ethical Hacker",
    sub: "CEH v11",
    desc: "Expert-level penetration testing and ethical hacking credential covering advanced attack techniques, CVE exploitation, vulnerability research, and adversarial methodology.",
  },
  {
    category: "AMAZON WEB SERVICES",
    icon: Cloud,
    title: "AWS Certified Security – Specialty",
    sub: "SCS-C02",
    desc: "Validates deep expertise in securing AWS workloads — covering IAM, GuardDuty, WAF, KMS, CloudTrail, encryption, and multi-account governance frameworks.",
  },
  {
    category: "AMAZON WEB SERVICES",
    icon: Bot,
    title: "AWS Certified AI Practitioner",
    sub: "AIF-C01",
    desc: "Validates foundational AI/ML knowledge on AWS with a focus on emerging AI security threats, LLM deployment safety, and ML pipeline protection strategies.",
  },
  {
    category: "CISCO SYSTEMS",
    icon: Award,
    title: "CCNA — Routing & Switching",
    sub: "Security Track",
    desc: "Foundation-level certification validating expertise in network fundamentals, routing, switching, and core network security principles across enterprise environments.",
  },
];

export default function Credentials() {
  return (
    <section id="credentials" className="py-24 relative border-t border-border/50 bg-card/20">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="mb-14">
          <AnimatedHeading eyebrow="Credentials">Achievements &amp; Certifications</AnimatedHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {credentials.map((cred, i) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={playHoverClick}
              >
                <TiltCard className="group overflow-hidden bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-colors duration-300 cursor-default">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">{cred.category}</p>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-0.5">{cred.title}</h3>
                      <p className="font-mono text-xs text-muted-foreground mb-3">{cred.sub}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{cred.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
