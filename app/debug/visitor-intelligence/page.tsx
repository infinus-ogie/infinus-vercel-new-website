"use client";

import { useEffect, useState } from "react";

export default function VisitorIntelligenceDebug() {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<string>("n/a");
  const [consent, setConsent] = useState<any>(null);

  useEffect(() => {
    // Pick up last known data
    if (typeof window !== "undefined" && (window as any).dnb_vi_last) {
      setData((window as any).dnb_vi_last);
    }

    // Get initial status from DOM
    if (typeof document !== "undefined" && document.body.dataset.dnbViStatus) {
      setStatus(document.body.dataset.dnbViStatus);
    }

    // Listen for dnb-vi-ready events
    const onReady = (e: any) => {
      setData(e?.detail || null);
      setStatus(document?.body?.dataset?.dnbViStatus || "n/a");
    };
    window.addEventListener("dnb-vi-ready", onReady);
    return () => window.removeEventListener("dnb-vi-ready", onReady);
  }, []);

  useEffect(() => {
    // Try to read consent (ako koristite Google Consent Mode V2)
    // ovo je best-effort i može ostati null ako nemate consent lib
    const gtd = (window as any).google_tag_data?.consent?.default || null;
    setConsent(gtd);
  }, []);

  const handleRerun = () => {
    if (typeof window !== "undefined" && typeof (window as any).dnb_vi_rerun === "function") {
      // primer payload-a: {"p1":"debug"}
      (window as any).dnb_vi_rerun({});
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Visitor Intelligence – Debug</h1>
      <p className="text-slate-600">Ova stranica pomaže da proverimo da li je D&B VI pixel aktivan.</p>

      <div className="rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Current status (body[data-dnb-vi-status])</div>
            <div className="text-lg font-semibold">{status}</div>
          </div>
          <button
            onClick={handleRerun}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Re-run getData()
          </button>
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-2">
        <div className="text-sm text-slate-500">Consent snapshot (if available)</div>
        <pre className="text-xs overflow-auto bg-slate-50 p-3 rounded">{JSON.stringify(consent, null, 2)}</pre>
      </div>

      <div className="rounded-xl border p-4 space-y-2">
        <div className="text-sm text-slate-500">Last dnb_vi_last payload</div>
        <pre className="text-xs overflow-auto bg-slate-50 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
      </div>

      <div className="text-sm text-slate-500">
        Tip: u DevTools → Network upiši <code>d41.co</code> i proveri da li vidiš <code>sync/</code> i <code>dnb_coretag_v6.min.js</code>.
      </div>
    </div>
  );
}
