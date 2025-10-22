"use client";

import { motion } from "framer-motion";
import { 
  Database, 
  CalendarCheck, 
  TrendingUp, 
  ShieldCheck, 
  Banknote, 
  AreaChart, 
  Sparkles, 
  Cloud, 
  Lock, 
  GitBranch,
  CheckCircle
} from "lucide-react";

const cfoBenefits = [
  {
    number: 1,
    title: "Jedinstvena „single source of truth“",
    body: "Integrisani finansije, prodaja, nabavka, logistika i operacije — bez excel ostrva, duplih unosa i verzija istog podatka.",
    icon: Database
  },
  {
    number: 2,
    title: "Brže i pouzdanije mesečno zatvaranje",
    body: "Automatizovana knjiženja, manje ručnog rada, sledljivost korekcija i jasne kontrole.",
    icon: CalendarCheck
  },
  {
    number: 3,
    title: "Real-time profitabilnost i cash-flow",
    body: "Profitabilnost po proizvodu/kupcu/kanalu + dnevni pogled na DSO/DPO i potrebe likvidnosti.",
    icon: TrendingUp
  },
  {
    number: 4,
    title: "Usklađenost i audit readiness",
    body: "Podrška za e-Faktura i eOtpremnica (SAP DRC/eDocument), IFRS 15/16, potpuni audit trail.",
    icon: ShieldCheck
  },
  {
    number: 5,
    title: "Automatizacija AP/AR i banaka",
    body: "Automatsko usklađivanje izvoda, kontrola kašnjenja, smanjenje grešaka i ubrzana naplata.",
    icon: Banknote
  },
  {
    number: 6,
    title: `Rolling forecast i „what-if" scenariji`,
    body: "Plan povezan sa operativnim podacima — agilne korekcije budžeta i investicija.",
    icon: AreaChart
  },
  {
    number: 7,
    title: "Ugrađena analitika i Business AI (Joule)",
    body: "Upiti prirodnim jezikom, prediktivna analitika, detekcija anomalija i automatizacija zadataka.",
    icon: Sparkles
  },
  {
    number: 8,
    title: "Niži TCO i predvidljiv OPEX",
    body: `Bez lokalnih servera, bez velikih „verzijskih projekata" - automatska ažuriranja u cloudu.`,
    icon: Cloud
  },
  {
    number: 9,
    title: "Sigurnost, dostupnost i kontrola pristupa",
    body: "Role-based access, enkripcija, SSO, visoka dostupnost, uz ISO i SOC sertifikate.",
    icon: Lock
  },
  {
    number: 10,
    title: "Spremnost za rast i M&A",
    body: "Multi-company/multi-country, konsolidacija i Group Reporting out-of-the-box.",
    icon: GitBranch
  }
];

// FeatureItem komponenta
function FeatureItem({
  number,
  icon: Icon,
  title,
  children,
}: {
  number: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative group rounded-2xl border bg-card/50 p-5 md:p-6 hover:bg-muted/40 transition-colors">
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
          {number}
        </span>
        <Icon className="size-6 md:size-7 text-primary/80" aria-hidden="true" />
        <h3 className="text-[18px] md:text-[20px] font-semibold tracking-tight">
          {title}
        </h3>
      </div>
      <p className="text-[14px] leading-6 text-muted-foreground max-w-prose">
        {children}
      </p>
    </li>
  );
}

const quickStartItems = [
  {
    icon: CalendarCheck,
    title: "Kraći monthly closing",
    description: "−20% do −30%"
  },
  {
    icon: Banknote,
    title: "Dnevni cash-flow forecast",
    description: "direktno iz sistema"
  },
  {
    icon: TrendingUp,
    title: "Profitabilnost po proizvodu/kanalu",
    description: "u realnom vremenu"
  }
];

export default function CfoBenefits() {
  return (
    <div className="space-y-12">
      {/* Cards Grid Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <ol className="grid md:grid-cols-2 gap-4 md:gap-6">
          {cfoBenefits.map((benefit) => (
            <FeatureItem 
              key={benefit.number} 
              number={benefit.number} 
              icon={benefit.icon} 
              title={benefit.title}
            >
              {benefit.body}
            </FeatureItem>
          ))}
        </ol>
      </motion.div>

      {/* Quick Start Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
          A za brzi start (prvih 90 dana):
        </h3>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {quickStartItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="rounded-2xl border bg-card/50 p-4 text-center">
                <IconComponent className="size-8 md:size-10 text-primary/80 mx-auto mb-3" />
                <h4 className="text-[16px] md:text-[18px] font-semibold tracking-tight mb-1">
                  {item.title}
                </h4>
                <p className="text-[14px] text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

