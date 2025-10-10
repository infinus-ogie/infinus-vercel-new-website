import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface Service {
  id: string;
  title: string;
  description: string;
  label: string;
  bullets: string[];
  url: string;
  image: string;
}

interface Blog7Props {
  tagline: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  services: Service[];
}

const Blog7 = ({
  tagline = "Our Services",
  heading = "SAP Solutions & Services",
  description = "Comprehensive SAP solutions and business services tailored to your needs. From implementation to support, we provide end-to-end SAP expertise.",
  buttonText = "Contact us for more information",
  buttonUrl = "/contact",
  services = [
    {
      id: "service-1",
      title: "SAP Implementation Services",
      description: "Greenfield, brownfield, conversions, migrations and rollouts.",
      label: "Implementation",
      bullets: [
        "Project scoping & fit-to-standard blueprint",
        "Configuration, extensions & integrations",
        "Data migration, cleansing & reconciliation",
        "Testing, cutover & hypercare",
      ],
      url: "/contact",
      image: "/our-services/sap-implementation.webp",
    },
    {
      id: "service-2",
      title: "SAP Support Services",
      description: "SAP Application Management Services and SLA Support Services",
      label: "Support",
      bullets: [
        "24/7 monitoring & incident resolution",
        "SLA-driven service desk (L1–L3)",
        "Performance tuning & patch management",
        "Minor enhancements & release management",
      ],
      url: "/contact",
      image: "/our-services/sap-support-service.png",
    },
    {
      id: "service-3",
      title: "Other Services",
      description: "SAP localisation support, developments, trainings, etc.",
      label: "Additional",
      bullets: [
        "Country-specific localisation & compliance",
        "Custom development (ABAP / extensions)",
        "Integrations & automation",
        "End-user & key-user training",
      ],
      url: "/contact",
      image: "/our-services/other-services.png",
    },
  ],
}: Blog7Props) => {
  return (
    <section id="services" className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((service) => (
            <Card key={service.id} className="grid grid-rows-[auto_auto_1fr_auto] p-4 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.03] border-2 border-transparent hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
                <a
                  href={service.url}
                  className="block transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-all duration-300 hover:brightness-110"
                    style={{ 
                      objectPosition: service.id === 'service-3' ? 'center -90px' : 'center -60px' 
                    }}
                  />
                </a>
              </div>
              <CardHeader className="pb-1 px-0">
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  <a href={service.url}>
                    {service.title}
                  </a>
                </h3>
              </CardHeader>
              <CardContent className="px-0">
                <p className="text-muted-foreground mb-3 mt-1">{service.description}</p>
              </CardContent>
              <CardFooter className="px-0 pt-2">
                <a
                  href={service.url}
                  className="flex items-center text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Learn more
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog7 };