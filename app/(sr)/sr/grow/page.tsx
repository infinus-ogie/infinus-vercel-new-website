import { GrowLandingPage } from "@/components/pages/GrowLandingPage";
import { getDictionary } from "@/content/dictionary";
import { buildGrowJsonLd } from "@/lib/growth-jsonld";
import { pairPath } from "@/lib/growth-routes";

/**
 * SERBIAN GROW landing page — /sr/grow.
 *
 * This page used to live at /grow. Its CONTENT did not change when it moved: the body comes
 * from components/pages/GrowLandingPage.tsx (shared with the English half) and the copy from
 * content/sr/growth.ts verbatim, including the collapsed whitespace of the original
 * multi-line JSX text. The rendered Serbian <main> is identical to what /grow served at
 * commit 2ca411e, and a comparison against a worktree at that commit proves it.
 *
 * What changed is the URL and everything that follows from it: og:url, the self-canonical,
 * reciprocal hreflang with /grow, and the EN | SR switcher becoming active. /grow itself is
 * now the ENGLISH page — see content/routes.ts for the decision and its consequence for old
 * inbound links.
 *
 * The `_config.ts` and `_jsonld.ts` that used to live beside this file are gone; both are now
 * locale-aware in content/sr/growth.ts and lib/growth-jsonld.ts.
 */

const PATH = pairPath("grow", "sr");
const dictionary = getDictionary("sr").growth;

export default function GrowPage() {
  return (
    <GrowLandingPage
      copy={dictionary.grow}
      shared={dictionary.shared}
      trust={getDictionary("sr").home.trust}
      jsonLd={buildGrowJsonLd("sr", PATH)}
      cfoHref={pairPath("grow-cfo", "sr")}
      ceoHref={pairPath("grow-ceo", "sr")}
    />
  );
}
