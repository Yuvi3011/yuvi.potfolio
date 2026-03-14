"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

type CursorVariant = 'default' | 'hover' | 'project' | 'image' | 'hidden';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([]);

  // Mouse position values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the ring
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });

  // Spring for the dot (slightly faster response than default motion value if desired, but we'll use motion value directly for instant tracking)

  useEffect(() => {
    setMounted(true);
    let trailCount = 0;
    let lastTime = Date.now();
    let lastX = 0;
    let lastY = 0;

    const manageMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      // Trail generation logic
      const now = Date.now();
      const dt = now - lastTime;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = distance / dt;

      if (speed > 2 && distance > 10 && dt > 16) { // Only create trail on fast, significant movement
        setTrails(prev => [...prev.slice(-15), { // Keep max 15 particles
          id: trailCount++,
          x: e.clientX,
          y: e.clientY
        }]);
      }
      
      lastTime = now;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleInteractableEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Determine variant based on elements
      const isInteraction = target.closest('a') || target.closest('button') || target.closest('input') || target.closest('textarea');
      const isProjectCard = target.closest('[data-cursor="project"]');
      const isImage = target.closest('[data-cursor="image"]') || target.tagName.toLowerCase() === 'img';
      
      if (isProjectCard) setVariant('project');
      else if (isInteraction) setVariant('hover');
      else if (isImage) setVariant('image');
      else setVariant('default');
    };

    const handleInteractableLeave = () => {
      setVariant('default');
    };

    // Add event listeners
    window.addEventListener('mousemove', manageMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Use slightly delayed polling for the trail cleanup
    const cleanupInterval = setInterval(() => {
        setTrails(prev => {
           if(prev.length > 0) return prev.slice(1);
           return [];
        });
    }, 50);

    // Event delegation for interactables
    document.addEventListener('mouseover', handleInteractableEnter);
    document.addEventListener('mouseout', handleInteractableLeave);

    return () => {
      window.removeEventListener('mousemove', manageMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleInteractableEnter);
      document.removeEventListener('mouseout', handleInteractableLeave);
      clearInterval(cleanupInterval);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null; // Prevent SSR Hydration Mismatch

  const variants = {
    default: {
      width: 40,
      height: 40,
      border: '1px solid rgba(168, 85, 247, 0.4)', // soft purple border
      backgroundColor: 'transparent',
      boxShadow: '0 0 0px rgba(0,0,0,0)',
      scale: 1,
      mixBlendMode: 'normal' as const
    },
    hover: {
      width: 60,
      height: 60,
      border: '1px solid rgba(168, 85, 247, 0.8)', // glowing purple
      backgroundColor: 'rgba(34, 211, 238, 0.1)', // tiny cyan tint
      boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
      scale: 1,
      mixBlendMode: 'normal' as const
    },
    project: {
      width: 80,
      height: 80,
      border: '1px dashed rgba(34, 211, 238, 0.5)', // cyan dashed
      backgroundColor: 'rgba(34, 211, 238, 0.05)',
      boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)',
      scale: 1,
      mixBlendMode: 'normal' as const
    },
    image: {
      width: 120,
      height: 120,
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)',
      scale: 1,
      mixBlendMode: 'difference' as const // nice effect for images
    },
    hidden: { // Optional state if we want to hide it completely sometimes
      opacity: 0,
      scale: 0.5
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} hidden md:block`}>
      
      {/* Trails */}
      <AnimatePresence>
        {trails.map(trail => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 blur-[2px]"
            style={{
               x: trail.x - 4,
               y: trail.y - 4,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={variants}
        animate={variant}
        transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            mass: 0.5
        }}
      >
        {/* Optional inner gradient for the ring */}
        <div className="absolute inset-[-2px] rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 animate-[spin_4s_linear_infinite] opacity-50" style={{ zIndex: -1, mixBlendMode: 'screen' }} />
      </motion.div>

      {/* Center Dot (Instant track) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: variant === 'hover' ? 0.5 : variant === 'project' ? 1.5 : variant === 'image' ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Global CSS to hide default cursor on interactive elements when custom cursor is active */}
      <style jsx global>{`
        @media (min-width: 768px) {
          body, a, button, input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
    </div>
  );
}
