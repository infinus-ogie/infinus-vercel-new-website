import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

// Interface for individual process card props
interface ProcessCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}

// Reusable Process Card Component
const ProcessCard: React.FC<ProcessCardProps & { angle?: number; radius?: number }> = ({ 
  icon: Icon, 
  title, 
  description, 
  className,
  angle = 0,
  radius = 0
}) => {
  const x = radius * Math.cos(angle * Math.PI / 180);
  const y = radius * Math.sin(angle * Math.PI / 180);
  
  return (
    <div 
      className={cn("group absolute rounded-xl border border-slate-200 bg-white p-5 transition-all cursor-pointer duration-300 hover:border-[#0a6ed1]/60 hover:shadow-xl w-[160px] md:w-[200px] z-20", className)}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Icon Container */}
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg duration-300 border border-slate-200 bg-slate-50 text-[#0a6ed1] shadow-sm transition-colors group-hover:bg-[#0a6ed1] group-hover:text-white mx-auto">
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="flex flex-col text-center">
        <h3 className="mb-1.5 text-base font-semibold text-slate-900 leading-tight">{title}</h3>
        <p className="text-xs text-slate-600 leading-snug line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

// Interface for the main section props
interface ProcessSectionProps {
  subtitle?: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  items: ProcessCardProps[];
  className?: string;
}

// Main Process Section Component
export const ProcessSection: React.FC<ProcessSectionProps> = ({
  subtitle,
  title,
  description,
  buttonText,
  buttonHref,
  items,
  className,
}) => {
  // Calculate angles for semicircle layout (from -90 to 90 degrees, top to bottom)
  const startAngle = -90; // Start from top
  const endAngle = 90; // End at bottom
  const totalAngle = endAngle - startAngle;
  const angleStep = items.length > 1 ? totalAngle / (items.length - 1) : 0;
  
  // Radius for desktop and mobile - increased for better spacing
  const radiusDesktop = 320;
  const radiusMobile = 200;
  
  return (
    <div className={cn("w-full py-12 md:py-16", className)}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Mobile: Simple vertical layout */}
        <div className="block md:hidden space-y-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
            {title}
          </h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="group relative rounded-lg border border-slate-200 bg-white p-4 flex-1 transition-all duration-300 hover:border-[#0a6ed1]/60 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#0a6ed1] shadow-sm transition-colors group-hover:bg-[#0a6ed1] group-hover:text-white flex-shrink-0">
                      {React.createElement(item.icon, { className: "h-6 w-6" })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </div>
                {index < items.length - 1 && (
                  <div className="flex-shrink-0">
                    <ArrowRight className="h-5 w-5 text-[#0a6ed1] rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Semicircle layout */}
        <div className="hidden md:block relative" style={{ height: '700px', minHeight: '700px' }}>
          {/* Center Title - Larger space */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <span className="text-sm font-medium uppercase tracking-widest text-[#0a6ed1]">
                {subtitle}
              </span>
            )}
          </div>

          {/* Process Cards in Semicircle - Increased radius for better spacing */}
          {items.map((item, index) => {
            const angle = startAngle + (angleStep * index);
            // Increase radius for cards further from center
            const cardRadius = radiusDesktop + 20;
            return (
              <React.Fragment key={index}>
                <ProcessCard
                  {...item}
                  angle={angle}
                  radius={cardRadius}
                />
                {/* Arrow between cards - positioned between cards */}
                {index < items.length - 1 && (
                  <div
                    className="absolute z-10"
                    style={{
                      left: `calc(50% + ${(cardRadius - 30) * Math.cos((angle + angleStep / 2) * Math.PI / 180)}px)`,
                      top: `calc(50% + ${(cardRadius - 30) * Math.sin((angle + angleStep / 2) * Math.PI / 180)}px)`,
                      transform: `translate(-50%, -50%) rotate(${angle + angleStep / 2 + 90}deg)`,
                    }}
                  >
                    <ArrowRight className="h-5 w-5 text-[#0a6ed1] bg-white rounded-full p-1.5 shadow-md border border-slate-200" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

