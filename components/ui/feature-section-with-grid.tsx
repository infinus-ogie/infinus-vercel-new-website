import { Badge } from "@/components/ui/badge";
import Image from "next/image";

function Feature() {
  const domainExpertise = [
    {
      title: "Retail",
      description: "Transform customer experience and optimize inventory management with our retail-specific SAP implementations and solutions.",
      image: "/domain-expertise/retail.webp"
    },
    {
      title: "Pharmaceuticals",
      description: "Ensure regulatory compliance and streamline drug development processes with our pharmaceutical-focused SAP expertise.",
      image: "/domain-expertise/pharmaceuticals.webp"
    },
    {
      title: "Wholesale and Distribution",
      description: "Streamline distribution networks and improve supply chain visibility with our wholesale distribution SAP solutions.",
      image: "/domain-expertise/wholesale.jpeg"
    },
    {
      title: "Consumer Goods",
      description: "Streamline supply chain operations and enhance customer experience with our comprehensive SAP solutions tailored for consumer goods companies.",
      image: "/domain-expertise/consumer-goods.webp"
    },
    {
      title: "Industrial Manufacturing",
      description: "Optimize production processes and improve operational efficiency with our specialized SAP implementations for industrial manufacturing.",
      image: "/domain-expertise/industrial-manufacturing.webp"
    },
    {
      title: "Professional Services",
      description: "Enhance project management and client delivery with our SAP solutions optimized for professional services organizations.",
      image: "/domain-expertise/professional-services.webp"
    },
    {
      title: "Travel",
      description: "Enhance guest experience and optimize operations with our specialized SAP solutions for travel and hospitality businesses.",
      image: "/domain-expertise/travel.webp"
    },
    {
      title: "Oil & Gas",
      description: "Manage complex operations and ensure compliance with our industry-specific SAP solutions designed for oil and gas companies.",
      image: "/domain-expertise/oil-and-gas.webp"
    },
    {
      title: "Telco",
      description: "Manage network operations and customer services efficiently with our telecommunications-focused SAP solutions and expertise.",
      image: "/domain-expertise/telco.webp"
    }
  ];

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Domain Expertise</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left text-slate-900">
                Industry-Specific SAP Solutions
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-slate-700 text-left">
                We deliver specialized SAP implementations and consulting services across diverse industries, ensuring your business gets the most value from your technology investments.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {domainExpertise.map((domain, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="relative rounded-md aspect-video mb-2 overflow-hidden">
                  <Image
                    src={domain.image}
                    alt={domain.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-xl tracking-tight text-slate-900">{domain.title}</h3>
                <p className="text-slate-700 text-base">
                  {domain.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
