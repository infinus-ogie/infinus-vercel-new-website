"use client";

import HeroAdvanced from "@/components/ui/hero-advanced";

export default function HeroDemoPage() {
  return (
    <div className="space-y-0">
      {/* Shader Mode */}
      <HeroAdvanced
        mode="shader"
        title="Shader Background Hero"
        description="This hero uses a neural network-inspired shader background with animated patterns. Perfect for modern, tech-focused landing pages."
        badge={{ label: "Demo", text: "Shader Mode" }}
        ctas={[
          { text: "Get Started", href: "#", primary: true },
          { text: "Learn More", href: "#" }
        ]}
        scrim="left"
      />

      {/* Image Mode */}
      <HeroAdvanced
        mode="image"
        title="Image Background Hero"
        description="This hero uses a static image background. Great for showcasing products, services, or creating a specific mood."
        badge={{ label: "Demo", text: "Image Mode" }}
        ctas={[
          { text: "View Gallery", href: "#", primary: true },
          { text: "Contact Us", href: "#" }
        ]}
        bgImage={{ 
          src: "/infinus-banner.png", 
          alt: "Infinus banner background" 
        }}
        scrim="left"
      />

      {/* Split Mode */}
      <HeroAdvanced
        mode="split"
        title="Split Layout Hero"
        description="This hero uses a split layout with content on one side and an image on the other. Perfect for detailed explanations with visual support."
        badge={{ label: "Demo", text: "Split Mode" }}
        ctas={[
          { text: "Download Now", href: "#", primary: true },
          { text: "Read Documentation", href: "#" }
        ]}
        sideImage={{ 
          src: "/infinus-banner.png", 
          alt: "Infinus side image" 
        }}
        scrim="center"
      />
    </div>
  );
}
