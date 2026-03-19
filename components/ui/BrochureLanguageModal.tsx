"use client";
import * as React from "react";
import { FileDown, X } from "lucide-react";

interface BrochureLanguageModalProps {
  label: string;
  hrefEn: string;
  hrefSr: string;
  filenameEn?: string;
  filenameSr?: string;
  variant?: "hero" | "cta";
}

function triggerDownloadAndOpen(href: string, filename: string) {
  window.open(href, "_blank", "noopener,noreferrer");
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function BrochureLanguageModal({
  label,
  hrefEn,
  hrefSr,
  filenameEn = "SAP-Starter-Package-Brochure-EN.pdf",
  filenameSr = "SAP-Starter-Package-Brosura-SR.pdf",
  variant = "hero",
}: BrochureLanguageModalProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (href: string, filename: string) => {
    triggerDownloadAndOpen(href, filename);
    setOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const buttonClass =
    variant === "hero"
      ? "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white/40 text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
      : "inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 hover:border-white/40 hover:bg-white/[0.06] px-7 py-3.5 text-base font-semibold text-white transition-all";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        <FileDown className="h-5 w-5" strokeWidth={1.5} />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-semibold text-slate-900 mb-1">Download Brochure</h2>
            <p className="text-sm text-slate-500 mb-5">Choose your preferred language</p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleSelect(hrefEn, filenameEn)}
                className="flex items-center gap-3 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-left text-sm font-medium text-slate-800 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <span className="text-xl">🇬🇧</span>
                <span>English</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelect(hrefSr, filenameSr)}
                className="flex items-center gap-3 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-left text-sm font-medium text-slate-800 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <span className="text-xl">🇷🇸</span>
                <span>Serbian <span className="text-slate-400 font-normal">(Srpski)</span></span>
              </button>
            </div>

            <div className="flex justify-end mt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
