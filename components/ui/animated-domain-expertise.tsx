import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import AnimatedBackground from "@/components/ui/animated-background";

export function AnimatedDomainExpertise() {
  const domainExpertise = [
    {
      id: "retail",
      title: "Retail",
      description: "Transform customer experience and optimize inventory management with our retail-specific SAP implementations and solutions.",
      image: "/domain-expertise/retail.webp"
    },
    {
      id: "pharmaceuticals",
      title: "Pharmaceuticals",
      description: "Ensure regulatory compliance and streamline drug development processes with our pharmaceutical-focused SAP expertise.",
      image: "/domain-expertise/pharmaceuticals.webp"
    },
    {
      id: "wholesale-distribution",
      title: "Wholesale and Distribution",
      description: "Streamline distribution networks and improve supply chain visibility with our wholesale distribution SAP solutions.",
      image: "/domain-expertise/wholesale.jpeg"
    },
    {
      id: "consumer-goods",
      title: "Consumer Goods",
      description: "Streamline supply chain operations and enhance customer experience with our comprehensive SAP solutions tailored for consumer goods companies.",
      image: "/domain-expertise/consumer-goods.webp"
    },
    {
      id: "industrial-manufacturing",
      title: "Industrial Manufacturing",
      description: "Optimize production processes and improve operational efficiency with our specialized SAP implementations for industrial manufacturing.",
      image: "/domain-expertise/industrial-manufacturing.webp"
    },
    {
      id: "professional-services",
      title: "Professional Services",
      description: "Enhance project management and client delivery with our SAP solutions optimized for professional services organizations.",
      image: "/domain-expertise/professional-services.webp"
    },
    {
      id: "travel",
      title: "Travel",
      description: "Enhance guest experience and optimize operations with our specialized SAP solutions for travel and hospitality businesses.",
      image: "/domain-expertise/travel.webp"
    },
    {
      id: "oil-gas",
      title: "Oil & Gas",
      description: "Manage complex operations and ensure compliance with our industry-specific SAP solutions designed for oil and gas companies.",
      image: "/domain-expertise/oil-and-gas.webp"
    },
    {
      id: "telco",
      title: "Telco",
      description: "Manage network operations and customer services efficiently with our telecommunications-focused SAP solutions and expertise.",
      image: "/domain-expertise/telco.webp"
    }
  ];

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-center text-center">
            <div className="flex gap-2 flex-col">
              <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl text-slate-900">
                Domain Expertise
              </h2>
              <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                We deliver specialized SAP implementations and consulting services across diverse industries, ensuring your business gets the most value from your technology investments.
              </p>
            </div>
          </div>
          
          <AnimatedBackground
            className="rounded-lg bg-primary/10 border border-primary/20"
            transition={{
              type: 'spring',
              bounce: 0.2,
              duration: 0.6,
            }}
            enableHover
          >
            {domainExpertise.map((domain, index) => (
              <div key={index} data-id={domain.id} className="cursor-pointer">
                <div className="flex flex-col gap-2">
                  <div className="relative rounded-md aspect-video mb-2 overflow-hidden">
                    <Image
                      src={domain.image}
                      alt={domain.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{domain.title}</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {domain.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedBackground>
        </div>
      </div>
    </div>
  );
}
