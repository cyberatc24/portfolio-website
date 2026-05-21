import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 22, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
    />
  );
}
