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
 * ── `forceMount`, deliberately ─────────────────────────────────────────────────
 * Radix unmounts closed content by default. Here every answer stays in the DOM:
 *
 *   · test/mythbusters-page.test.tsx asserts each answer is present, and that assertion is
 *     worth keeping — it is what proves the client's approved copy actually shipped rather
 *     than merely existing in a dictionary.
 *   · an answer that is in the markup is an answer a crawler and a find-in-page can reach.
 *
 * Radix still applies `hidden` when an item is closed, so the visual and keyboard behaviour
 * is the ordinary accordion behaviour — nothing is faked, and nothing is visible that should
 * not be. components/ui/accordion.tsx spreads its props into the primitive, so this needed no
 * change to the shared component.
 *
 * The FAQPage JSON-LD is built in lib/mythbusters-jsonld.ts from `layout.faq.items` — the
 * dictionary, never the DOM — so none of this touches the schema.
 *
 * `data-faq-item` is the QA hook. scripts/qa/viewport-audit.mjs used to count `dt` elements,
 * which a real accordion does not have.
 */
export function EbookFaq({ items }: { items: SrMythBustersLayout["faq"]["items"] }) {
  return (
    <Accordion type="single" collapsible className="space-y-3">
      {items.map((item, index) => (
        <AccordionItem
          key={item.question}
          value={String(index + 1)}
          data-faq-item
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_1px_1px_rgba(0,0,0,.03),0_10px_24px_-18px_rgba(0,0,0,.18)] transition-colors data-[state=open]:border-slate-300 sm:px-5"
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
