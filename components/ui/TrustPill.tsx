"use client";
import * as React from "react";

export function TrustPill({
  icon: Icon,
  children,
  tone = "blue", // "blue" | "gold"
  variant = "light", // "light" | "dark"
}: { 
  icon: React.ElementType<{ className?: string }>; 
  children: React.ReactNode; 
  tone?: "blue"|"gold"; 
  variant?: "light"|"dark";
}) {
  const cls =
    variant === "dark"
      ? tone === "gold"
        ? "border-white/20 bg-white/10 text-white backdrop-blur"
        : "border-white/20 bg-white/10 text-white backdrop-blur"
      : tone === "gold"
        ? "border-[#8A6A2D] bg-[rgb(254,250,235)] text-slate-900"
        : "border-[#BFD7F5] bg-[#EEF5FF] text-slate-900";
  
  const iconCls = 
    variant === "dark"
      ? tone === "gold" ? "text-[#F4D03F]" : "text-[#60A5FA]"
      : tone === "gold" ? "text-[#8A6A2D]" : "text-[#0A6ED1]";
  
  return (
    <span
      className={
        "relative inline-flex items-center justify-center gap-2 rounded-full border px-2 py-1.5 text-sm font-medium " +
        cls
      }
    >
      {/* shimmer ring only for gold */}
      {tone === "gold" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: variant === "dark"
              ? "conic-gradient(from 0deg, rgba(255,255,255,0.0), rgba(255,255,255,0.08), rgba(255,255,255,0.0))"
              : "conic-gradient(from 0deg, rgba(200,155,60,0.0), rgba(230,192,92,0.35), rgba(200,155,60,0.0))",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            padding: "1px",
          }}
        />
      )}
      <span className={
        "inline-grid place-items-center size-6 rounded-full " + 
        (variant === "dark" 
          ? "bg-black/20 border border-white/10" 
          : "bg-white/80"
        ) + " " + iconCls
      }>
        <Icon className={"h-4 w-4 " + iconCls} />
      </span>
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
