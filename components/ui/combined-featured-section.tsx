'use client'

import Image from 'next/image'
import { Activity, ArrowRight, Files, Flower, GalleryVerticalEnd, MapPin, Layers, Rocket } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/card'
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

export default function CombinedFeaturedSection() {
  const featuredCasestudy = {
    logo: '/infinus-new-logo.webp',
    company: 'Infinus',
    tags: 'Hybrid Work Model',
    title: 'Our consultants are available for both onsite and remote work, giving you the flexibility to choose the option that works best for you.',
    subtitle: '',
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Benefits from working with us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the advantages of partnering with Infinus for your SAP implementation and support needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2">

        {/* 1. MAP - Top Left */}
        <div className="relative rounded-none overflow-hidden bg-muted border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-base font-bold text-gray-700 dark:text-gray-300 mb-6">
            <MapPin className="w-4 h-4" />
            European Focus
          </div>
          <h3 className="text-xl font-normal text-gray-900 dark:text-white">
            We are located in Serbia (CET time zone) and provide services throughout Europe.{" "}
            <span className="text-gray-500 dark:text-gray-400">All our consultants are fluent in English and some of them in German as well.</span>
          </h3>

          <div className="relative mt-4">
            <div className="flex justify-center">
              <img 
                src="/benefits-from-working-with-us-images/europe-6.png" 
                alt="Europe map with dots" 
                className="w-full max-w-md h-auto opacity-80"
              />
            </div>
          </div>
        </div>

        {/* ✅ 2. FEATURED CASE STUDY BLOCK - Top Right */}
        <div className="flex flex-col justify-between gap-4 p-6 rounded-none border border-gray-200 dark:border-gray-800 bg-card">
          <div>
            <span className="text-base font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-6">
              <GalleryVerticalEnd className="w-4 h-4" /> {featuredCasestudy.tags}
            </span>
            <h3 className="text-xl font-normal text-gray-900 dark:text-white">
              {featuredCasestudy.title}{" "}
              <span className="text-gray-500 dark:text-gray-400">{featuredCasestudy.subtitle}</span>
            </h3>
          </div>
          <div className="flex justify-center items-center w-full">
            <InfinusFeaturedMessageCard />
          </div>
        </div>

        {/* 3. CHART - Bottom Left */}
        <div className="rounded-none border border-gray-200 dark:border-gray-800 bg-muted p-6">
          <div className="flex items-center gap-2 text-base font-bold text-gray-700 dark:text-gray-300 mb-4">
            <Activity className="w-4 h-4" />
            Competitive Pricing
          </div>
          <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-20">
            By sourcing with us, you get enterprise-grade delivery at an optimized cost.{" "}
            <span className="text-gray-500 dark:text-gray-400"></span>
          </h3>
          <div className="mt-16">
            <MonitoringChart />
          </div>
        </div>

        {/* ✅ 4. ALL FEATURE CARDS - Bottom Right */}
        <div className="grid sm:grid-cols-2 rounded-none bg-card">
          <FeatureCard
            icon={<Files className="w-4 h-4" />}
            title="Flexible Solutions"
            subtitle="We offer flexible engagement models tailored to your unique needs and challenges, whether you need short-term support or long-term solutions."
            description=""
            largeIcon={Layers}
            accent="blue"
            iconPosition="20"
          />
          <FeatureCard
            icon={<Flower className="w-4 h-4" />}
            title="Rapid Time-to-Value"
            subtitle="Fit-to-standard first, then targeted add-ons."
            description=""
            largeIcon={Rocket}
            accent="indigo"
            iconPosition="40"
          />
        </div>
        </div>
      </div>
    </section>
  )
}

// ----------------- Feature Card Component (icon-first, mobile-safe) -------------------
function FeatureCard({
  icon,            // mali icon pored naslova (ostaje)
  title,
  subtitle,
  description,
  largeIcon: LargeIcon, // NOVO: velika ilustracija
  accent = "blue",      // NOVO: boja gradijenta
  iconPosition = "0",   // NOVO: pozicija ikone u procentima od dna
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  largeIcon: React.ComponentType<{ className?: string }>
  accent?: "blue" | "indigo" | "cyan" | "purple"
  iconPosition?: string
}) {
  const accents = {
    blue:   "from-sky-400 to-blue-600",
    indigo: "from-indigo-400 to-indigo-700",
    cyan:   "from-cyan-400 to-blue-500",
    purple: "from-fuchsia-400 to-purple-600",
  } as const

  return (
    <div className="relative flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-800 bg-background">
      {/* Tekstualni blok */}
      <div className="flex-1 min-w-0 pr-20 md:pr-24">
        <span className="text-base font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
          {icon}
          {title}
        </span>
        <h3 className="text-lg font-normal text-gray-900 dark:text-white">
          {subtitle}{" "}
          <span className="text-gray-500 dark:text-gray-400">{description}</span>
        </h3>
      </div>

      {/* Velika ikona u donjem desnom uglu */}
      <div
        aria-hidden="true"
        className="absolute right-3 grid place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-300 
                    w-16 h-16 md:w-20 md:h-20"
        style={{ bottom: `${iconPosition}%` }}
      >
        <LargeIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
      </div>
    </div>
  )
}

// Map component removed - now using custom Europe SVG

// ----------------- Chart -------------------
const chartData = [
  { stage: 'Discovery', market: 82,  infinus: 70 },
  { stage: 'Design',    market: 95,  infinus: 78 },
  { stage: 'Build',     market: 120, infinus: 92 },
  { stage: 'Test',      market: 110, infinus: 88 },
  { stage: 'Go-live',   market: 130, infinus: 98 },
  { stage: 'Hypercare', market: 105, infinus: 85 },
]

const chartConfig = {
  market: {
    label: 'Typical vendor cost',
    color: '#2563eb', // tamnija (bivši "desktop")
  },
  infinus: {
    label: 'Infinus optimized',
    color: '#60a5fa', // svetlija (bivši "mobile")
  },
} satisfies ChartConfig


function MonitoringChart() {
  return (
    <ChartContainer className="h-60 aspect-auto" config={chartConfig}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 0, left: 0, bottom: 8 }} // malo vazduha
      >
        <defs>
          <linearGradient id="fillMarket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--color-market)"  stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-market)"  stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillInfinus" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--color-infinus)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-infinus)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {/* Čitljivija X-osa (faze) */}
        <XAxis
          dataKey="stage"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          height={20}
        />

        <YAxis hide />
        <CartesianGrid vertical={false} horizontal={false} />

        {/* Tooltip: Stage + ušteda u % desno */}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="dark:bg-muted"
              labelFormatter={(label, payload) => {
                const row = payload?.[0]?.payload
                if (!row) return label
                const savings = Math.round(((row.market - row.infinus) / row.market) * 100)
                return (
                  <div className="flex items-center justify-between gap-4">
                    <span>{row.stage}</span>
                    <span className="text-emerald-600 font-medium">Save {savings}%</span>
                  </div>
                )
              }}
              formatter={(value, name, item, index, row) => {
                // Lepše nazive u tooltipu:
                const label =
                  item?.dataKey === 'market' ? 'Typical vendor cost' : 'Infinus optimized'
                // Prikaži indeks kao broj (možeš dodati "index" ako želiš)
                return [value, label]
              }}
            />
          }
        />

        {/* Serije */}
        <Area
          type="monotone"
          dataKey="market"
          stroke="var(--color-market)"
          fill="url(#fillMarket)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Area
          type="monotone"
          dataKey="infinus"
          stroke="var(--color-infinus)"
          fill="url(#fillInfinus)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />

        {/* Legenda sa jasnim labelama */}
        <ChartLegend
          verticalAlign="bottom"
          content={<ChartLegendContent className="pt-2" />}
        />
      </AreaChart>
    </ChartContainer>
  )
}


interface Message {
  title: string;
  time: string;
  content: string;
  color: string;
}

const messages: Message[] = [
    {
      title: "Onsite collaboration",
      time: "",
      content: "Consultants available across EU/UK; security-cleared and NDA-ready.",
      color: "from-pink-400 to-indigo-500",
    },
    {
      title: "Remote delivery",
      time: "",
      content: "Secure VPN access, daily stand-ups, and fully documented changes.",
      color: "from-orange-500 to-pink-500",
    },
    {
      title: "Flexible scheduling",
      time: "",
      content: "CET/UK coverage with optional US overlap; fast handovers when needed.",
      color: "from-yellow-400 to-red-400",
    },
    {
      title: "Seamless switching",
      time: "",
      content: "Start remote and add onsite for key phases - one team, one backlog.",
      color: "from-sky-400 to-blue-700",
    },
  ];

const InfinusFeaturedMessageCard = () => {
  return (
    <div className="w-full max-w-sm h-[280px] bg-white dark:bg-gray-900 p-2 overflow-hidden font-sans relative">
      {/* Fade shadow overlay */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10"></div>
      
      <div className="space-y-2 relative z-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg transform transition duration-300 ease-in-out cursor-pointer animate-scaleUp`}
            style={{
              animationDelay: `${i * 300}ms`,
              animationFillMode: "forwards",
              opacity: 0,
            }}
          >
            <div
              className={`w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-lg bg-gradient-to-br ${msg.color}`}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 dark:text-white">
                {msg.title}
                {msg.time && (
                  <span className="text-xs text-gray-500 before:content-['•'] before:mr-1">
                    {msg.time}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-1">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color,
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip as React.FC<RechartsPrimitive.TooltipProps<any, any>>

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    active?: boolean
    payload?: Array<any>
    label?: React.ReactNode
    labelFormatter?: (label: any, payload: Array<any>) => React.ReactNode
    labelClassName?: string
    formatter?: (value: any, name: any, item: any, index: number, payload: any) => React.ReactNode
    color?: string
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & React.ComponentProps<"div">
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            },
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend as unknown as React.FC<RechartsPrimitive.LegendProps>

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: Array<any>
    verticalAlign?: 'top' | 'middle' | 'bottom'
    hideIcon?: boolean
    nameKey?: string
  }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref,
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className,
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  },
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadObj = payload as Record<string, unknown>
  
  const payloadPayload =
    "payload" in payloadObj &&
    typeof payloadObj.payload === "object" &&
    payloadObj.payload !== null
      ? payloadObj.payload as Record<string, unknown>
      : undefined

  let configLabelKey: string = key

  if (
    key in payloadObj &&
    typeof payloadObj[key] === "string"
  ) {
    configLabelKey = payloadObj[key] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key] as unknown as (typeof config)[keyof typeof config] | undefined
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
