import { Blog7 } from "@/components/ui/blog7";

const servicesData = {
  tagline: "Our Services",
  heading: "SAP Solutions & Services",
  description: "Comprehensive SAP solutions and business services tailored to your needs. From implementation to support, we provide end-to-end SAP expertise.",
  buttonText: "Contact us for more information",
  buttonUrl: "/contact",
  services: [
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
};

function ServicesBlog7Demo() {
  return <Blog7 {...servicesData} />;
}

export { ServicesBlog7Demo };
