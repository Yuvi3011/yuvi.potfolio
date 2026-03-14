"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Globe, Wrench, BookOpen, Sparkles } from 'lucide-react';

const skillsData = [
  {
    id: "programming",
    category: "Languages",
    title: "Core Programming",
    icon: Terminal,
    skills: ["Python", "C++", "JavaScript", "TypeScript"],
    gradient: "from-blue-500/20 via-blue-900/20 to-transparent",
    border: "group-hover:border-blue-500/50",
    textGlow: "text-blue-400"
  },
  {
    id: "web",
    category: "Development",
    title: "Web Technologies",
    icon: Globe,
    skills: ["React", "Next.js", "Tailwind CSS", "Node.js"],
    gradient: "from-emerald-500/20 via-emerald-900/20 to-transparent",
    border: "group-hover:border-emerald-500/50",
    textGlow: "text-emerald-400"
  },
  {
    id: "tools",
    category: "Workflow",
    title: "Modern Tools",
    icon: Wrench,
    skills: ["Git", "GitHub", "VS Code", "Figma"],
    gradient: "from-orange-500/20 via-orange-900/20 to-transparent",
    border: "group-hover:border-orange-500/50",
    textGlow: "text-orange-400"
  },
  {
    id: "learning",
    category: "Exploring",
    title: "Currently Learning",
    icon: BookOpen,
    skills: ["Three.js", "WebGL", "Data Structures", "System Design"],
    gradient: "from-pink-500/20 via-pink-900/20 to-transparent",
    border: "group-hover:border-pink-500/50",
    textGlow: "text-pink-400"
  }
];

export default function Skills() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="skills" className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center py-32 px-4 md:px-8 z-20 overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 w-full flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <Sparkles className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium tracking-wider text-white/80 uppercase">Technical Arsenal</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            Skill <span className="text-white/40 italic">Ecosystem</span>
          </h2>
        </motion.div>

        {/* Expanding Accordion Grid */}
        <div className="w-full h-[600px] flex flex-col md:flex-row gap-4">
          {skillsData.map((section) => {
            const isHovered = hoveredId === section.id;
            const Icon = section.icon;

            return (
              <motion.div
                key={section.id}
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
                layout
                initial={{ borderRadius: "24px" }}
                animate={{ 
                  flex: isHovered ? 3 : 1,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25, 
                  mass: 0.8 
                }}
                className={`relative h-full overflow-hidden bg-[#0f0f0f] border border-white/5 rounded-3xl group cursor-pointer ${section.border} transition-colors duration-500`}
              >
                {/* Dynamic Gradient Background */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-b md:bg-gradient-to-br ${section.gradient} opacity-0 transition-opacity duration-700`}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                />

                {/* Vertical Category Label (visible when not completely hovered, or kept as structural element) */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-start z-10">
                  <motion.div layout="position" className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0 transition-colors duration-500 ${isHovered ? 'bg-white/10' : ''}`}>
                      <Icon className="w-5 h-5 text-white/80" />
                    </div>
                    <motion.div
                      animate={{ opacity: isHovered ? 0 : 1, width: isHovered ? 0 : 'auto' }}
                      className="origin-left overflow-hidden md:-rotate-90 md:translate-y-24 md:-translate-x-6 md:absolute md:left-12 md:bottom-24 whitespace-nowrap"
                    >
                      <h3 className="text-xl font-medium tracking-widest uppercase text-white/50">{section.category}</h3>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="absolute inset-0 p-8 pt-24 md:pt-8 flex flex-col justify-end z-20 pointer-events-none"
                    >
                      <h4 className={`text-4xl font-bold mb-8 ${section.textGlow}`}>{section.title}</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {section.skills.map((skill, idx) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.05) }}
                            className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full md:w-3/4 max-w-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-white/50" />
                            <span className="text-lg text-white/90 font-medium">{skill}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
