/**
 * One myth/fact pair, as the Serbian page's strongest section.
 *
 * ── The treatment ──────────────────────────────────────────────────────────────
 * Two tones inside one object, split by a hairline:
 *
 *   MIT        muted ground, slate label, the claim set in a questioning weight
 *   ---------  a plain rule
 *   ČINJENICA  white ground, SAP-blue label, the answer set stronger and darker
 *
 * Hierarchy is carried by weight, colour temperature and ground, NOT by red-versus-green. A
 * traffic-light treatment would read as an error state and is wrong for enterprise SAP
 * material; muted-to-clear says the same thing without shouting.
 *
 * A circular down-arrow used to sit on the rule. It has been removed: these cards are not
 * accordions and nothing here is clickable, so a control-shaped mark invited a click that
 * does nothing. The label change and the ground change already carry the downward read.
 *
 * ── Why the two halves are a subgrid ───────────────────────────────────────────
 * The myths differ in length, so a card whose myth wrapped to one line put its rule, and
 * therefore its ČINJENICA, at a different height from the card beside it. Four cards, four
 * different baselines.
 *
 * `gap-0` on the card is load-bearing, not tidiness: a subgrid item inherits the parent's row
 * gap, which would open the parent's 24px between the myth half and the fact half and split
 * the card in two. Overriding it closes that seam while the gap BETWEEN cards, which no
 * subgrid item spans, still comes from the parent.
 *
 * `row-span-2` + `grid-rows-subgrid` makes each card adopt the PARENT grid's two rows rather
 * than sizing its own, so every card in a row shares the tallest myth's height and the rules
 * line up. It is driven by the content, so nothing is hardcoded and a longer myth in a future
 * edit re-aligns the row on its own. Below `sm` the grid is one column and there is nothing to
 * align, so the subgrid only engages where it matters.
 *
 * `data-myth-item` is the QA hook: scripts/qa/viewport-audit.mjs counts these to assert all
 * four supplied pairs render.
 */
export function MythFactItem({
  mythLabel,
  factLabel,
  myth,
  fact,
}: {
  mythLabel: string
  factLabel: string
  myth: string
  fact: string
}) {
  return (
    <div
      data-myth-item
      className="grid gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_1px_rgba(0,0,0,.04),0_12px_28px_-16px_rgba(0,0,0,.18)] sm:row-span-2 sm:grid-rows-subgrid"
    >
      {/* The myth: questioned, so it sits back. */}
      <div className="bg-slate-50/80 px-6 pb-6 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {mythLabel}
        </p>
        <p className="mt-2.5 text-lg font-normal leading-snug text-slate-600">{myth}</p>
      </div>

      {/* The fact: the answer, so it comes forward. The rule is the top border of this half
          rather than an element of its own, which is what lets the card be two rows. */}
      <div className="border-t border-slate-200 px-6 pb-6 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-sap">
          {factLabel}
        </p>
        <p className="mt-2.5 text-lg font-medium leading-snug text-slate-900">{fact}</p>
      </div>
    </div>
  )
}
