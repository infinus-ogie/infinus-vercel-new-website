import * as React from "react"

/**
 * The hero's conversion area: the product on the left, the form on the right.
 *
 * ── Why they are side by side ──────────────────────────────────────────────────
 * Stacked — cover above form — the conversion column became one very tall vertical block
 * that outweighed the copy beside it, however compact the form itself got. Setting them side
 * by side halves that height and makes the two read as ONE module: this is the document, and
 * these are the four fields that get it.
 *
 * Roughly 34/66, and the 66 is the half doing the work: the form has four labelled fields to
 * place and the cover has one job. Every point given back to the form is what buys the field
 * grid its second column — see EbookForm, which switches on its OWN width rather than on the
 * viewport's, so this ratio and that decision cannot drift apart.
 *
 * `xl:items-start` is what makes the pair read as composed rather than floated: the cover's
 * top edge sits on the form card's top edge, so the two share a baseline.
 *
 * ── It splits at `xl`, NOT at `lg` ─────────────────────────────────────────────
 * The outer hero goes two-column at `lg` (1024). If this module split at the same breakpoint,
 * at 1024 the conversion column is around 470px and a 38/62 split leaves the form near 280px
 * — two fields per row at 130px each, which is a cramped form nobody wants to fill in.
 *
 * So the module stays stacked through `lg` and only goes side by side at `xl`, where there is
 * genuinely room. Between 1024 and 1280 the hero is two-column with a stacked conversion
 * area, which is the correct trade: a readable form beats a clever composition.
 *
 * Below `lg` everything stacks: copy, then cover, then form.
 */
export function ConversionModule({
  aside,
  form,
}: {
  /** The cover, plus whatever asset metadata the locale's source supplies. */
  aside: React.ReactNode
  form: React.ReactNode
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,34%)_minmax(0,1fr)] xl:items-start xl:gap-6">
      {/* Centred while stacked so the cover sits under the middle of the copy on phones;
          left-aligned once it has its own column. */}
      <div className="flex justify-center xl:block">{aside}</div>
      <div className="min-w-0">{form}</div>
    </div>
  )
}
