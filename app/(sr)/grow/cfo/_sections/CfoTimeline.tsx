"use client";
import { Timeline } from "@/components/ui/timeline";

/** 
 * Sadržaj MORA ostati identičan — ne menjamo ni jednu reč.
 * Svaku tačku stavljamo u jedan Timeline čvor.
 */
export function CfoTimeline() {
  const data = [
    {
      title: '1) Jedinstvena „single source of truth"',
      content: (
        <p>
          Integrisani finansije, prodaja, nabavka, logistika i operacije - bez excel ostrva,
          duplih unosa i verzija istog podatka.
        </p>
      ),
    },
    {
      title: "2) Brže i pouzdanije mesečno zatvaranje",
      content: (
        <p>
          Automatizovana knjiženja, manje ručnog rada, sledljivost korekcija i jasne kontrole.
        </p>
      ),
    },
    {
      title: "3) Real-time profitabilnost i cash-flow",
      content: (
        <p>
          Profitabilnost po proizvodu/kupcu/kanalu + dnevni pogled na DSO/DPO i potrebe
          likvidnosti.
        </p>
      ),
    },
    {
      title: "4) Usklađenost i audit readiness",
      content: (
        <p>
          Podrška za e-Faktura i eOtpremnica (SAP DRC/eDocument), IFRS 15/16, potpuni
          audit trail.
        </p>
      ),
    },
    {
      title: "5) Automatizacija AP/AR i banaka",
      content: (
        <p>
          Automatsko usklađivanje izvoda, kontrola kašnjenja, smanjenje grešaka i ubrzana
          naplata.
        </p>
      ),
    },
    {
      title: '6) Rolling forecast i „what-if" scenariji',
      content: (
        <p>
          Plan povezan sa operativnim podacima - agilne korekcije budžeta i investicija.
        </p>
      ),
    },
    {
      title: "7) Ugrađena analitika i Business AI (Joule)",
      content: (
        <p>
          Upiti prirodnim jezikom, prediktivna analitika, detekcija anomalija i automatizacija
          zadataka.
        </p>
      ),
    },
    {
      title: '8) Niži TCO i predvidljiv OPEX',
      content: (
        <p>
          Bez lokalnih servera, bez velikih „verzijskih projekata" - automatska ažuriranja u
          cloudu.
        </p>
      ),
    },
    {
      title: "9) Sigurnost, dostupnost i kontrola pristupa",
      content: (
        <p>
          Role-based access, enkripcija, SSO, visoka dostupnost, uz ISO i SOC sertifikate.
        </p>
      ),
    },
    {
      title: "10) Spremnost za rast i M&A",
      content: (
        <p>
          Multi-company/multi-country, konsolidacija i Group Reporting out-of-the-box.
        </p>
      ),
    },
  ];

  return (
    <Timeline
      data={data}
      heading="Ključne prednosti iz CFO perspektive"
      description='10 razloga zašto SAP Cloud ERP + Business AI nadmašuje „ERP + Excel"'
      className="scroll-mt-24"
      id="prednosti"
    />
  );
}

