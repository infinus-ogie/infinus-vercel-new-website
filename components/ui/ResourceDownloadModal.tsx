"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Resource } from "./ResourceCard";

export function ResourceDownloadModal({
  open, onOpenChange, resource,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; resource: Resource | null;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  React.useEffect(() => { if (!open) { setName(""); setEmail(""); } }, [open]);

  const handleDownload = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag && resource) {
      (window as any).gtag('event', 'download_resource', {
        id: resource.analyticsId,
        title: resource.title
      });
    }
    if (resource?.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
    onOpenChange(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Preuzmi PDF</h2>
            <p className="text-sm text-slate-600 mt-1">{resource?.title}</p>
          </div>
          
          <div className="space-y-3">
            <Input 
              placeholder="Ime i prezime" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            <Input 
              placeholder="Email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-300"
            >
              Otkaži
            </Button>
            <Button 
              className="bg-[#0a6ed1] hover:bg-[#0b5bb5]" 
              onClick={handleDownload}
            >
              Preuzmi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
