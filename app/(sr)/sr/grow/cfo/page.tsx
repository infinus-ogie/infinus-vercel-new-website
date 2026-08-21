import { GrowRolePage } from "@/components/pages/GrowRolePage";
import { getDictionary } from "@/content/dictionary";
import { buildRoleJsonLd } from "@/lib/growth-jsonld";
import { pairPath, ROLE_HERO_IMAGE } from "@/lib/growth-routes";

/**
 * SERBIAN SAP for CFOs — /sr/grow/cfo.
 *
 * The body moved to components/pages/GrowRolePage.tsx, shared with the English half and with
 * the other role page. The old `_sections/CFOTimeline.tsx` is gone: it did nothing but
 * wrap <Timeline> around a copy array, which now lives in the dictionary.
 *
 * Visible Serbian copy is byte-identical to what /grow/cfo served at commit 2ca411e, verified
 * against a worktree at that commit. The URL moved under /sr and /grow/cfo is now the ENGLISH
 * page; `alternates` carries the reciprocal pair and the switcher is active.
 */

const PATH = pairPath("grow-cfo", "sr");
const dictionary = getDictionary("sr").growth;

export default function CFOPage() {
  return (
    <GrowRolePage
      copy={dictionary.cfo}
      shared={dictionary.shared}
      trust={getDictionary("sr").home.trust}
      jsonLd={buildRoleJsonLd("sr", "cfo", PATH, pairPath("grow", "sr"))}
      jsonLdId="cfo-page-jsonld"
      bgImage={ROLE_HERO_IMAGE.cfo}
      role="cfo"
      faqId="faq-cfo"
    />
  );
}
