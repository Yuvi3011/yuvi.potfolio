"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Wrench, FolderKanban, Beaker, Mail } from "lucide-react";

/* ─── Nav Items ─────────────────────────────────────────── */
const navItems = [
  { label: "About", href: "#about", icon: User },
  { label: "Projects", href: "#projects", icon: FolderKanban },
  { label: "Skills", href: "#skills", icon: Wrench },
  { label: "Experiments", href: "#experiments", icon: Beaker },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("");
  const [visible, setVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  /* ── Show after scrolling past the hero (500vh ≈ first viewport) ── */
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Track which section is currently in view ── */
  useEffect(() => {
    const ids = navItems.map((item) => item.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ── Smooth scroll handler ── */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div className="relative flex items-center gap-1 px-2 py-2 rounded-2xl border border-white/[0.12] bg-[#0a0a0a]/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {/* Dynamic Accent Glow */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden -z-10">
              <motion.div
                animate={{
                  x: hoveredIdx !== null ? `${(hoveredIdx / (navItems.length - 1)) * 100}%` : "50%",
                  opacity: visible ? 1 : 0
                }}
                className="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-pink-500/20 blur-xl transition-all duration-700 pointer-events-none"
                style={{ transform: "translateX(-50%)" }}
              />
            </div>

            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href.replace("#", "");
              const isHovered = hoveredIdx === idx;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative flex items-center gap-2 px-3 py-2.5 md:px-5 md:py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Highlight pill */}
                  {(isActive || isHovered) && (
                    <motion.div
                      layoutId="navHighlight"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: isActive
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(255,255,255,0.06)",
                        boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.2)" : "none"
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon & Glow */}
                  <div className="relative flex items-center justify-center">
                    {isActive && (
                      <motion.div
                        layoutId="iconGlow"
                        className="absolute inset-0 blur-[8px] bg-blue-500/30 rounded-full"
                      />
                    )}
                    <Icon
                      className={`relative z-10 w-4 h-4 transition-all duration-300 ${
                        isActive
                          ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                          : isHovered
                          ? "text-white/90 scale-110"
                          : "text-white/40"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`relative z-10 hidden md:inline transition-all duration-300 ${
                      isActive
                        ? "text-white font-semibold"
                        : isHovered
                        ? "text-white/90"
                        : "text-white/50"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 md:hidden shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                    />
                  )}
                </motion.a>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
