import { motion } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  BarChart2,
  MonitorCheck,
  Sliders,
  Lock,
  Sparkles,
  Eye,
  GraduationCap,
} from "lucide-react";
import { playHoverClick } from "@/lib/sounds";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import TiltCard from "@/components/ui/TiltCard";

const services = [
  {
    icon: Shield,
    title: "Cloud Security Assessment & Configuration Review",
    desc: "Deep-dive reviews of AWS, Azure, and GCP environments. Misconfiguration detection, policy audits, IAM analysis, and attack surface mapping across CSPM, CWPP, CIEM, and KSPM.",
    tags: ["CSPM", "CWPP", "CIEM", "KSPM", "Config Review"],
  },
  {
    icon: ShieldAlert,
    title: "Cloud Pentesting & Red Teaming",
    desc: "Offensive security engagements focused on privilege escalation, lateral movement, IAM exploitation, container breakouts, and attack path simulation in live cloud environments.",
    tags: ["Pentesting", "Red Team", "IAM Exploit", "Container Escape"],
  },
  {
    icon: BarChart2,
    title: "Cloud Security Architecture",
    desc: "Secure-by-default cloud architecture design. Landing zone blueprints, zero-trust networking, multi-account strategy, and reference architectures for multi-cloud setups.",
    tags: ["Architecture", "Zero Trust", "Landing Zone", "Multi-Cloud"],
  },
  {
    icon: MonitorCheck,
    title: "Cloud Security Pre-Sales",
    desc: "Technical pre-sales for cloud security products. PoC demonstrations, competitive analysis, customer threat modeling, RFP responses, and solution architecture for CSPM/CNAPP/CWPP platforms.",
    tags: ["Pre-Sales", "PoC", "RFP", "CNAPP"],
  },
  {
    icon: Sliders,
    title: "Compliance & Governance",
    desc: "Audit and implement CIS Benchmarks, NIST, ISO 27001, HIPAA, and GDPR. Build guardrails and policy-as-code that keep teams compliant without slowing them down.",
    tags: ["CIS", "NIST", "HIPAA", "GDPR", "ISO 27001"],
  },
  {
    icon: Lock,
    title: "DevSecOps & Pipeline Security",
    desc: "Bake security into CI/CD pipelines and SDLC. Automated scanning, policy-as-code, and secure container orchestration on EKS, AKS, and GKE.",
    tags: ["CI/CD", "Kubernetes", "Terraform", "IaC Scan"],
  },
  {
    icon: Sparkles,
    title: "AI + Cloud Security",
    desc: "Securing AI/ML workloads on cloud platforms. LLM deployment security, model endpoint hardening, AI pipeline protection, and ML-driven threat detection on cloud-native data.",
    tags: ["AI Security", "LLM", "ML Pipelines"],
  },
  {
    icon: Eye,
    title: "Cloud Monitoring & Detection",
    desc: "Real-time monitoring and anomaly detection with automated alerting and self-healing remediation. Built on CloudTrail, EventBridge, Lambda, and SIEM integrations.",
    tags: ["SIEM", "CloudTrail", "AI Detection"],
  },
  {
    icon: GraduationCap,
    title: "Security Training & Workshops",
    desc: "Cloud attack labs, security awareness workshops, and team upskilling. Red team exercises, CTF challenges, and AI-assisted threat hunting sessions.",
    tags: ["Labs", "Workshops", "CTF", "AI Training"],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative border-t border-border/50 bg-card/20">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="mb-14">
          <AnimatedHeading
            eyebrow="Services"
            description="Cloud security services covering pre-sales advisory, architecture design, offensive testing, and AI-powered threat detection."
          >
            What I Can Help With
          </AnimatedHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={playHoverClick}
              >
                <TiltCard className="group overflow-hidden bg-card border border-border rounded-xl p-6 flex flex-col gap-4 transition-colors duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
                  <div className="relative w-11 h-11 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <div className="relative flex-1">
                    <h4 className="font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors duration-200">
                      {svc.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{svc.desc}</p>
                  </div>

                  <div className="relative flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
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
