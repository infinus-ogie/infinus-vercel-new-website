import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HowItWorksItem {
  title: string;
  description: string;
}

interface HowItWorksProps {
  title: string;
  subtitle?: string;
  description?: string;
  items: HowItWorksItem[];
  className?: string;
}

export function HowItWorksSimple({
  title,
  subtitle,
  description,
  items,
  className,
}: HowItWorksProps) {
  return (
    <div className={cn("w-full py-12 md:py-20", className)}>
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex gap-4 flex-col items-start">
          {subtitle && (
            <div>
              <Badge variant="outline" className="border border-[#0a6ed1] text-[#0a6ed1] bg-transparent">
                {subtitle}
              </Badge>
            </div>
          )}
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-bold text-slate-900">
              {title}
            </h2>
            {description && (
              <p className="text-lg max-w-2xl leading-relaxed text-slate-600">
                {description}
              </p>
            )}
          </div>
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {items.map((item, index) => (
                <div key={index} className="flex flex-row gap-4 items-start">
                  <Check className="w-5 h-5 mt-0.5 text-[#0a6ed1] flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

