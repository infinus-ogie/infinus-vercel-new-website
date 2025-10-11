import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { 
  Database, 
  Users, 
  Globe, 
  Boxes, 
  BarChart3, 
  Wrench
} from "lucide-react";

export function PartnershipBenefitsSection() {
  const benefitsItems = [
    {
      id: "deep-sap-expertise",
      title: "Deep SAP Expertise",
      description: "20+ years of combined consulting experience across SAP ECC, S/4HANA, ABAP, BTP, LoB solutions and platforms - proven knowledge, delivered with precision.",
      icon: Database,
      gradientColor: "#06B6D4" // Cyan
    },
    {
      id: "business-understanding",
      title: "Business Understanding",
      description: "We speak the language of CFOs, COOs, and CEOs - translating complex SAP concepts into clear business outcomes.",
      icon: Users,
      gradientColor: "#84CC16" // Lime
    },
    {
      id: "trusted-partnership",
      title: "Trusted Partnership",
      description: "We act as an extension of your team - transparent, accountable, and fully aligned with your success.",
      icon: Globe,
      gradientColor: "#F97316" // Orange
    },
    {
      id: "end-to-end-capability",
      title: "End-to-End Capability",
      description: "From advisory and implementation to support and optimization - we cover the full SAP lifecycle with one team.",
      icon: Boxes,
      gradientColor: "#8B5CF6" // Purple
    },
    {
      id: "agility-predictability",
      title: "Agility & Predictability",
      description: "Fast execution, minimal disruption, and results you can measure - powered by SAP Activate methodology and best practices.",
      icon: BarChart3,
      gradientColor: "#EC4899" // Pink
    },
    {
      id: "regional-presence",
      title: "Regional Presence, European Reach",
      description: "Headquartered in Serbia with clients across the EU - combining local dedication with international standards.",
      icon: Wrench,
      gradientColor: "#6366F1" // Indigo
    }
  ];

  return (
    <div className="w-full py-12 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-center text-center">
            <div className="flex gap-2 flex-col">
              <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl text-slate-900">
                Benefits working with us
              </h2>
              <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                Partnering with Infinus means working with experts who understand both SAP technology and real business challenges.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-8">
            {benefitsItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link href="/contact" key={item.id}>
                  <MagicCard
                    className="cursor-pointer flex-col items-start justify-start p-6 min-h-48 h-auto"
                    gradientColor="#3B82F6" // Jedna plavkasta boja za sve kartice
                    gradientSize={400}
                    gradientOpacity={0.08} // Mnogo blaža, jedva vidljiva
                  >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${item.gradientColor}15` }}
                    >
                      <IconComponent 
                        className="w-8 h-8" 
                        style={{ color: item.gradientColor }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                  </MagicCard>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
