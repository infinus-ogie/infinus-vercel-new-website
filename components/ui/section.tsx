import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  surface?: "surface-0" | "surface-1"
  topFade?: boolean
  bottomFade?: boolean
  id?: string
  "data-section"?: string
}

export function Section({
  children,
  surface = "surface-0",
  topFade = false,
  bottomFade = false,
  className = "",
  id,
  "data-section": dataSection
}: SectionProps) {
  return (
    <section
      id={id}
      data-section={dataSection}
      className={cn(
        "section",
        `section--${surface}`,
        className
      )}
      data-topfade={topFade ? "true" : undefined}
      data-botfade={bottomFade ? "true" : undefined}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24">
        {children}
      </div>
    </section>
  )
}
