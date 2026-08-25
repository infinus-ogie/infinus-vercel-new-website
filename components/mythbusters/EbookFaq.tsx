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
 * ── The site's accordion, unmodified ───────────────────────────────────────────
 * This is components/ui/Faq.tsx's presentation over the same Radix primitives: the same
 * rounded panel, the same circled HelpCircle before the question, the same chevron from
 * AccordionTrigger, the same content indent. The MythBusting data is different; nothing about
 * the behaviour is.
 *
 * ── `forceMount` is gone, and that is the fix ──────────────────────────────────
 * The previous version force-mounted every answer so a test could assert the approved copy
 * was present, then hid closed ones with a CSS rule. Radix drives its open/close animation by
 * mounting and unmounting, so force-mounting disabled it: content appeared and vanished
 * instantly and the surrounding layout jumped, which is the jank the brief describes.
 *
 * Closed answers now unmount, the shared `animate-accordion-down` / `-up` play, and the
 * section behaves exactly like every other FAQ on the site.
 *
 * Nothing was lost by dropping it. The FAQPage JSON-LD is built in lib/mythbusters-jsonld.ts
 * from `layout.faq.items` — the dictionary, never the DOM — so the structured data does not
 * depend on collapsed answers being mounted, and the tests that asserted DOM presence were
 * asserting an implementation detail rather than the schema.
 *
 * `data-faq-item` is the QA hook: scripts/qa/viewport-audit.mjs counts these.
 */
/** The item open on first render. `type="single"` means only ever one at a time. */
const DEFAULT_OPEN = "1"

export function EbookFaq({ items }: { items: SrMythBustersLayout["faq"]["items"] }) {
  return (
    /*
     * `defaultValue` opens the first question on load, so the section shows what an answer
     * looks like instead of five identical closed rows. `collapsible` lets a visitor close it
     * again; `type="single"` already guarantees opening one closes the other.
     */
    <Accordion type="single" collapsible defaultValue={DEFAULT_OPEN} className="space-y-3">
      {items.map((item, index) => (
        <AccordionItem
          key={item.question}
          value={String(index + 1)}
          data-faq-item
          className="rounded-2xl border border-slate-200/70 bg-white/70 px-3 backdrop-blur transition-colors data-[state=open]:border-slate-300 md:px-4"
        >
          <AccordionTrigger className="group flex w-full items-center gap-3 py-4 pr-2 text-left hover:no-underline">
            <span className="inline-grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 transition-colors group-data-[state=open]:border-blue-200 group-data-[state=open]:bg-blue-50">
              <HelpCircle className="h-4 w-4 text-brand-sap" aria-hidden="true" />
            </span>
            <span className="flex-1 text-base font-semibold text-slate-900 md:text-lg">
              {item.question}
            </span>
          </AccordionTrigger>

          <AccordionContent className="pb-4 pl-11 text-pretty leading-relaxed text-slate-600 md:pl-12">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
