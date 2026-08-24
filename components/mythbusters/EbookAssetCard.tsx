import Image from "next/image"
import { Check } from "lucide-react"
import type { SrMythBustersLayout } from "@/content/dictionary"

/**
 * The e-book asset card shown beside the form in the Serbian hero.
 *
 * ── The cover is the REAL cover ─────────────────────────────────────────────────
 * public/downloads/sap-mythbusting-ebook-cover.webp is rendered from page 1 of the actual
 * download — the same PDF the form delivers — at 2x and converted to WebP. Nothing was
 * redrawn and no stand-in artwork was used: a card promising one document while showing
 * another is a small lie that a reader can catch by downloading the file.
 *
 * The PDF itself is untouched.
 */
export function EbookAssetCard({ copy }: { copy: SrMythBustersLayout["assetCard"] }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex items-start gap-5">
        <Image
          src="/downloads/sap-mythbusting-ebook-cover.webp"
          alt={copy.coverAlt}
          width={900}
          height={1273}
          // A4-ish portrait. Fixed width with h-auto so no flex parent can distort it.
          className="w-24 shrink-0 rounded-lg shadow-lg ring-1 ring-white/20 sm:w-28"
        />

        <div className="min-w-0">
          <p className="text-base font-semibold text-white sm:text-lg">{copy.title}</p>
          <p className="mt-1 text-sm text-blue-200">{copy.subtitle}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
          {copy.whatYouGetHeading}
        </p>
        <ul className="mt-2 space-y-1.5">
          {copy.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
