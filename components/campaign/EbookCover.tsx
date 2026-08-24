import Image from "next/image"
import { cn } from "@/lib/utils"

/** The real cover, rendered from page 1 of the actual download. */
const COVER_SRC = "/downloads/sap-mythbusting-ebook-cover.webp"

/**
 * The e-book cover, at campaign scale.
 *
 * ── The cover is the REAL cover ────────────────────────────────────────────────
 * public/downloads/sap-mythbusting-ebook-cover.webp is rendered from page 1 of the PDF the
 * form actually delivers. Nothing was redrawn and no stand-in artwork is used: a page
 * promising one document while showing another is a small lie the reader can catch by
 * downloading the file.
 *
 * ── Why it is this much bigger ─────────────────────────────────────────────────
 * It used to render at 96–112px wide inside a bordered card inside the hero column. At that
 * size a visitor cannot tell what they are being offered, which is the one job the cover has:
 * "I am downloading THIS document."
 *
 * ── Restraint, deliberately ────────────────────────────────────────────────────
 * A shadow and a hairline ring. No 3D book mockup, no perspective transform, no tilt — the
 * artwork is a real SAP-adjacent document and distorting it would cheapen it. The intrinsic
 * dimensions are the asset's own, and width-with-h-auto means no flex or grid parent can
 * stretch it.
 *
 * ── alt ────────────────────────────────────────────────────────────────────────
 * Optional. The Serbian source supplies `coverAlt`, so that page passes it. The English
 * dictionary has no cover copy and inventing any is forbidden, so the English hero renders it
 * decoratively — its adjacent form heading and eyebrow already name the document, exactly the
 * reasoning SapGoldPartnerBadge documents for the homepage.
 */
export function EbookCover({
  alt,
  className,
  priority = false,
}: {
  alt?: string
  className?: string
  priority?: boolean
}) {
  const decorative = alt === undefined || alt === ""
  return (
    <Image
      src={COVER_SRC}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      width={900}
      height={1273}
      priority={priority}
      sizes="(min-width: 1024px) 320px, (min-width: 640px) 260px, 200px"
      className={cn(
        "h-auto w-full rounded-xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/20",
        className
      )}
    />
  )
}
