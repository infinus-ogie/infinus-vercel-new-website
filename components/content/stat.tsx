import { cn } from "@/lib/utils"

interface StatProps {
  value: string
  label: string
  description?: string
  className?: string
}

export function Stat({ value, label, description, className }: StatProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
        {value}
      </div>
      <div className="text-lg font-semibold text-foreground mb-1">
        {label}
      </div>
      {description && (
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  )
}
