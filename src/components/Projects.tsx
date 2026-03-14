"use client";

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const projects = [
  {
    title: "Smart Shop Management",
    category: "SaaS / Dashboard",
    description: "A comprehensive digital dashboard for real-time shop management, analytics, and business insights.",
    image: "/projects/smart-shop-v2.jpg"
  },
  {
    title: "Race Crew",
    category: "WebGL / Gaming",
    description: "A high-octane 3D racing experience built on the web. Immersive physics and neon retro-futurism aesthetics.",
    image: "/projects/car-game.png"
  }
];

function ProjectCard({ project, index }: { project: { title: string, category: string, description: string, image: string }, index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create a subtle parallax effect for the image
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 w-full ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Image Container */}
      <div className="w-full md:w-[60%] h-[50vh] md:h-[70vh] relative overflow-hidden border border-white/10 bg-[#1a1a1a] rounded-xl group cursor-pointer shadow-black/50 shadow-2xl">
        <motion.div 
          style={{ y }} 
          className="absolute inset-0 w-full h-[130%] -top-[15%]"
        >
          <Image 
            src={project.image} 
            alt={project.title} 
            fill 
            className="object-cover filter grayscale-[20%] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
          />
        </motion.div>
        
        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000 z-10 pointer-events-none" />
      </div>

      {/* Text Container */}
      <div className="w-full md:w-[40%] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-mono text-white/40 tracking-widest uppercase">
              0{index + 1}
            </span>
            <div className="w-12 h-[1px] bg-white/20" />
            <span className="text-sm font-medium text-white/60 tracking-wider uppercase">
              {project.category}
            </span>
          </div>
          
          <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 group cursor-pointer transition-colors hover:text-white/80 shrink-0">
            {project.title}
          </h3>
          
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-8 max-w-md">
            {project.description}
          </p>

          <button className="flex items-center gap-3 text-sm uppercase tracking-widest font-semibold text-white group">
            <span className="relative overflow-hidden">
               <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">View Project</span>
               <span className="absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-white/70">View Project</span>
            </span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-black group-hover:scale-110">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative w-full bg-[#0a0a0a] py-32 md:py-64 px-6 md:px-16 text-white z-30 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-32 md:mb-48 pl-4 border-l-2 border-white/20"
        >
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 leading-none">
            My<br/><span className="text-white/40 italic">Projects</span>
          </h2>
          <p className="text-xl text-white/50 max-w-md font-light">
            A curated showcase of digital experiences crafting the intersection of design, motion, and code.
          </p>
        </motion.div>

        <div className="flex flex-col gap-32 md:gap-64">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
