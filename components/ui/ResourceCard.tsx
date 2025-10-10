"use client";
import * as React from "react";
import { Download } from "lucide-react";

export type Resource = {
  id: string;
  title: string;
  description: string;
  label: string; // Research | Checklist | Infographic
  url: string;
  image?: string;
  analyticsId?: string;
};

export function ResourceCard({ item, onDownload }: { item: Resource; onDownload?: (r: Resource) => void; }) {
  // File-type pill color map (diskretno)
  const pill = {
    Research: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Checklist: "bg-blue-50 text-blue-700 border-blue-100",
    Infographic: "bg-cyan-50 text-cyan-700 border-cyan-100",
  } as const;
  const pillCls = pill[item.label as keyof typeof pill] ?? "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <article
      className="group h-full rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur p-6 transition duration-200 hover:shadow-sm hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-indigo-600"
      aria-label={`${item.title} – ${item.description}`}
      tabIndex={0}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border-indigo-100">
            PDF document
          </span>
          <span className="text-xs text-slate-500">{item.label}</span>
        </div>

        <h3 className="mt-4 text-lg md:text-xl font-semibold text-slate-900">{item.title}</h3>
        <p className="mt-2 text-slate-600 leading-relaxed text-pretty">{item.description}</p>

        <div className="mt-5">
          {onDownload ? (
            <button
              onClick={() => {
                // Analytics tracking
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'download_resource', {
                    id: item.analyticsId,
                    title: item.title
                  });
                }
                onDownload(item);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0a6ed1] px-4 py-2 text-white hover:bg-[#0b5bb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0a6ed1]"
              aria-label={`Preuzmi ${item.title}`}
            >
              <Download className="h-4 w-4 opacity-80" />
              Preuzmi PDF
            </button>
          ) : (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Analytics tracking
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'download_resource', {
                    id: item.analyticsId,
                    title: item.title
                  });
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0a6ed1] px-4 py-2 text-white hover:bg-[#0b5bb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0a6ed1]"
              aria-label={`Preuzmi ${item.title}`}
            >
              <Download className="h-4 w-4 opacity-80" />
              Preuzmi PDF
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
