import { Badge } from "@/components/ui/badge";
import AnimatedBackground from "@/components/ui/animated-background";

export function AnimatedSapExpertise() {
  const sapExpertiseItems = [
    {
      id: "sap-cloud-erp",
      title: "SAP Cloud ERP (Private and Public)",
      description: "Comprehensive cloud-based enterprise resource planning solutions for modern businesses."
    },
    {
      id: "sap-business-data-cloud",
      title: "SAP Business Data Cloud",
      description: "Unified data management and analytics platform for intelligent business insights."
    },
    {
      id: "sap-business-ai",
      title: "SAP Business AI",
      description: "Artificial intelligence solutions integrated into your SAP ecosystem for smarter decisions."
    },
    {
      id: "sap-business-technology-platform",
      title: "SAP Business Technology Platform",
      description: "Complete platform for integration, analytics, and application development."
    }
  ];

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-center text-center">
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-4xl font-regular text-slate-900">
                SAP Expertise
              </h2>
              <p className="text-lg max-w-2xl leading-relaxed tracking-tight text-slate-700">
                We deliver specialized SAP implementations and consulting services across the complete SAP ecosystem, ensuring your business gets the most value from your technology investments.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <AnimatedBackground
              className="rounded-lg bg-primary/10 border border-primary/20"
              transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.6,
              }}
              enableHover
            >
              {sapExpertiseItems.map((item, index) => (
                <div key={index} data-id={item.id} className="cursor-pointer">
                  <div className="flex flex-col space-y-2 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-700">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </AnimatedBackground>
          </div>
        </div>
      </div>
    </div>
  );
}
