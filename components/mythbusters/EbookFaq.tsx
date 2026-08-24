"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import type { SrMythBustersLayout } from "@/content/dictionary"

/**
 * The Serbian MythBusting FAQ.
 *
 * ── The site's accordion, not a new one ────────────────────────────────────────
 * These five pairs used to render as a static `<dl>` of plain bordered boxes — no affordance,
 * no hierarchy, five open answers making a long page longer. The rest of the site already has
 * an accordion language (components/ui/Faq.tsx over the same Radix primitives), so this uses
 * it rather than inventing a second pattern.
 *
 * ── `forceMount`, and the bug it caused ────────────────────────────────────────
 * Radix unmounts closed content by default. Every answer is kept in the DOM instead, because:
 *
 *   · test/mythbusters-page.test.tsx asserts each answer is present, and that assertion is
 *     worth keeping — it is what proves the client's approved copy actually shipped rather
 *     than merely existing in a dictionary.
 *   · an answer that is in the markup is an answer a crawler and a find-in-page can reach.
 *
 * The first version assumed Radix would still apply `hidden` to force-mounted content. IT
 * DOES NOT. With `forceMount` the content element is rendered and left alone: `data-state`
 * flips between open and closed, `aria-expanded` flips with it, and NOTHING ELSE HAPPENS.
 * All five answers were permanently visible at full height and clicking a question changed
 * only invisible attributes — an accordion that looked broken because, visually, it was.
 *
 * The shared AccordionContent hardcodes its own className on the primitive and passes the
 * caller's to an inner wrapper, so a state-dependent class cannot be handed to it directly.
 * The item therefore styles its own content child:
 *
 *     [&>[role=region][data-state=closed]]:hidden
 *
 * `> [role=region]` is exactly the Radix content element and nothing else — the trigger's
 * header is an `<h3>` and also carries `data-state`, which is why this is scoped by role and
 * to a direct child rather than matching any closed descendant.
 *
 * The trade is the open/close animation, which Radix drives by unmounting. Correct behaviour
 * with no animation beats an animation over content that never actually hides.
 *
 * The FAQPage JSON-LD is built in lib/mythbusters-jsonld.ts from `layout.faq.items` — the
 * dictionary, never the DOM — so none of this touches the schema.
 *
 * `data-faq-item` is the QA hook. scripts/qa/viewport-audit.mjs used to count `dt` elements,
 * which a real accordion does not have.
 */
/** The item open on first render. `type="single"` means only ever one at a time. */
const DEFAULT_OPEN = "1"

export function EbookFaq({ items }: { items: SrMythBustersLayout["faq"]["items"] }) {
  return (
    /*
     * `defaultValue` opens the first question on load, so the section shows what an answer
     * looks like instead of five identical closed rows. `collapsible` lets a visitor close it
     * again — `type="single"` already guarantees opening one closes the other.
     */
    <Accordion type="single" collapsible defaultValue={DEFAULT_OPEN} className="space-y-3">
      {items.map((item, index) => (
        <AccordionItem
          key={item.question}
          value={String(index + 1)}
          data-faq-item
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_1px_1px_rgba(0,0,0,.03),0_10px_24px_-18px_rgba(0,0,0,.18)] transition-colors data-[state=open]:border-slate-300 sm:px-5 [&>[role=region][data-state=closed]]:hidden"
        >
          <AccordionTrigger className="group flex w-full items-center gap-4 py-5 text-left hover:no-underline">
            <span className="inline-grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 transition-colors group-data-[state=open]:border-blue-200 group-data-[state=open]:bg-blue-50">
              <HelpCircle className="h-4 w-4 text-brand-sap" aria-hidden="true" />
            </span>
            <span className="flex-1 text-[17px] font-semibold leading-snug text-slate-900">
              {item.question}
            </span>
          </AccordionTrigger>

          <AccordionContent
            forceMount
            className="pb-5 pl-12 pr-2 text-[15px] leading-relaxed text-slate-600"
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
