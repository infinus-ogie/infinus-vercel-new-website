'use client';

import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function SimpleShaderBG() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create neural network-like pattern
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw multiple layers of animated circles
      for (let i = 0; i < 5; i++) {
        const radius = 100 + i * 50;
        const alpha = 0.1 + Math.sin(time + i) * 0.05;
        
        ctx.beginPath();
        ctx.arc(
          centerX + Math.sin(time * 0.5 + i) * 50,
          centerY + Math.cos(time * 0.3 + i) * 30,
          radius,
          0,
          Math.PI * 2
        );
        
        // Blue to purple gradient
        const hue = 240 + Math.sin(time + i) * 20; // Blue to purple
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${alpha})`;
        ctx.fill();
      }

      // Add some connecting lines
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + Math.sin(time * 2) * 0.05})`;
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 0.2;
        const x1 = centerX + Math.cos(angle) * 150;
        const y1 = centerY + Math.sin(angle) * 150;
        const x2 = centerX + Math.cos(angle + Math.PI) * 200;
        const y2 = centerY + Math.sin(angle + Math.PI) * 200;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Entrance animation
  useGSAP(() => {
    if (!wrapRef.current) return;
    gsap.set(wrapRef.current, { 
      filter: 'blur(20px)', 
      scale: 1.06, 
      autoAlpha: 0.75 
    });
    gsap.to(wrapRef.current, { 
      filter: 'blur(0px)', 
      scale: 1, 
      autoAlpha: 1, 
      duration: 1.2, 
      ease: 'power3.out', 
      delay: 0.2 
    });
  });

  // Respect prefers-reduced-motion
  const reduce = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (reduce) {
    return (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20" />
    );
  }

  return (
    <div ref={wrapRef} className="absolute inset-0 -z-10" aria-hidden>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
    </div>
  );
}
