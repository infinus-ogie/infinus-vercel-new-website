import { AnimatedSapExpertise } from "@/components/ui/animated-sap-expertise";
import { AnimatedDomainExpertise } from "@/components/ui/animated-domain-expertise";

export function AnimatedExpertiseDemo() {
  return (
    <div className="space-y-20">
      {/* SAP Expertise Section */}
      <AnimatedSapExpertise />
      
      {/* Domain Expertise Section */}
      <AnimatedDomainExpertise />
    </div>
  );
}
