import { motion } from "framer-motion";
import { playHoverClick } from "@/lib/sounds";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import TiltCard from "@/components/ui/TiltCard";
import SkillRadar from "@/components/sections/SkillRadar";

const skillGroups = [
  {
    title: "Cloud Platforms",
    tags: ["AWS", "Azure", "GCP"],
    highlight: false,
  },
  {
    title: "Cloud Security",
    tags: ["CSPM", "CNAPP", "CWPP", "KSPM", "SSPM", "CIEM", "Attack Path Analysis", "Threat Modeling"],
    highlight: false,
  },
  {
    title: "AI + Cloud",
    tags: ["LLM Security", "SageMaker", "Vertex AI", "Bedrock", "AI Threat Detection", "ML Pipeline Security"],
    highlight: false,
  },
  {
    title: "Compliance",
    tags: ["CIS", "NIST", "ISO 27001", "HIPAA", "GDPR"],
    highlight: false,
  },
  {
    title: "DevOps & Automation",
    tags: ["GitHub Actions", "Jenkins", "Docker", "Kubernetes", "EKS", "AKS", "GKE", "Terraform", "CloudFormation"],
    highlight: false,
  },
  {
    title: "Security Tools",
    tags: ["nmap", "Wireshark", "Burp Suite", "SQLMap", "OWASP ZAP", "ScoutSuite", "Pacu", "Prowler", "Nuclei", "cloud_enum"],
    highlight: false,
  },
  {
    title: "Network & Perimeter",
    tags: ["Cisco ASA", "Check Point", "Palo Alto NGFW", "F5 LTM", "Forcepoint", "IPSec / SSL VPN", "IDS/IPS", "Zscaler"],
    highlight: false,
  },
  {
    title: "Identity & Zero Trust",
    tags: ["Zero Trust Architecture", "AWS IAM", "Cisco ISE", "802.1X / NAC", "PAM", "RBAC", "FQDN Whitelisting"],
    highlight: false,
  },
  {
    title: "Certifications",
    tags: ["CCIE Security #53175", "CEH", "AWS Security Specialty", "AWS AI Practitioner", "CCNA"],
    highlight: false,
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative border-t border-border/50 bg-card/20">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="mb-10">
          <AnimatedHeading eyebrow="Expertise">Technical Skills</AnimatedHeading>
        </div>

        <div className="mb-10">
          <SkillRadar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={playHoverClick}
            >
              <TiltCard className="group overflow-hidden bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
                <h3 className="relative font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 group-hover:text-primary transition-colors">
                  {group.title}
                </h3>
                <div className="relative flex flex-wrap gap-2">
                  {group.tags.map((tag, j) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 + j * 0.025 }}
                      className="font-mono text-xs px-2 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
