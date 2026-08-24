import { Check } from "lucide-react"
import { EbookCover } from "@/components/campaign/EbookCover"
import type { SrMythBustersLayout } from "@/content/dictionary"

/**
 * The e-book presentation above the Serbian hero form.
 *
 * ── It is no longer a card, and that is the point ──────────────────────────────
 * This used to be a bordered, blurred, translucent card containing a 96px cover — sitting
 * directly above the form, which is itself a card, inside the hero, which reads as a panel.
 * Three nested containers competing for the same attention, with the actual product rendered
 * too small to identify.
 *
 * Now the cover carries it. No wrapper, no border, no backdrop: the artwork sits on the navy
 * with the metadata beneath it, and the only card in the conversion column is the form. The
 * visitor sees the document, then the fields that get it.
 *
 * ── The cover is MEANINGFUL here ───────────────────────────────────────────────
 * The Serbian source supplies `coverAlt`, so it is passed. The English hero renders the same
 * cover decoratively because its dictionary has no cover copy — the judgement belongs at the
 * call site, which is the only place that knows what text sits beside it.
 */
export function EbookAssetCard({ copy }: { copy: SrMythBustersLayout["assetCard"] }) {
  return (
    <div className="flex flex-col items-center gap-5 lg:items-stretch">
      {/* Sized to be unmistakable on a phone without eating the first screen, and to sit
          comfortably in the conversion column on desktop. */}
      <div className="w-[min(14rem,55vw)] sm:w-[min(16rem,42vw)] lg:w-full lg:max-w-[17rem] lg:self-center">
        <EbookCover alt={copy.coverAlt} priority />
      </div>

      <div className="text-center lg:text-left">
        <p className="text-lg font-semibold leading-snug text-white sm:text-xl">{copy.title}</p>
        <p className="mt-1 text-sm font-medium text-blue-200">{copy.subtitle}</p>

        {/* The four asset facts, as a compact inline run rather than a labelled sub-panel.
            "PDF vodič · oko 15 minuta čitanja · …" is metadata; it does not need a heading and
            a bordered box to be understood. The source's own heading is kept as its label. */}
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
          {copy.whatYouGetHeading}
        </p>
        <ul className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-2 lg:justify-start">
          {copy.items.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-sm text-slate-200">
              <Check className="h-3.5 w-3.5 shrink-0 text-blue-300" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
