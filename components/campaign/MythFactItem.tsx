import { ArrowDown } from "lucide-react"

/**
 * One myth → fact pair, as the Serbian page's strongest section.
 *
 * ── What was wrong ─────────────────────────────────────────────────────────────
 * The four pairs rendered as small uniform white cards in which the myth and the fact had
 * almost the same visual weight. The section's whole point is a TRANSFORMATION — a
 * widely-held assumption replaced by a current fact — and nothing about four equal grey
 * paragraphs communicated that.
 *
 * ── The treatment ──────────────────────────────────────────────────────────────
 * Two tones inside one object, split by a rule:
 *
 *   MIT        muted ground, slate label, the claim set in a questioning weight
 *   ─────────  a divider the arrow sits on, so the eye reads downward
 *   ČINJENICA  white ground, SAP-blue label, the answer set stronger and darker
 *
 * Hierarchy is carried by weight, colour temperature and ground — NOT by red-versus-green.
 * A traffic-light treatment would read as an error state and is wrong for enterprise SAP
 * material; muted-to-clear says the same thing without shouting.
 *
 * `data-myth-item` is the QA hook: scripts/qa/viewport-audit.mjs counts these to assert all
 * four supplied pairs render. It used to count `.grid > div`, which coupled the audit to a
 * layout class.
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
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_1px_rgba(0,0,0,.04),0_12px_28px_-16px_rgba(0,0,0,.18)]"
    >
      {/* The myth: questioned, so it sits back. */}
      <div className="bg-slate-50/80 px-6 pb-7 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {mythLabel}
        </p>
        <p className="mt-2.5 text-lg font-normal leading-snug text-slate-600">{myth}</p>
      </div>

      {/* The transition, sitting ON the divider so the downward read is explicit. */}
      <div className="relative h-px bg-slate-200">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 inline-grid size-8 place-items-center rounded-full border border-slate-200 bg-white">
          <ArrowDown className="h-4 w-4 text-brand-sap" aria-hidden="true" />
        </span>
      </div>

      {/* The fact: the answer, so it comes forward. */}
      <div className="flex-1 px-6 pb-6 pt-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-sap">
          {factLabel}
        </p>
        <p className="mt-2.5 text-lg font-medium leading-snug text-slate-900">{fact}</p>
      </div>
    </div>
  )
}
