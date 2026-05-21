import { motion } from "framer-motion";
import { ShieldAlert, Cloud, Search, Lock } from "lucide-react";
import { playHoverClick } from "@/lib/sounds";
import TiltCard from "@/components/ui/TiltCard";

const projects = [
  {
    icon: <Cloud className="w-8 h-8 text-primary/70 mb-4" />,
    title: "Enterprise Cloud Security Architecture",
    description:
      "Architected multi-layer cloud security for enterprise AWS environments at TCS — deployed GuardDuty for real-time threat detection, designed application-specific WAF rule sets, enforced least-privilege IAM governance, and established Cloud Migration Security standards adopted across client accounts.",
    tags: ["AWS", "GuardDuty", "WAF", "IAM", "Cloud Governance"],
  },
  {
    icon: <Lock className="w-8 h-8 text-primary/70 mb-4" />,
    title: "Zero Trust Network Access via Transit Gateway",
    description:
      "Designed and deployed a hub-and-spoke AWS Transit Gateway architecture linking distributed on-premises datacentres to multi-VPC cloud environments over route-based IPSec tunnels. Achieved sub-30ms failover and eliminated flat network trust assumptions across the hybrid estate.",
    tags: ["AWS Transit Gateway", "Zero Trust", "IPSec VPN", "VPC", "Hybrid Cloud"],
  },
  {
    icon: <Search className="w-8 h-8 text-primary/70 mb-4" />,
    title: "Vulnerability Research & VMDR Programme",
    description:
      "Established a continuous vulnerability management programme using Qualys VMDR — automated asset discovery, scan scheduling, CVE triage, and remediation tracking across cloud and on-prem assets. Reduced mean-time-to-remediate (MTTR) for critical vulnerabilities by driving automated detection-to-ticket workflows.",
    tags: ["Qualys VMDR", "CVE Research", "Threat Prioritisation", "Remediation Automation"],
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-primary/70 mb-4" />,
    title: "Global Firewall Architecture & Hardening",
    description:
      "Designed and hardened enterprise perimeter security across three organisations — Check Point, Cisco ASA, and Palo Alto deployments. Rationalised legacy rule bases, eliminated redundant policies, configured NAT and routing, and implemented VPN tunnel monitoring via Smart View Monitor and SIEM correlation.",
    tags: ["Check Point", "Cisco ASA", "Palo Alto", "SIEM", "Firewall Hardening"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative border-t border-border/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-3xl font-mono bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">04.OPERATIONS_LOG</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="h-[1px] flex-1 bg-gradient-to-r from-primary/70 to-transparent"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project, i) => (
            <motion.div key={i} variants={itemVariants} onMouseEnter={playHoverClick}>
              <TiltCard className="group bg-card border border-border p-8 hover:border-primary/50 transition-colors duration-300 flex flex-col h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl group-hover:bg-primary/15 transition-colors" />
                <div className="mb-4 relative">
                  {project.icon}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 relative">
                  {project.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
