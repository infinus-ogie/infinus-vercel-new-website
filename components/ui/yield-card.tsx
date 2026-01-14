import React from 'react';
import { LucideIcon } from 'lucide-react';

interface YieldCardProps {
  title: string;
  description: string | React.ReactNode;
  description2?: string | React.ReactNode;
  icon: LucideIcon;
  gradientColors: {
    bg: string;
    iconColor: string;
  };
}

export const YieldCard = ({ 
  title, 
  description, 
  description2,
  icon: Icon,
  gradientColors 
}: YieldCardProps) => {
  return (
    <div className="w-full h-full">
      <div 
        className="relative rounded-2xl p-8 md:p-10 h-full transition-all"
        style={{
          background: gradientColors.bg,
          border: '1px solid rgba(10, 110, 209, 0.12)',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Icon - refined, calm confidence */}
        <div className="mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <Icon className="h-5 w-5 text-[#0a6ed1]" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Card Title */}
        <h2 className="font-semibold text-slate-900 tracking-tight leading-tight text-2xl md:text-3xl pb-3 mb-4">
          {title}
        </h2>
        
        {/* Card Description */}
        <p className="font-normal leading-relaxed text-slate-600 text-base mb-3">
          {description}
        </p>
        
        {description2 && (
          <p className="font-medium leading-relaxed text-slate-900 text-base">
            {description2}
          </p>
        )}
      </div>
    </div>
  );
};
