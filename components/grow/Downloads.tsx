"use client";

import * as React from "react";
import { DownloadCloud, FileText, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DownloadItem {
  title: string;
  description: string;
  url: string;
  analyticsId: string;
}

const downloadItems: DownloadItem[] = [
  {
    title: "Oxford Economics izveštaj: CFO Insights",
    description: "Šta finansijski lideri planiraju i gde su prepreke: skaliranje, usklađenost i uloga AI/Cloud ERP-a.",
    url: "/downloads/CFO_Insights_OxfordEconomics.pdf",
    analyticsId: "CFO_Insights"
  },
  {
    title: "Checklista za CFO i finansijske menadžere",
    description: "Ključna pitanja prilikom izbora ERP rešenja - kako pojednostaviti rad, ubrzati rast i obezbediti usklađenost.",
    url: "/downloads/Finance_Checklist.pdf",
    analyticsId: "Finance_Checklist"
  },
  {
    title: "Infografik: 3 uvida o finansijama i rastu",
    description: "Brzi uvidi o procesima koji usporavaju finansije i kako Cloud ERP pomaže u skaliranju.",
    url: "/downloads/Finance_3_Insights.pdf",
    analyticsId: "Finance_3_Insights"
  }
];

export function Downloads() {
  const handleDownload = (item: DownloadItem) => {
    // Show toast notification
    toast.success("Hvala! Preuzimanje je započeto.");
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'download', {
        event_category: 'PDF',
        event_label: item.analyticsId,
        value: 1
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Glass pill info bar */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/70 backdrop-blur px-3 py-1 text-xs text-slate-700">
          <DownloadCloud className="h-4 w-4" />
          <span>Besplatni resursi za CFO-ove i finansijske menadžere - praktični uvidi i checkliste za brži izbor ERP rešenja.</span>
        </div>
      </div>

      {/* Download cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {downloadItems.map((item, index) => (
          <article key={index} style={{ borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white' }}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#1D4ED8' }} />
                <h3 className="text-lg font-semibold leading-relaxed" style={{ color: '#0f172a', fontWeight: '600' }}>
                  {item.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#475569', fontSize: '0.875rem' }}>
                {item.description}
              </p>
              <a
                href={item.url}
                download
                onClick={() => handleDownload(item)}
                aria-label={`Preuzmi PDF: ${item.title}`}
                data-analytics-event="download"
                data-analytics-doc={item.analyticsId}
                className="mt-auto block rounded-xl border transition hover:bg-slate-100"
                style={{ 
                  color: '#1e293b',
                  borderColor: '#e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  padding: '0.5rem',
                  fontWeight: '500'
                }}
              >
                Preuzmi PDF
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
