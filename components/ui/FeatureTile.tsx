"use client";
import * as React from "react";

interface FeatureTileProps {
  icon: React.ElementType<{ className?: string }>;
  title: string;
  description: string;
}

export function FeatureTile({ icon: Icon, title, description }: FeatureTileProps) {
  return (
    <article
      className="group h-full rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur p-6 transition duration-200 hover:shadow-sm hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      aria-label={`${title} – ${description}`}
      tabIndex={0}
    >
      <div className="flex h-full flex-col">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-slate-50 border border-slate-200">
          <Icon className="h-5 w-5 text-[#0a6ed1]" />
        </span>
        <h3 className="mt-4 text-lg md:text-xl font-semibold text-slate-900 no-underline decoration-0">{title}</h3>
        <p className="mt-2 text-slate-600 leading-relaxed text-pretty flex-grow">{description}</p>
        <div className="mt-4" aria-hidden />
      </div>
    </article>
  );
}
