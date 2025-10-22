"use client";
import { Timeline } from "@/components/ui/timeline";

/** 
 * Sadržaj MORA ostati identičan - ne menjamo ni jednu reč.
 * Svaku tačku stavljamo u jedan Timeline čvor.
 */
export function CeoTimeline() {
  const data = [
    {
      title: "1) Business AI kao poluga rasta",
      content: (
        <p>
          Brže analize, uvidi i odluke, bez čekanja izveštaja.
        </p>
      ),
    },
    {
      title: "2) End-to-end pokrivenost svih procesa",
      content: (
        <p>
          Jedan integrisani sistem za ceo value chain.
        </p>
      ),
    },
    {
      title: "3) Brz i pouzdan uvid u svaki element poslovanja",
      content: (
        <p>
          Profitabilnost, cash-flow, margin mix, rizici.
        </p>
      ),
    },
    {
      title: "4) Rolling forecast i what-if scenariji",
      content: (
        <p>
          Predvidivost rasta i sigurnije investicione odluke (CapEx, M&A).
        </p>
      ),
    },
    {
      title: "5) Optimizacija poslovanja uz SAP Best Practices",
      content: (
        <p>
          Standardizovani O2C/P2P, niži operativni rizik, veća efikasnost.
        </p>
      ),
    },
    {
      title: "6) Skaliranje i M&A readiness",
      content: (
        <p>
          Multi-company/multi-country, brza post-merger integracija i konsolidacija.
        </p>
      ),
    },
    {
      title: "7) Sigurnost i kontinuitet poslovanja",
      content: (
        <p>
          Pouzdan rad bez zastoja, zaštita podataka i kontrolisan pristup; manji operativni rizik.
        </p>
      ),
    },
    {
      title: "8) Brži time-to-cash i oslobađanje gotovine",
      content: (
        <p>
          Kraći DSO/DIO/DPO, niži obrtni kapital, jača likvidnost.
        </p>
      ),
    },
    {
      title: "9) Efikasnija alokacija kapitala",
      content: (
        <p>
          Jasan ROI po segmentima; gašenje neprofitabilnih inicijativa, ulaganje u pobednike.
        </p>
      ),
    },
    {
      title: "10) Revenue assurance (bez curenja prihoda)",
      content: (
        <p>
          Stroža kontrola popusta/rabata i tačno fakturisanje; manje „pojedene" marže.
        </p>
      ),
    },
    {
      title: "11) Jača pozicija kod banaka i investitora",
      content: (
        <p>
          Transparentni KPI i pouzdani izveštaji ubrzavaju due diligence i poboljšavaju uslove finansiranja.
        </p>
      ),
    },
    {
      title: "12) Manji key-person rizik",
      content: (
        <p>
          Standardizacija i automatizacija smanjuju zavisnost od pojedinaca i obezbeđuju kontinuitet.
        </p>
      ),
    },
  ];

  return (
    <Timeline
      data={data}
      heading="Ključne prednosti iz CEO perspektive"
      description="12 razloga zašto SAP Cloud ERP + Business AI ubrzava rast i smanjuje rizik"
      className="scroll-mt-24"
      id="prednosti"
    />
  );
}

