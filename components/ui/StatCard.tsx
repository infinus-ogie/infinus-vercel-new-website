"use client";
import * as React from "react";
import { useInView } from "framer-motion";
import { CountUp } from "./CountUp";

interface StatCardProps {
  icon: React.ElementType;
  valueParts: { end: number; prefix?: string; suffix?: string };
  label: string;
  underline?: boolean;
}

export function StatCard({
  icon: Icon,
  valueParts,
  label,
  underline = true,
}: StatCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  const { end, prefix = "", suffix = "" } = valueParts;
  const ariaLabel = `${end}${suffix} ${label}`;

  return (
    <article className="h-full" aria-label={ariaLabel}>
      <div className="size-10 rounded-full bg-slate-50/80 border border-slate-200/60 flex items-center justify-center">
        <Icon className="h-4 w-4 text-slate-600" />
      </div>
      
      <h3 ref={ref} className="mt-3 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-[#0a6ed1]">
        <CountUp
          end={end}
          prefix={prefix}
          suffix={suffix}
          inView={!!inView}
          durationMs={1100}
          className="text-[#0a6ed1]"
        />
      </h3>
      
      {underline && (
        <span aria-hidden className="block mt-2 h-[2px] w-16 bg-[#0a6ed1]/70 rounded" />
      )}
      
      <p className="mt-3 text-slate-700 leading-relaxed">{label}</p>
    </article>
  );
}
