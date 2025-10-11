import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import { Cloud, Database, Sparkles, Boxes } from "lucide-react";

export function AnimatedSapExpertise() {
  const sapExpertiseItems = [
    {
      id: "sap-cloud-erp",
      title: "SAP Cloud ERP (Private and Public)",
      description: "Comprehensive cloud-based enterprise resource planning solutions for modern businesses.",
      icon: Cloud,
      gradientColor: "#3B82F6" // Blue
    },
    {
      id: "sap-business-data-cloud",
      title: "SAP Business Data Cloud",
      description: "Unified data management and analytics platform for intelligent business insights.",
      icon: Database,
      gradientColor: "#10B981" // Green
    },
    {
      id: "sap-business-ai",
      title: "SAP Business AI",
      description: "Artificial intelligence solutions integrated into your SAP ecosystem for smarter decisions.",
      icon: Sparkles,
      gradientColor: "#8B5CF6" // Purple
    },
    {
      id: "sap-business-technology-platform",
      title: "SAP Business Technology Platform",
      description: "Complete platform for integration, analytics, and application development.",
      icon: Boxes,
      gradientColor: "#F59E0B" // Orange
    }
  ];

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-center text-center">
            <div className="flex gap-2 flex-col">
              <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl text-slate-900">
                SAP Expertise
              </h2>
              <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                We deliver specialized SAP implementations and consulting services across the complete SAP ecosystem, ensuring your business gets the most value from your technology investments.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto pb-8">
            {sapExpertiseItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <MagicCard
                  key={item.id}
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
