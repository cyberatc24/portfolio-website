import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Services from "@/components/sections/Services";
import Credentials from "@/components/sections/Credentials";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Terminal from "@/components/Terminal";
import { TerminalProvider } from "@/context/TerminalContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CursorGlow from "@/components/effects/CursorGlow";
import CustomCursor from "@/components/effects/CustomCursor";
import BootSequence from "@/components/effects/BootSequence";
import ScrollProgressBar from "@/components/effects/ScrollProgressBar";
import LogoMarquee from "@/components/sections/LogoMarquee";

export default function Home() {
  return (
    <ThemeProvider>
      <TerminalProvider>
        <BootSequence />
        <ScrollProgressBar />
        <div className="relative flex flex-col min-h-screen">
          <CursorGlow />
          <CustomCursor />
          <Navbar />
          <main className="flex-grow">
            <Hero />
            <LogoMarquee />
            <About />
            <Skills />
            <Experience />
            <Services />
            <Credentials />
            <Projects />
            <Contact />
          </main>
          <footer className="border-t border-border py-8 text-center text-muted-foreground font-mono text-sm">
            <p>© {new Date().getFullYear()} Amit T Chouhan · Pune, India · Secure by design.</p>
          </footer>
          <Terminal />
        </div>
      </TerminalProvider>
    </ThemeProvider>
  );
}
