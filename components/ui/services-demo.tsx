// components/ui/services-demo.tsx

import {
  ServiceCarousel,
  type Service,
} from "@/components/ui/animated-service-card";
import { Settings, HeadphonesIcon, Wrench } from "lucide-react";

// Define the data for the Infinus services using existing images
const services: Service[] = [
  {
    number: "001",
    title: "SAP Implementation",
    description:
      "Complete SAP system implementation and configuration tailored to your business needs.",
    icon: "Settings",
    gradient: "from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50",
    image: "/our-services/sap-implementation.webp",
  },
  {
    number: "002",
    title: "SAP Support",
    description:
      "Ongoing SAP system maintenance, updates, and technical support to keep your business running smoothly.",
    icon: "HeadphonesIcon",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50",
    image: "/our-services/sap-support-service.png",
  },
  {
    number: "003",
    title: "Other Services",
    description:
      "Comprehensive business solutions including consulting, training, and custom development services.",
    icon: "Wrench",
    gradient: "from-slate-100 to-slate-200 dark:from-slate-700/50 dark:to-slate-600/50",
    image: "/our-services/other-services.png",
  },
];

// The demo component
export default function ServicesDemo() {
  return (
    <div className="w-full bg-background flex flex-col items-center justify-center p-8">
      <div className="text-left w-full max-w-6xl mb-12">
        <h1 className="text-6xl font-bold tracking-tighter text-slate-900">Our Services.</h1>
        <p className="text-xl text-slate-700 mt-4">
          Comprehensive SAP solutions and business services tailored to your needs.
        </p>
      </div>
      <ServiceCarousel services={services} />
    </div>
  );
}
