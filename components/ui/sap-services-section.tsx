import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { 
  Cloud, 
  Settings, 
  Shield, 
  Zap, 
  Sparkles
} from "lucide-react";

export function SapServicesSection() {
  const servicesItems = [
    {
      id: "sap-advisory-consulting",
      title: "SAP Advisory & Consulting",
      description: "We define the right SAP strategy for your business - aligning technology with your goals and ensuring measurable outcomes.",
      icon: Cloud,
      gradientColor: "#3B82F6" // Blue
    },
    {
      id: "sap-implementations",
      title: "SAP Implementations",
      description: "Fast, transparent, and reliable deployments based on SAP Activate and proven best practices - tailored to your operations.",
      icon: Settings,
      gradientColor: "#10B981" // Green
    },
    {
      id: "sap-application-management",
      title: "SAP Application Management & Support",
      description: "Continuous monitoring, optimization, and expert guidance to keep your SAP system stable, secure, and up to date.",
      icon: Shield,
      gradientColor: "#8B5CF6" // Purple
    },
    {
      id: "sap-integration-optimization",
      title: "SAP Integration & Process Optimization",
      description: "Connecting SAP with other systems to streamline workflows, improve visibility, and eliminate operational silos.",
      icon: Zap,
      gradientColor: "#F59E0B" // Orange
    },
    {
      id: "sap-extensions-innovation",
      title: "SAP Extensions & Innovation",
      description: "Enhancing standard SAP functionality through custom developments, analytics, and BTP innovations for your specific needs.",
      icon: Sparkles,
      gradientColor: "#EF4444" // Red
    }
  ];

  return (
    <div className="w-full py-12 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-center text-center">
            <div className="flex gap-2 flex-col">
              <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl text-slate-900">
                Our Expertise in Action
              </h2>
              <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                We combine business insight and SAP expertise to help companies operate smarter, faster, and with confidence. From strategy to support, we're your trusted partner throughout the entire SAP lifecycle.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-8">
            {servicesItems.map((item, index) => {
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
