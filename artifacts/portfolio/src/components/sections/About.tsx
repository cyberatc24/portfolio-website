import { motion } from "framer-motion";
import { Server, MapPin, GraduationCap, Award } from "lucide-react";
import { playHoverClick } from "@/lib/sounds";
import TypewriterParagraph from "@/components/ui/TypewriterParagraph";

const ABOUT_PARAGRAPHS = [
  "I'm a Cyber Security Architect and Researcher with over a decade of hands-on experience designing, securing, and operating enterprise-scale security environments across cloud, network, and security operations domains. My expertise spans cloud security architecture on AWS and Azure, SIEM engineering and security monitoring, threat intelligence, zero-trust network access, enterprise firewall architecture, vulnerability research, ethical hacking, and AI-driven security innovation.",
  "Over the years, I've worked across global enterprise environments — from Fortune 500 NOC and SOC operations to cloud security governance and large-scale transformation programs within my current organization. My approach combines deep technical expertise with strategic security thinking, enabling organizations to build resilient, scalable, and adversary-aware security architectures.",
  "I specialize in understanding how attackers operate — analyzing attack paths, emerging threats, and adversarial techniques — so the defenses I design are proactive, intelligence-driven, and built for real-world attacks. With a growing focus on AI in cybersecurity, I'm actively exploring the intersection of artificial intelligence, threat detection, security automation, and modern defensive engineering to help shape the next generation of cyber defense.",
];

const certs = [
  "CCIE — Security #53175 (Cisco)",
  "CCNA — Cisco Certified Network Associate",
  "AWS Certified Security — Specialty",
  "Certified Ethical Hacker (CEH)",
  "AWS Certified AI Practitioner",
];

export default function About() {
  return (
    <section id="about" className="py-24 relative border-t border-border/50 bg-card/30">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="h-[1px] flex-1 bg-border" />
            <h2 className="text-3xl font-mono flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
              <Server className="w-6 h-6 text-primary" />
              01.ABOUT_ME
            </h2>
            <div className="h-[1px] flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-4">
              {ABOUT_PARAGRAPHS.map((p, i) => (
                <TypewriterParagraph
                  key={i}
                  text={p}
                  speed={8}
                  startDelay={i * 200}
                  className="text-lg leading-relaxed text-muted-foreground font-sans"
                />
              ))}
              <div className="flex items-center gap-2 pt-2 text-muted-foreground font-mono text-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                Pune, Maharashtra, India &nbsp;·&nbsp; Open to Remote &amp; Global Opportunities
              </div>
            </div>

            <div className="space-y-6">
              <div
                onMouseEnter={playHoverClick}
                className="bg-background border border-border p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs text-primary uppercase tracking-wider">Certifications</span>
                </div>
                <ul className="space-y-2">
                  {certs.map((c, i) => (
                    <li key={i} className="text-xs text-muted-foreground font-mono flex items-start gap-2">
                      <span className="text-primary mt-0.5 shrink-0">›</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                onMouseEnter={playHoverClick}
                className="bg-background border border-border p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs text-primary uppercase tracking-wider">Education</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono font-bold">B.E. Information Technology</p>
                <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">Priyatam Institute of Technology &amp; Management, Indore</p>
                <p className="text-xs text-primary font-mono mt-2">2008 – 2012</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
