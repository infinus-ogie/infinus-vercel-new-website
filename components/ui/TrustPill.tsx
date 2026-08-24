"use client";
import * as React from "react";

/**
 * One trust item.
 *
 * ── `mark` replaces the icon disc, and only the homepage hero passes it ─────────
 * The homepage used to stack a standalone SAP Gold Partner image ABOVE a pill whose text
 * already read "SAP Gold Partner" — the same certification twice, as two unrelated visual
 * layers. Folding the artwork into this item makes it ONE object: the official mark and the
 * words that name it, sitting in the same row as the other two proof points.
 *
 * When `mark` is supplied it is rendered instead of the icon disc, and the item is given
 * roomier padding so the certification artwork stays READABLE rather than being forced into
 * the 24px disc the icons use. In a stretch grid that lifts the whole row's height, which is
 * what keeps it reading as one unified row rather than one odd tall pill.
 *
 * Everything about the default icon path is unchanged, because ~15 pages render it.
 */
export function TrustPill({
  icon: Icon,
  children,
  tone = "blue", // "blue" | "gold"
  variant = "light", // "light" | "dark"
  mark,
}: { 
  icon: React.ElementType<{ className?: string }>; 
  children: React.ReactNode; 
  tone?: "blue"|"gold"; 
  variant?: "light"|"dark";
  /** Official artwork shown in place of the icon. Homepage hero only. */
  mark?: React.ReactNode;
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
        "relative inline-flex items-center justify-center gap-2 rounded-full border text-sm font-medium " +
        // A supplied mark needs breathing room the icon disc does not.
        (mark ? "px-3.5 py-2 sm:gap-2.5 " : "px-2 py-1.5 ") +
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
      {mark ? (
        // Sized by the caller. `shrink-0` so no flex parent can squash the artwork, and the
        // aspect ratio is the badge component's own responsibility.
        <span className="relative z-[1] inline-flex shrink-0 items-center">{mark}</span>
      ) : (
        <span className={
          "inline-grid place-items-center size-6 rounded-full " + 
          (variant === "dark" 
            ? "bg-black/20 border border-white/10" 
            : "bg-white/80"
          ) + " " + iconCls
        }>
          <Icon className={"h-4 w-4 " + iconCls} />
        </span>
      )}
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
