import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { getDictionary } from "@/content/dictionary";
import type { HomeDictionary } from "@/content/dictionary";
import { 
  Database, 
  Users, 
  Globe, 
  Boxes, 
  BarChart3, 
  Wrench
} from "lucide-react";

/**
 * Phase H1: the copy moved to content/{en,sr}/home.ts. `copy` defaults to the ENGLISH
 * dictionary, so existing callers render byte-identical output. Icons and gradient colours stay here; they are presentation and are paired with the
 * dictionary items by position, which the 6-tuple in HomeDictionary keeps in step.
 */
export function PartnershipBenefitsSection({
  copy = getDictionary("en").home.benefits,
}: {
  copy?: HomeDictionary["benefits"];
}) {
  // Presentation only — paired with the dictionary items by position.
  const benefitPresentation = [
    { id: "deep-sap-expertise", icon: Database, gradientColor: "#06B6D4" },
    { id: "business-understanding", icon: Users, gradientColor: "#84CC16" },
    { id: "trusted-partnership", icon: Globe, gradientColor: "#F97316" },
    { id: "end-to-end-capability", icon: Boxes, gradientColor: "#8B5CF6" },
    { id: "agility-predictability", icon: BarChart3, gradientColor: "#EC4899" },
    { id: "regional-presence", icon: Wrench, gradientColor: "#6366F1" },
  ];

  return (
    <div className="w-full py-12 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-center text-center">
            <div className="flex gap-2 flex-col">
              <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl text-slate-900">
                {copy.heading}
              </h2>
              <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                {copy.lede}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-8">
            {benefitPresentation.map((item, index) => {
              const IconComponent = item.icon;
              const text = copy.items[index];
              return (
                <Link href={copy.cardHref} key={item.id}>
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
                      {text.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {text.body}
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
