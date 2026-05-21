import { motion } from "framer-motion";
import type { ReactNode } from "react";
import DecryptText from "@/components/ui/DecryptText";

type Props = {
  eyebrow?: string;
  children: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  decrypt?: boolean;
};

export default function AnimatedHeading({
  eyebrow,
  children,
  description,
  align = "left",
  className = "",
  decrypt = true,
}: Props) {
  const content =
    decrypt && typeof children === "string" ? <DecryptText text={children} /> : children;
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col ${alignClass} ${className}`}
    >
      {eyebrow && (
        <p className="font-mono text-sm text-primary uppercase tracking-widest mb-3">{eyebrow}</p>
      )}
      <h2 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent pb-3">
        {content}
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: align === "center" ? "center" : "left" }}
          className="absolute left-0 right-0 -bottom-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
        />
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl mt-4">{description}</p>
      )}
    </motion.div>
  );
}
