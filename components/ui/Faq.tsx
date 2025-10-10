"use client";
import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useInView } from "framer-motion";

type FAQ = { question: string; answer: string };

export function FaqSection({
  title = "Često postavljana pitanja",
  items,
  id = "faq",
}: {
  title?: string;
  items: FAQ[];
  id?: string;
}) {
  // open by hash (#faq-2) if postoji
  const [defaultValue, setDefaultValue] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash?.startsWith(`#${id}-`)) setDefaultValue(hash.replace(`#${id}-`, ""));
  }, [id]);

  const prefersReduced = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <section id={id} className="scroll-mt-24">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">{title}</h2>
      </div>

      <div className="mt-8 grid gap-4 md:gap-5">
        <Accordion type="single" collapsible defaultValue={defaultValue} className="space-y-3">
          {items.map((faq, i) => {
            const value = String(i + 1);
            const anchor = `${id}-${value}`;
            return (
              <AccordionItem
                key={value}
                value={value}
                className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur px-3 md:px-4"
              >
                <AccordionTrigger
                  className="group flex w-full items-center gap-3 py-4 pr-2 text-left hover:no-underline"
                  onClick={() => {
                    if (typeof window !== "undefined") history.replaceState(null, "", `#${anchor}`);
                  }}
                >
                  <span className="inline-grid place-items-center size-8 rounded-full bg-slate-50 border border-slate-200">
                    <HelpCircle className="h-4 w-4 text-[#0a6ed1]" />
                  </span>
                  <span className="text-base md:text-lg font-semibold text-slate-900 flex-1">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent
                  className="pl-11 md:pl-12 pb-4 text-slate-600 leading-relaxed text-pretty"
                  style={prefersReduced ? { transitionDuration: "0ms" } : undefined}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
