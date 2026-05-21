import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Phone, Send, TerminalSquare } from "lucide-react";
import { playHoverClick, playExecute, playSuccess } from "@/lib/sounds";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";

const contactItems = [
  {
    label: "Email",
    value: "admin@cyberamit.in",
    href: "mailto:admin@cyberamit.in",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+91 7045600559",
    href: "tel:+917045600559",
    icon: Phone,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/amittchouhan",
    href: "https://www.linkedin.com/in/amittchouhan/",
    icon: Linkedin,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    playExecute();
    const subject = encodeURIComponent(`[Portfolio] Message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.open(`mailto:admin@cyberamit.in?subject=${subject}&body=${body}`, "_blank");
    playSuccess();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 relative border-t border-border/50">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="mb-12 flex justify-center">
          <AnimatedHeading
            eyebrow="Contact"
            align="center"
            description="Need a security assessment, compliance review, or hands-on cloud engineering? I'm open to consulting engagements."
          >
            Let's Secure Your Cloud.
          </AnimatedHeading>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Direct contact options */}
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 px-1">
              › direct_channels
            </div>
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.label === "LinkedIn" ? "_blank" : undefined}
                  rel={item.label === "LinkedIn" ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  onMouseEnter={playHoverClick}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">{item.value}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Secure message channel form (the comm box) */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-primary/30 bg-card/60 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5"
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-primary/20 bg-primary/5">
              <TerminalSquare className="w-4 h-4 text-primary" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                secure_message_channel
              </span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                encrypted
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label htmlFor="contact-name" className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  <span className="text-primary">›</span> name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="your name"
                  className="w-full bg-background/60 border border-border focus:border-primary px-3 py-2 font-mono text-sm text-foreground rounded outline-none placeholder:text-muted-foreground/40 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  <span className="text-primary">›</span> email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@domain.com"
                  className="w-full bg-background/60 border border-border focus:border-primary px-3 py-2 font-mono text-sm text-foreground rounded outline-none placeholder:text-muted-foreground/40 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  <span className="text-primary">›</span> message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="tell me about your project..."
                  className="w-full bg-background/60 border border-border focus:border-primary px-3 py-2 font-mono text-sm text-foreground rounded outline-none placeholder:text-muted-foreground/40 transition-colors resize-none"
                />
              </div>

              <MagneticButton
                as="button"
                type="submit"
                onMouseEnter={playHoverClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-sm font-bold hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-200"
              >
                <Send className="w-4 h-4" />
                {sent ? "MESSAGE QUEUED ✓" : "TRANSMIT MESSAGE"}
              </MagneticButton>

              {sent && (
                <p className="font-mono text-[11px] text-green-400 text-center">
                  [+] channel secured — opening your mail client...
                </p>
              )}
              <p className="font-mono text-[10px] text-muted-foreground/60 text-center">
                opens your default mail client · zero tracking
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
