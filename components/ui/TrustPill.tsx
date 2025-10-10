"use client";
import * as React from "react";

export function TrustPill({
  icon: Icon,
  children,
  tone = "blue", // "blue" | "gold"
}: { 
  icon: React.ElementType<{ className?: string }>; 
  children: React.ReactNode; 
  tone?: "blue"|"gold"; 
}) {
  const cls =
    tone === "gold"
      ? "border-[#8A6A2D] bg-[rgb(254,250,235)] text-slate-900"
      : "border-[#BFD7F5] bg-[#EEF5FF] text-slate-900";
  const iconCls = tone === "gold" ? "text-[#8A6A2D]" : "text-[#0A6ED1]";
  
  return (
    <span
      className={
        "relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium " +
        cls
      }
    >
      {/* shimmer ring only for gold */}
      {tone === "gold" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(200,155,60,0.0), rgba(230,192,92,0.35), rgba(200,155,60,0.0))",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            padding: "1px",
          }}
        />
      )}
      <span className={"inline-grid place-items-center size-6 rounded-full bg-white/80 " + iconCls}>
        <Icon className={"h-4 w-4 " + iconCls} />
      </span>
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
