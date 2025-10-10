import { BenefitsSection } from "@/components/ui/benefits-section"

const benefitsData = {
  tagline: "Why Choose Us",
  heading: "Benefits from working with us",
  description: "Discover the advantages of partnering with Infinus for your SAP implementation and support needs. We provide European expertise, flexible engagement models, and competitive pricing.",
  buttonText: "Contact us today",
  buttonUrl: "/contact",
  benefits: [
    {
      id: "benefit-1",
      title: "European Focus",
      summary: "We are located in Serbia (CET time zone) and provide services throughout Europe. All our consultants are fluent in English and some of them in German as well.",
      label: "Location",
      author: "Infinus Team",
      published: "2024",
      url: "/contact",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop&crop=center",
    },
    {
      id: "benefit-2",
      title: "Hybrid Work Model",
      summary: "Our consultants are available for both onsite and remote work, giving you the flexibility to choose the option that works best for you.",
      label: "Flexibility",
      author: "Infinus Team",
      published: "2024",
      url: "/contact",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=450&fit=crop&crop=center",
    },
    {
      id: "benefit-3",
      title: "Competitive Pricing",
      summary: "By sourcing with us, you can take advantage of cost-effective services without sacrificing quality.",
      label: "Value",
      author: "Infinus Team",
      published: "2024",
      url: "/contact",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop&crop=center",
    },
    {
      id: "benefit-4",
      title: "Flexible Solutions",
      summary: "We offer flexible engagement models tailored to your unique needs, ensuring you get exactly what you need when you need it.",
      label: "Customization",
      author: "Infinus Team",
      published: "2024",
      url: "/contact",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop&crop=center",
    },
  ],
};

function BenefitsDemo() {
  return <BenefitsSection {...benefitsData} />;
}

export { BenefitsDemo };
