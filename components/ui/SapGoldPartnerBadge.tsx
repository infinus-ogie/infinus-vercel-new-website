import Image from "next/image";

/**
 * The SAP Gold Partner certification badge, as shown in the homepage hero.
 *
 * ── Scope: the homepage, once ───────────────────────────────────────────────────
 * Deliberately NOT placed inside StatPills or TrustStrip. Those are shared by roughly
 * fifteen pages, and the client asked for one clearly visible placement, not the same large
 * mark repeated site-wide. Its only caller is the hero, which `/` and `/sr` render and
 * nothing else public does.
 *
 * The About section keeps its own, separate SAP visual
 * (public/sap-gold-partner-logo-about-us.webp). The two are far apart on the page and serve
 * different jobs — first-screen trust signal versus in-section illustration — so neither was
 * removed for the other.
 *
 * ── The asset is NOT the supplied JPEG ──────────────────────────────────────────
 * `SAP_GoldPartner_R_1028x1028.jpeg` has no alpha channel and is the badge padded onto a
 * white square; dropped on this hero's #00144a it renders as a white box. The supplied
 * SAP_GoldPartner.zip also contains RGB/SAP_GoldPartner_R.png — the same artwork at its
 * natural 407x239 WITH transparency — and that is what public/sap-gold-partner-badge.webp
 * is derived from, at 2x for retina. The certification artwork itself is untouched.
 *
 * ── alt defaults to EMPTY, and that is a decision about context ─────────────────
 * On the homepage the badge sits directly above a trust pill that already reads "SAP Gold
 * Partner". A meaningful alt there would make a screen reader announce the same
 * certification twice in a row, so the default is decorative and the neighbouring text
 * carries the meaning.
 *
 * Where the badge stands alone — the Serbian MythBusting trust bar, where it appears beside
 * the Infinus mark with no adjacent text naming either — it IS meaningful, and the caller
 * passes `alt`. The prop exists so that judgement is made at the call site, which is the
 * only place that knows what is next to it.
 */
export function SapGoldPartnerBadge({ className, alt }: { className?: string; alt?: string }) {
  const decorative = alt === undefined || alt === ""
  return (
    <Image
      src="/sap-gold-partner-badge.webp"
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      width={814}
      height={478}
      // Fixed height with w-auto: the badge is 1.70:1 and must never be stretched by a
      // flex or grid parent.
      className={className ?? "h-9 w-auto sm:h-11 md:h-14"}
      priority
    />
  );
}
