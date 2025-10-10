"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Pill, 
  Truck, 
  Package, 
  Factory, 
  Briefcase, 
  Plane, 
  Fuel, 
  Wifi 
} from "lucide-react";

const industries = [
  { name: "Retail", icon: ShoppingBag },
  { name: "Pharmaceuticals", icon: Pill },
  { name: "Wholesale & Distribution", icon: Truck },
  { name: "Consumer Goods", icon: Package },
  { name: "Industrial Manufacturing", icon: Factory },
  { name: "Professional Services", icon: Briefcase },
  { name: "Travel", icon: Plane },
  { name: "Oil & Gas", icon: Fuel },
  { name: "Telco", icon: Wifi },
];

export function IndustriesScroll() {
  // Duplicate the array to create seamless loop
  const duplicatedIndustries = [...industries, ...industries];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs uppercase tracking-wide text-slate-500 text-center mb-4">
        Industrije
      </p>
      <div className="overflow-hidden">
        <motion.div
          className="flex space-x-8 py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            duration: 30, 
            ease: "linear" 
          }}
        >
          {duplicatedIndustries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <div 
                key={`${industry.name}-${index}`} 
                className="flex flex-col items-center min-w-[120px] flex-shrink-0"
              >
                <div className="p-3 rounded-full bg-slate-50 border border-slate-200 mb-2">
                  <Icon className="h-6 w-6 text-slate-600" />
                </div>
                <span className="text-sm text-slate-700 text-center leading-tight">
                  {industry.name}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
