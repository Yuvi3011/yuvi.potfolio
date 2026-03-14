"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Data ──────────────────────────────────────────────── */
const traits = [
  {
    emoji: "☕",
    title: "Coffee Powered Developer",
    description: "Thrives on caffeine and late-night coding sessions.",
    accent: "#60a5fa", // blue-400
  },
  {
    emoji: "🎮",
    title: "Loves Building Games",
    description: "Enjoys experimenting with interactive projects and mechanics.",
    accent: "#34d399", // emerald-400
  },
  {
    emoji: "🚀",
    title: "Curious About AI",
    description: "Constantly exploring machine learning and new technologies.",
    accent: "#f472b6", // pink-400
  },
  {
    emoji: "🧠",
    title: "Always Curious",
    description: "Constantly exploring new tools and technologies.",
    accent: "#a78bfa", // violet-400
  },
  {
    emoji: "⚡",
    title: "Fast Learner",
    description: "Enjoy building things quickly and improving them.",
    accent: "#fbbf24", // amber-400
  },
  {
    emoji: "🛠",
    title: "Builder Mindset",
    description: "I prefer creating solutions rather than just studying theory.",
    accent: "#fb923c", // orange-400
  },
];

/* ─── Floating Particle ─────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }));
}

/* ─── 3D Tilt Card ───────────────────────────────────────── */
interface TiltCardProps {
  emoji: string;
  title: string;
  description: string;
  accent: string;
  index: number;
}

function TiltCard({ emoji, title, description, accent, index }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04,1.04,1.04)`);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
        className="relative group cursor-default"
      >
        {/* Gradient border glow */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
          style={{
            background: `linear-gradient(135deg, ${accent}66, transparent 60%, ${accent}44)`,
          }}
        />

        {/* Card body */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 overflow-hidden h-full">
          {/* Cursor-tracking glow */}
          <div
            className="absolute w-48 h-48 rounded-full pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
              left: `${glowPos.x}%`,
              top: `${glowPos.y}%`,
              transform: "translate(-50%,-50%)",
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-3">
            <span className="text-4xl w-14 h-14 flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.06]">
              {emoji}
            </span>
            <h3 className="text-lg md:text-xl font-semibold text-white/90 tracking-tight mt-2">
              {title}
            </h3>
            <p className="text-sm md:text-base text-white/50 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-60 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────────── */
export default function Personality() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [particles] = useState(() => generateParticles(30));

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center py-32 px-4 md:px-8 z-20 overflow-hidden"
      id="experiments"
    >
      {/* ── Background Particles ─────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: 0,
            }}
            animate={
              isInView
                ? {
                    opacity: [0, p.opacity, 0],
                    y: [0, -60, -120],
                    x: [0, Math.random() > 0.5 ? 15 : -15, 0],
                  }
                : {}
            }
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Ambient Glow ─────────────────────── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* ── Header ────────────────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20 w-full flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <span className="text-sm">✨</span>
            <span className="text-sm font-medium tracking-wider text-white/80 uppercase">
              Personality
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
            Beyond the{" "}
            <span className="text-white/40 italic">Code</span>
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-md">
            A few things that define me as a developer.
          </p>
        </motion.div>

        {/* ── Card Grid ──────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
          {traits.map((trait, i) => (
            <TiltCard key={trait.title} index={i} {...trait} />
          ))}
        </div>
      </div>
    </section>
  );
}
