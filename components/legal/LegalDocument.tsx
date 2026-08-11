/**
 * Renderer for approved legal documents.
 *
 * Presentation only. It maps the typed blocks in content/legal/** to HTML and adds
 * nothing: no wording, no headings, no dates, no cookie tables. Every string rendered
 * comes from the approved source document.
 *
 * Server component by design — no interactivity, so the policy is fully present in the
 * prerendered HTML.
 */

import type { LegalBlock, LegalDocument as LegalDocumentType, LegalInline } from "@/content/legal/politika-privatnosti"

function Inlines({ parts }: { parts: readonly LegalInline[] }) {
  return (
    <>
      {parts.map((part, i) => {
        switch (part.t) {
          case "text":
            return <span key={i}>{part.v}</span>
          case "bold":
            return <strong key={i}>{part.v}</strong>
          case "link":
            return (
              <a
                key={i}
                href={part.href}
                className="text-[#0a6ed1] underline underline-offset-2 hover:text-[#00144a]"
                {...(part.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {part.v}
              </a>
            )
          case "break":
            return <br key={i} />
        }
      })}
    </>
  )
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.t) {
    case "h1":
      return (
        <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
          <Inlines parts={block.c} />
        </h1>
      )
    case "h2":
      return (
        <h2 className="mt-10 text-xl font-semibold text-slate-900 md:text-2xl">
          <Inlines parts={block.c} />
        </h2>
      )
    case "p":
      return (
        <p className="mt-4 leading-relaxed text-slate-700">
          <Inlines parts={block.c} />
        </p>
      )
    case "ul":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-slate-700">
          {block.items.map((item, i) => (
            <li key={i}>
              <Inlines parts={item} />
            </li>
          ))}
        </ul>
      )
  }
}

export function LegalDocument({ document }: { document: LegalDocumentType }) {
  return (
    <section id={document.anchor} lang={document.lang} className="scroll-mt-28">
      {document.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </section>
  )
}
