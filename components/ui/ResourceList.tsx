"use client";
import * as React from "react";
import { ResourceCard, type Resource } from "./ResourceCard";
import { ResourceDownloadModal } from "./ResourceDownloadModal";

export function ResourceList({
  items, zipUrl, title, description,
}: { 
  items: Resource[]; 
  zipUrl?: string; 
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Resource | null>(null);
  const capture = process.env.NEXT_PUBLIC_CAPTURE === "on";

  const startDownload = (r: Resource) => {
    if (capture) { 
      setSelected(r); 
      setOpen(true); 
    } else { 
      window.open(r.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            {title || "Preuzmite materijale za brzorastuće kompanije"}
          </h2>
          <p className="mt-2 text-slate-600">
            {description || "Ovde možete preuzeti besplatne materijale koji objašnjavaju kako finansije mogu postati pokretač rasta – i saznajte na konkretnim primerima kako SAP Cloud ERP podržava skaliranje poslovanja."}
          </p>
        </div>

        {zipUrl && (
          <a
            href={zipUrl}
            download
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
            aria-label="Preuzmi ceo paket (ZIP)"
          >
            <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1"/><path d="M21 10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8"/><path d="M10 12h4"/></svg>
            Preuzmi ceo paket (ZIP)
          </a>
        )}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[1fr]">
        {items.map((it) => (
          <ResourceCard 
            key={it.id} 
            item={it} 
            onDownload={capture ? startDownload : undefined} 
          />
        ))}
      </div>

      {zipUrl && (
        <div className="mt-6 md:hidden">
          <a
            href={zipUrl}
            download
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
            aria-label="Preuzmi ceo paket (ZIP)"
          >
            <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1"/><path d="M21 10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8"/><path d="M10 12h4"/></svg>
            Preuzmi ceo paket (ZIP)
          </a>
        </div>
      )}

      {capture && <ResourceDownloadModal open={open} onOpenChange={setOpen} resource={selected} />}
    </>
  );
}
