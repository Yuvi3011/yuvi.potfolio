"use client";

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';

interface ScrollyCanvasProps {
  frameCount: number;
}

export default function ScrollyCanvas({ frameCount }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Use Framer Motion to track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map 0-1 scroll progress to frame index 1-frameCount
  const currentFrameIndexes = useTransform(scrollYProgress, [0, 1], [1, frameCount]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // ezgif-frame-001.jpg format
      const indexStr = i.toString().padStart(3, '0');
      img.src = `/sequence/ezgif-frame-${indexStr}.jpg`;
      
      const checkDone = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };

      img.onload = checkDone;
      img.onerror = checkDone; // Don't hang if an image fails to load
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [frameCount]);

  // Draw on canvas based on scroll
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Get the current frame index from the motion value
      const frameIndex = Math.min(
        frameCount - 1, 
        Math.max(0, Math.floor(currentFrameIndexes.get() - 1))
      );
      
      const img = images[frameIndex];
      
      if (img && img.width > 0 && img.height > 0) {
        // Set actual size in memory (scaled to account for retina displays and CSS size).
        // For performance, we'll try to keep object-fit cover logic inside canvas drawing
        
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio  = Math.max( hRatio, vRatio ) * 1.1; // Increased zoom to completely hide watermark
      const centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      const centerShift_y = ( canvas.height - img.height*ratio ) / 2;  

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(
        img, 
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width*ratio, img.height*ratio
      );
    }
    
    animationFrameId = requestAnimationFrame(render);
  };

  render();

  // Resize canvas on window resize
  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  // Initial resize
  handleResize();
  window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loaded, images, currentFrameIndexes, frameCount]);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#121212]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Loader while images fetch */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 z-20 bg-[#121212]">
            Loading Sequence...
          </div>
        )}
        
        <canvas 
          ref={canvasRef}
          className="w-full h-full block"
        />
        
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
      </div>
    </div>
  );
}
