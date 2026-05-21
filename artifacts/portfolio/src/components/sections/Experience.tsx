import { motion } from "framer-motion";
import { playHoverClick } from "@/lib/sounds";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import WorldMap from "@/components/effects/WorldMap";

const experiences = [
  {
    role: "Cyber Security Architect — Assistant Consultant",
    company: "Tata Consultancy Services",
    period: "May 2022 – Present",
    tags: ["Cloud Security", "AWS", "Qualys VMDR"],
    highlights: [
      "Architected end-to-end cloud security frameworks on AWS — GuardDuty, WAF rule design, IAM governance, and Cloud Migration Security standards.",
      "Ran weekly compliance audits via McAfee Mvision; identified non-compliant resources and drove posture improvements for client stakeholders.",
      "Deployed and tuned Qualys VMDR for continuous vulnerability scanning; automated detection-to-remediation to drive down critical CVEs.",
      "Reviewed IAM policies, security groups, FQDN & IP whitelisting change requests in JIRA — enforcing least-privilege across all environments.",
    ],
  },
  {
    role: "Senior Cloud & Infrastructure Security Engineer",
    company: "L&T Infotech",
    period: "May 2019 – May 2022",
    tags: ["AWS VPC", "IPSec VPN", "IAM"],
    highlights: [
      "Designed AWS VPC Transit Gateway architecture — route-based IPSec tunnels connecting on-premises sites to cloud VPCs with sub-30ms failover.",
      "Hardened AWS IAM — custom least-privilege roles and policies across multi-account environments; managed EC2 security groups and Route53 DNS.",
      "Led Forcepoint Cloud Proxy and Aerohive Cloud Wi-Fi migrations with zero-downtime cutovers and full policy continuity.",
      "Resolved complex VPN and network security incidents; mentored junior engineers in AWS security best practices.",
    ],
  },
  {
    role: "Network & Security Consultant",
    company: "Capgemini",
    period: "August 2016 – April 2019",
    tags: ["Cisco ASA", "Check Point", "F5 LTM"],
    highlights: [
      "Managed global network security for a major client across Americas, Europe, APAC, and Australia — owning L2/L3 incident resolution within strict SLAs.",
      "Operated perimeter stack: Cisco ASA, Check Point firewalls, and Cisco Meraki — wrote and reviewed change requests, conducted security audits.",
      "Optimised internet egress via McAfee Proxy and Zscaler; managed wireless infrastructure and user authentication through Cisco ISE & ACS.",
      "Administered F5 LTM for load balancing; used SolarWinds to push config scripts and monitor continuous network performance.",
    ],
  },
  {
    role: "Network Security Engineer",
    company: "Indeo Technologies",
    period: "February 2015 – August 2016",
    tags: ["Check Point", "VPN", "Firewall"],
    highlights: [
      "Designed and deployed Check Point firewall infrastructure — rule sets, routing, NAT, and optimised lookup performance by pruning stale policies.",
      "Performed L3/L4 security implementations, vulnerability assessments, and intrusion detection across client environments.",
      "Monitored Check Point VPN tunnels, troubleshot connectivity via CLI, and managed appliance backup, restore, and firmware upgrades.",
    ],
  },
  {
    role: "NOC Engineer",
    company: "IT Source Technologies",
    period: "May 2014 – February 2015",
    tags: ["SIEM", "Cisco", "BMC Remedy"],
    highlights: [
      "Monitored Cisco routers (7609/7606), firewalls (SSG), and switching fabric across the TATA network — resolved routing, VLAN, STP, and DHCP issues.",
      "Operated SIEM tooling to collect, correlate, and investigate logs; escalated threats following triage.",
      "Provided L2 support for escalated connectivity, VPN, and browsing issues using BMC Remedy, CACTI, and CNR.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative border-t border-border/50">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        <div className="mb-10">
          <AnimatedHeading eyebrow="Experience">Professional Journey</AnimatedHeading>
        </div>

        <WorldMap />

        <div className="relative pl-8">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent"
          />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="relative group"
              onMouseEnter={playHoverClick}>
                <div className="absolute -left-[2.125rem] top-5 w-4 h-4 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors duration-300" />

                <div className="font-mono text-xs text-muted-foreground mb-2 ml-0">{exp.period}</div>

                <div className="relative overflow-hidden bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group-hover:-translate-y-0.5">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
                  <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                      {exp.role}
                    </h3>
                    <span className="font-mono text-sm text-primary font-bold shrink-0">{exp.company}</span>
                  </div>

                  <div className="relative flex flex-wrap gap-1.5 mb-4">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="relative space-y-2">
                    {exp.highlights.map((pt, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-3">
                        <span className="text-primary/70 mt-1 shrink-0 font-bold">—</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
