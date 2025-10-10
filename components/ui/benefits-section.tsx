import { ArrowRight, Globe, Users, DollarSign, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Benefit {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BenefitsSectionProps {
  tagline: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  benefits: Benefit[];
}

const BenefitsSection = ({
  tagline = "Why Choose Us",
  heading = "Benefits from working with us",
  description = "Discover the advantages of partnering with Infinus for your SAP implementation and support needs. We provide European expertise, flexible engagement models, and competitive pricing.",
  buttonText = "Contact us today",
  buttonUrl = "/contact",
  benefits = [],
}: BenefitsSectionProps) => {
  return (
    <section className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
          <Button className="btn-primary w-full sm:w-auto h-12 px-6" asChild>
            <a href={buttonUrl}>
              {buttonText}
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="card card--hover p-6 text-center transition-all duration-200"
              >
                {benefit.id === "benefit-1" ? (
                  <div className="flex justify-center mb-4 relative">
                    <div className="relative w-16 h-16">
                      <img 
                        src="/benefits-from-working-with-us-images/europe-6.png" 
                        alt="Europe map" 
                        className="w-full h-full object-contain opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
                      </div>
                    </div>
                  </div>
                ) : IconComponent ? (
                  <div className="flex justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                ) : null}
                <h3 className="text-base font-semibold mb-2 text-slate-900">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-700 mt-1">
                  {benefit.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { BenefitsSection };
