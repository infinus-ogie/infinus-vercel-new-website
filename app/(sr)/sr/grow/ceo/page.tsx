import { GrowRolePage } from "@/components/pages/GrowRolePage";
import { getDictionary } from "@/content/dictionary";
import { buildRoleJsonLd } from "@/lib/growth-jsonld";
import { pairPath, ROLE_HERO_IMAGE } from "@/lib/growth-routes";

/**
 * SERBIAN SAP for CEOs — /sr/grow/ceo.
 *
 * The body moved to components/pages/GrowRolePage.tsx, shared with the English half and with
 * the other role page. The old `_sections/CEOTimeline.tsx` is gone: it did nothing but
 * wrap <Timeline> around a copy array, which now lives in the dictionary.
 *
 * Visible Serbian copy is byte-identical to what /grow/ceo served at commit 2ca411e, verified
 * against a worktree at that commit. The URL moved under /sr and /grow/ceo is now the ENGLISH
 * page; `alternates` carries the reciprocal pair and the switcher is active.
 */

const PATH = pairPath("grow-ceo", "sr");
const dictionary = getDictionary("sr").growth;

export default function CEOPage() {
  return (
    <GrowRolePage
      copy={dictionary.ceo}
      shared={dictionary.shared}
      trust={getDictionary("sr").home.trust}
      jsonLd={buildRoleJsonLd("sr", "ceo", PATH, pairPath("grow", "sr"))}
      jsonLdId="ceo-page-jsonld"
      bgImage={ROLE_HERO_IMAGE.ceo}
      role="ceo"
      faqId="faq-ceo"
    />
  );
}
