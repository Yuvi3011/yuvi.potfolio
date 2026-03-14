"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Section 1: 0% to 15% fades out
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  // Section 2: 25% to 45%
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.45], [50, -50]);

  // Section 3: 50% to 75%
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.75], [50, -50]);

  return (
    <div ref={containerRef} id="about" className="absolute top-0 left-0 w-full h-[500vh] pointer-events-none z-20">
      <div className="sticky top-0 h-screen w-full flex items-center p-8 md:p-16 text-white max-w-7xl mx-auto">
        
        {/* Section 1 */}
        <motion.div 
          style={{ opacity: opacity1, y: y1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-300 to-slate-500 drop-shadow-sm">
            YUVRAJ BABBAR
          </h1>
          <p className="text-xl md:text-3xl text-gray-300 font-light tracking-wide max-w-xl">
            Awwwards-level Creative Developer.
          </p>
        </motion.div>

        {/* Section 2 */}
        <motion.div 
          style={{ opacity: opacity2, y: y2 }}
          className="absolute inset-0 flex flex-col items-start justify-center text-left p-8 md:p-24"
        >
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-snug max-w-2xl drop-shadow-md">
            I build digital experiences.
          </h2>
          <p className="mt-6 text-lg md:text-2xl text-gray-400 font-light max-w-lg">
            Specializing in high-performance web applications and immersive animations.
          </p>
        </motion.div>

        {/* Section 3 */}
        <motion.div 
          style={{ opacity: opacity3, y: y3 }}
          className="absolute inset-0 flex flex-col items-end justify-center text-right p-8 md:p-24"
        >
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-snug max-w-2xl drop-shadow-md">
            Bridging design <br/> and engineering.
          </h2>
          <p className="mt-6 text-lg md:text-2xl text-gray-400 font-light max-w-lg">
            Every pixel holds purpose. Every interaction tells a story.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
