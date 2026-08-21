import type { ProjectPulseBrochureDictionary } from "@/content/dictionary";

/**
 * The ProjectPulse brochure body, shared by /projectpulse/brochure and
 * /sr/projectpulse/brochure.
 *
 * The markup and section order are exactly what
 * app/(en)/(site)/projectpulse/brochure/page.tsx rendered at commit f143256, with the
 * inline literals replaced by lookups on `content`. That page had no config file — every
 * string sat in the JSX — which is why extraction produced a long dictionary namespace.
 *
 * Two things kept as they were rather than tidied:
 *   · the copyright line still interpolates the CURRENT YEAR at build time, and the year is
 *     followed by `copyrightSuffix` in a single template literal so the rendered text nodes
 *     stay grouped exactly as before;
 *   · the closing CTA button still has no click handler. It did nothing before this phase
 *     and does nothing now; wiring it up is a product decision, not a translation one.
 *
 * A server component: it reads no request state, so both routes stay statically prerendered.
 */
export interface ProjectPulseBrochurePageProps {
  content: ProjectPulseBrochureDictionary;
}

export function ProjectPulseBrochurePage({ content }: ProjectPulseBrochurePageProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top ribbon */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-800 bg-slate-900/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-300">
          <span>{content.ribbon.left}</span>
          <span>{content.ribbon.right}</span>
        </div>

        {/* Hero */}
        <section className="mb-16 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                {content.hero.kicker}
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
                {content.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300">
                {content.hero.body}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1">
                  {content.hero.pills[0]}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                  {content.hero.pills[1]}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                  {content.hero.pills[2]}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative mx-auto mt-6 max-w-md rounded-3xl border border-emerald-400/30 bg-slate-950/80 p-4 shadow-[0_0_60px_rgba(16,185,129,0.25)] lg:mt-0">
                <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{content.dashboard.title}</span>
                  <span>{content.dashboard.subtitle}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="font-medium text-slate-200">{content.dashboard.portfolio.title}</p>
                    <p className="text-slate-400">
                      {content.dashboard.portfolio.body}
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                      <div className="h-1.5 w-4/5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="font-medium text-slate-200">{content.dashboard.utilization.title}</p>
                    <p className="text-slate-400">
                      {content.dashboard.utilization.body}
                    </p>
                    <div className="mt-2 flex items-end gap-1">
                      <div className="h-6 flex-1 rounded-sm bg-emerald-500/80" />
                      <div className="h-9 flex-1 rounded-sm bg-emerald-400/70" />
                      <div className="h-4 flex-1 rounded-sm bg-emerald-300/60" />
                      <div className="h-8 flex-1 rounded-sm bg-emerald-500/90" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="font-medium text-slate-200">{content.dashboard.cash.title}</p>
                    <p className="text-slate-400">
                      {content.dashboard.cash.body}
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-slate-300">
                      {content.dashboard.kpis.map((kpi) => (
                        <div key={kpi.label} className="rounded-md bg-slate-950/70 px-2 py-1">
                          <p className="text-slate-400">{kpi.label}</p>
                          <p className="font-semibold text-emerald-300">{kpi.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[10px] text-slate-500">
                  {content.dashboard.poweredBy}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Challenges */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {content.challenges.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            {content.challenges.intro}
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {content.challenges.items.map((item) => (
              <div key={item.kicker} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {item.kicker}
                </p>
                <h3 className="mt-3 text-sm font-semibold text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Business value by role */}
        <section className="mb-16 border border-slate-800 bg-slate-900/60 p-6 lg:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {content.byRole.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            {content.byRole.intro}
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {content.byRole.roles.map((role) => (
              <div key={role.kicker} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {role.kicker}
                </p>
                <h3 className="mt-3 text-sm font-semibold text-slate-50">
                  {role.title}
                </h3>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Key benefits */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {content.benefits.heading}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {content.benefits.items.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-emerald-400/90" />
                <p className="text-xs text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Functional scope */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {content.scope.heading}
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            {content.scope.intro}
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {content.scope.groups.map((group) => (
              <div key={group.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                  {group.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-emerald-400/50 bg-emerald-400/5 p-5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">{content.scope.optional.title}</p>
            <p className="mt-2 text-slate-300">
              {content.scope.optional.body}
            </p>
          </div>
        </section>

        {/* Time & cost + Why Infinus */}
        <section className="mb-16 border border-slate-800 bg-slate-900/70 p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                {content.commercial.heading}
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                {content.commercial.intro}
              </p>
              <div className="mt-5 grid gap-3 text-xs text-slate-200">
                {content.commercial.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-xl bg-slate-950/80 px-4 py-3">
                    <span className="text-slate-400">{row.label}</span>
                    <span className="font-semibold text-emerald-300">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                {content.commercial.footnote}
              </p>
            </div>
            <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-xs text-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {content.whyInfinus.kicker}
              </p>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                {content.whyInfinus.title}
              </h3>
              <ul className="mt-3 space-y-1.5 text-slate-300">
                {content.whyInfinus.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] text-slate-400">
                {content.whyInfinus.footnote}
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mb-8">
          <div className="rounded-3xl border border-emerald-400/40 bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-950 px-6 py-7 lg:px-8 lg:py-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  {content.cta.kicker}
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-50">
                  {content.cta.heading}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200">
                  {content.cta.body}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 text-sm">
                <button className="w-full rounded-full bg-emerald-400 px-5 py-2.5 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-300 lg:w-auto">
                  {content.cta.button}
                </button>
                <p className="text-[11px] text-slate-200">
                  {content.cta.emailPrefix}{" "}
                  <a
                    href={`mailto:${content.cta.emailAddress}`}
                    className="font-semibold text-emerald-200 underline-offset-2 hover:underline"
                  >
                    {content.cta.emailAddress}
                  </a>{" "}
                  {content.cta.emailSuffix}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            © {new Date().getFullYear()}{` ${content.copyrightSuffix}`}
          </p>
        </section>
      </div>
    </main>
  );
}
