import * as React from "react"

/**
 * The hero's conversion area: the product on the left, the form on the right.
 *
 * ── Why they are side by side ──────────────────────────────────────────────────
 * Stacked — cover above form — the conversion column became one very tall vertical block that
 * outweighed the copy beside it, however compact the form itself got. Side by side halves that
 * height and makes the two read as ONE module: this is the document, and these are the four
 * fields that get it.
 *
 * ── The cover column is FIXED, and that is the point ───────────────────────────
 * 180px at `xl`, not a percentage. The form's width is what decides whether its fields sit two
 * per row, and a percentage cover takes a share of every pixel the column gains — so the form
 * could never quite reach the threshold. Pinning the cover hands every remaining pixel to the
 * form, which is the half that has four labelled fields to place. 180px is still a legible
 * document rather than a thumbnail.
 *
 * The sizing lives HERE rather than at the two call sites. Both locales previously wrapped
 * their own cover in their own width classes, which is exactly the kind of duplicated
 * presentation that let the English and Serbian heroes drift apart.
 *
 * ── It splits at `xl`, NOT at `lg` ─────────────────────────────────────────────
 * The outer hero goes two-column at `lg` (1024), where the conversion column is around 500px.
 * Splitting there would leave the form ~300px — one column, and a tall card. So the module
 * stays stacked through `lg`, where the form gets the column's full width and its fields go
 * two per row, and only goes side by side at `xl` where there is room for both.
 *
 * Below `lg` everything stacks: copy, then cover, then form.
 */
export function ConversionModule({
  cover,
  form,
}: {
  /** The e-book cover. Sized by this component — pass the bare image. */
  cover: React.ReactNode
  form: React.ReactNode
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[180px_minmax(0,1fr)] xl:items-start xl:gap-6">
      {/* Centred while stacked so the cover sits under the middle of the copy on phones;
          its own fixed column once the module splits. */}
      <div className="flex justify-center xl:block">
        <div className="w-[min(14rem,55vw)] sm:w-[min(16rem,42vw)] xl:w-full">{cover}</div>
      </div>
      <div className="min-w-0">{form}</div>
    </div>
  )
}
