"use client";

import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function Hero() {
  return (
    <div className="w-full relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/infinus-banner.png"
          alt="Infinus Banner"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto">
          <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
            <div className="flex gap-4 flex-col">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance text-white text-center">
                Driving Business Success through SAP Expertise
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 text-balance text-center">
                Your reliable SAP expertise partner
              </p>
            </div>
            <div className="flex flex-row gap-3">
              <Button size="lg" className="gap-4" variant="secondary">
                Contact Us <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
