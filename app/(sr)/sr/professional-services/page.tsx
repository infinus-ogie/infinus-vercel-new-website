import { ProfessionalServicesPage } from "@/components/pages/ProfessionalServicesPage";
import { getDictionary } from "@/content/dictionary";
import { buildProfessionalServicesJsonLd } from "@/lib/growth-jsonld";
import { pairPath } from "@/lib/growth-routes";

/**
 * SERBIAN Professional Services page — /sr/professional-services.
 *
 * The body comes from components/pages/ProfessionalServicesPage.tsx, shared with the English
 * half at /professional-services, and the copy from content/sr/growth.ts verbatim.
 *
 * Visible Serbian copy is byte-identical to what /professional-services served at commit
 * 2ca411e. The URL moved under /sr and that clean path is now the ENGLISH page.
 *
 * ── One thing that DID change, on purpose ────────────────────────────────────────
 * The four download URLs in the JSON-LD ItemList used to point at
 * /professional-services-materials/, a directory that does not exist — the real files are in
 * /growth-professional-services-materials/. H4 preserved that broken structured data to keep
 * this page byte-identical at its old URL. Now that the page is deliberately moving, the
 * owner authorised the fix, so both locales advertise the real asset paths. The visible
 * download links were always correct and are untouched; only the schema URLs changed.
 */

const PATH = pairPath("professional-services", "sr");
const dictionary = getDictionary("sr").growth;

export default function ProfessionalServicesRoute() {
  return (
    <ProfessionalServicesPage
      copy={dictionary.professionalServices}
      shared={dictionary.shared}
      trust={getDictionary("sr").home.trust}
      jsonLd={buildProfessionalServicesJsonLd("sr", PATH)}
    />
  );
}
