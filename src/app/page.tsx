import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Personality from "@/components/Personality";
import Contact from "@/components/Contact";
import FloatingNav from "@/components/FloatingNav";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#121212] overflow-clip">
        <FloatingNav />
        <ScrollyCanvas frameCount={40} />
        <Overlay />
        <Projects />
        <Skills />
        <Personality />
        <Contact />
      </main>
    </SmoothScrollProvider>
  );
}
