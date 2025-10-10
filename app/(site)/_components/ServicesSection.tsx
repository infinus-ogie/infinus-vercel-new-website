// app/(site)/_components/ServicesSection.tsx
// OUR SERVICES - Using Blog7 component with your exact text content
// KEEP YOUR EXACT COPY: all text content preserved from original

import { Blog7 } from "@/components/ui/blog7";

export default function ServicesSection() {
  return (
    <Blog7
      tagline="What we offer"
      heading="Our Services"
      description="Comprehensive SAP solutions designed to accelerate your business growth and digital transformation."
      buttonText="Contact us for more information"
      buttonUrl="/contact"
      services={[
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
          image: "/our-services/implemetation2.png",
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
          image: "/our-services/support2.png",
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
          image: "/our-services/other services4.png",
        },
      ]}
    />
  );
}
