import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  features?: string[]
}

export function ServiceCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  features = [] 
}: ServiceCardProps) {
  return (
    <div className="card card--hover h-full p-6 transition-all hover:-translate-y-1">
      <div className="flex flex-col space-y-1.5 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-slate-900">{title}</h3>
        </div>
        <p className="text-sm text-slate-600">
          {description}
        </p>
      </div>
      
      {features.length > 0 && (
        <div className="mb-6">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="pt-0">
        <Button asChild className="btn-primary w-full h-12 px-6">
          <Link href={href}>
            Learn More
          </Link>
        </Button>
      </div>
    </div>
  )
}
