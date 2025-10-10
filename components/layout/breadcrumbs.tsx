import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length <= 1) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
    >
      {items.map((item, index) => (
        <div key={item.url} className="flex items-center">
          {index === 0 && (
            <Home className="h-4 w-4 mr-1" aria-hidden="true" />
          )}
          
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground" aria-current="page">
              {item.name}
            </span>
          ) : (
            <>
              <Link
                href={item.url}
                className="hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" aria-hidden="true" />
            </>
          )}
        </div>
      ))}
    </nav>
  )
}
