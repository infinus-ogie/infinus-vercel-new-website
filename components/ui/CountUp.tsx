"use client";
import * as React from "react";

export function CountUp({ 
  end, 
  prefix = "", 
  suffix = "", 
  durationMs = 1000, 
  inView = false, 
  className = "" 
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  inView?: boolean;
  className?: string;
}) {
  const [val, setVal] = React.useState(0);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  
  React.useEffect(() => {
    if (!inView || reduced) { 
      setVal(end); 
      return; 
    }
    
    let start: number | null = null;
    let raf: number;
    
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / durationMs, 1);
      // Apply light ease-out for the last 150ms
      let q;
      if (p < 0.85) {
        q = p;
      } else {
        // Ease out in the last 15% of the animation
        const remaining = (p - 0.85) / 0.15;
        q = 0.85 + remaining * 0.15;
      }
      setVal(Math.round(end * q));
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        // Ensure we reach the exact end value
        setVal(end);
      }
    };
    
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, durationMs, reduced]);
  
  return <span className={className}>{prefix}{val}{suffix}</span>;
}
