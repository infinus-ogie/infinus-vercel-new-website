"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function StickyBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercent >= 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto max-w-xl px-4 z-50 hidden md:block">
      <div className="gcard">
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-700">Spremni za sledeći korak?</span>
          <div className="flex gap-2">
            <Link 
              href="#downloads" 
              className="btn-primary rounded-xl h-9 px-4 flex items-center text-sm"
            >
              Preuzmite materijale
            </Link>
            <Link 
              href="/contact" 
              className="h-9 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center text-sm"
            >
              Zakažite konsultacije
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
