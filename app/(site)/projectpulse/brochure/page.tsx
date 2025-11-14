import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProjectPulse Brochure | Infinus – SAP Qualified Partner-Packaged Solution",
  description:
    "ProjectPulse is a SAP Qualified Partner-Packaged Solution by Infinus for Professional Services firms, unifying finance, projects, sales, procurement, HR and analytics on a single intelligent cloud platform.",
};

const ProjectPulseBrochurePage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
        {/* Top ribbon */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-800 bg-slate-900/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-300">
          <span>Infinus · SAP Gold Partner</span>
          <span>ProjectPulse · SAP Qualified Partner-Packaged Solution</span>
        </div>

        {/* Hero */}
        <section className="mb-16 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                For Professional Services firms
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
                ProjectPulse: Run projects, people, and profit on one intelligent cloud platform.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300">
                ProjectPulse is a SAP Qualified Partner-Packaged Solution by Infinus designed for
                Professional Services companies. It unifies finance, project &amp; resource
                management, sales, procurement and core HR – augmented by SAP embedded analytics and
                SAP Business AI – to automate the end-to-end flow from opportunity/quote to invoice
                and period-end close.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1">
                  3–6 month implementation
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                  500+ prebuilt KPIs &amp; dashboards
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
                  SAP Business AI &amp; embedded analytics
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative mx-auto mt-6 max-w-md rounded-3xl border border-emerald-400/30 bg-slate-950/80 p-4 shadow-[0_0_60px_rgba(16,185,129,0.25)] lg:mt-0">
                <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Executive Command Center</span>
                  <span>Live KPIs · AI Insights</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="font-medium text-slate-200">Project Portfolio Health</p>
                    <p className="text-slate-400">
                      Margin, WIP, and billing readiness across all active engagements.
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                      <div className="h-1.5 w-4/5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="font-medium text-slate-200">Utilization &amp; Capacity</p>
                    <p className="text-slate-400">
                      Plan vs. actual billable hours by role, region, and skill.
                    </p>
                    <div className="mt-2 flex items-end gap-1">
                      <div className="h-6 flex-1 rounded-sm bg-emerald-500/80" />
                      <div className="h-9 flex-1 rounded-sm bg-emerald-400/70" />
                      <div className="h-4 flex-1 rounded-sm bg-emerald-300/60" />
                      <div className="h-8 flex-1 rounded-sm bg-emerald-500/90" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="font-medium text-slate-200">Cash &amp; Working Capital</p>
                    <p className="text-slate-400">
                      DSO, DPO, cash flow, and liquidity projections in one view.
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-slate-300">
                      <div className="rounded-md bg-slate-950/70 px-2 py-1">
                        <p className="text-slate-400">DSO</p>
                        <p className="font-semibold text-emerald-300">42 days</p>
                      </div>
                      <div className="rounded-md bg-slate-950/70 px-2 py-1">
                        <p className="text-slate-400">Utilization</p>
                        <p className="font-semibold text-emerald-300">82%</p>
                      </div>
                      <div className="rounded-md bg-slate-950/70 px-2 py-1">
                        <p className="text-slate-400">Gross margin</p>
                        <p className="font-semibold text-emerald-300">31%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[10px] text-slate-500">
                  Powered by SAP S/4HANA Cloud, SAP SuccessFactors, SAP Integration Suite, SAP
                  Document &amp; Reporting Compliance, Embedded Analytics and SAP Business AI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Challenges */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Why Professional Services firms need ProjectPulse
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            It unifies finance, project &amp; resource management, sales, procurement and core HR –
            augmented by SAP embedded analytics and SAP Business AI – to automate the end-to-end
            flow from opportunity/quote to invoice and period-end close.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Challenge · Projects
              </p>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                Limited real-time visibility
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                No single place to see scope, milestones, staffing, costs, and billing readiness for
                each engagement.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Challenge · Finance
              </p>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                Complex revenue &amp; cash
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                Revenue recognition, WIP and margins scattered across spreadsheets and tools – close
                is slow and reactive.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Challenge · People
              </p>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                Underutilized or overloaded teams
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                No shared view of availability, skills, and demand – making it hard to optimize
                utilization and avoid burnout.
              </p>
            </div>
          </div>
        </section>

        {/* Business value by role */}
        <section className="mb-16 border border-slate-800 bg-slate-900/60 p-6 lg:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Business value by role
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Executives gain real-time visibility into profitability, cash, and utilization, while
            delivery teams get control of scope, milestones, staffing and billing readiness.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                CEO
              </p>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                One cloud backbone for growth
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Unified platform for finance, projects, HR, sales, and procurement.</li>
                <li>• Real-time profitability by customer, region, and service line.</li>
                <li>• Standardized operating model for scale-up and M&amp;A.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                CFO
              </p>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                Continuous close &amp; predictable margins
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Event-based revenue recognition for fixed price and T&amp;M projects.</li>
                <li>• Real-time WIP, DSO, cash, and margin analytics.</li>
                <li>• IFRS-compliant accounting, consolidation, and group reporting.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                COO / Delivery
              </p>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                Real-time control of projects &amp; resources
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Scope, milestones, staffing, and billing readiness in one place.</li>
                <li>• Utilization and capacity planning by role, region, and skill.</li>
                <li>• Less manual reconciliation across project tools and spreadsheets.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key benefits */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Key benefits at a glance
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Real-time visibility into project performance and profitability.",
              "End-to-end automation from opportunity / quote to invoice and close.",
              "Embedded SAP analytics and 500+ prebuilt KPIs, dashboards and overview pages.",
              "Unified project, finance, sales, procurement and core HR in one cloud platform.",
              "AI-augmented decision making with SAP Business AI and Joule Copilot.",
              "Mobile-enabled access for project teams and executives on the go.",
            ].map((item) => (
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
            Functional scope
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            The base scope covers Finance (AR/AP, closing, treasury, profitability, consolidation),
            Customer Projects &amp; Billing, Sourcing &amp; Procurement, Sales of Services,
            SuccessFactors Employee Central, Integration Suite, DRC localizations, and embedded
            analytics.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Finance
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Accounts Receivable / Payable and bank reconciliation.</li>
                <li>• Financial closing, consolidation and group reporting.</li>
                <li>• Treasury and cash management.</li>
                <li>• Profitability and cost analysis across dimensions.</li>
                <li>• Event-based revenue recognition &amp; WIP tracking.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Customer Projects &amp; Billing
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Project structuring, planning and control.</li>
                <li>• Milestones, budgets, actuals and change orders.</li>
                <li>• Resource management and staffing by skills.</li>
                <li>• Time and expense capture and approvals.</li>
                <li>• Fixed price and T&amp;M billing scenarios.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Sourcing, Procurement &amp; Sales
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Service procurement and subcontracting.</li>
                <li>• Purchase requisitions and purchase orders.</li>
                <li>• Sales of services, quotes and orders.</li>
                <li>• Margin and profitability by customer &amp; engagement.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Core HR &amp; Analytics
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Employee master data and org structure.</li>
                <li>• Work schedules, time off and basic time recording.</li>
                <li>• Embedded analytics and role-based overview pages.</li>
                <li>• SAP Business AI Joule Copilot on top of operational data.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-emerald-400/50 bg-emerald-400/5 p-5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">Optional extensions</p>
            <p className="mt-2 text-slate-300">
              Optional extensions such as SAP Sales Cloud and additional SAP SuccessFactors modules
              (Performance &amp; Goals, Compensation, Learning, Career &amp; Talent, Recruiting /
              Onboarding) can be added as your Professional Services business scales up.
            </p>
          </div>
        </section>

        {/* Time & cost + Why Infinus */}
        <section className="mb-16 border border-slate-800 bg-slate-900/70 p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Time-to-value and commercial model
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                A prescriptive 3–6-month implementation accelerates time-to-value, with a clearly
                defined base scope and extensions.
              </p>
              <div className="mt-5 grid gap-3 text-xs text-slate-200">
                <div className="flex items-center justify-between rounded-xl bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">Project duration</span>
                  <span className="font-semibold text-emerald-300">3–6 months</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">Cloud subscriptions (from)</span>
                  <span className="font-semibold text-emerald-300">€9,000 / month</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-950/80 px-4 py-3">
                  <span className="text-slate-400">Implementation services (from)</span>
                  <span className="font-semibold text-emerald-300">from EUR 100,000</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Exact scope, entities, localizations and optional extensions are confirmed during
                discovery and reflected in the final fixed-price proposal.
              </p>
            </div>
            <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-xs text-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Why Infinus
              </p>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                SAP Gold Partner for Professional Services
              </h3>
              <ul className="mt-3 space-y-1.5 text-slate-300">
                <li>• SAP Gold Partner with proven SAP Cloud ERP expertise.</li>
                <li>• 30+ consultants focused on Professional Services business models.</li>
                <li>• 20+ SAP Cloud ERP customers implemented and supported.</li>
                <li>• Recognized as SAP Top Cloud Performer in the region.</li>
              </ul>
              <p className="mt-4 text-[11px] text-slate-400">
                Net result: real-time projects, aligned resources, and predictable margins on a
                single intelligent cloud platform.
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
                  Next step
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-50">
                  Real-time projects. Aligned resources. Predictable margins.
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200">
                  Talk to Infinus about ProjectPulse and see how a SAP Qualified Partner-Packaged
                  Solution can modernize your Professional Services operations in months, not years.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 text-sm">
                <button className="w-full rounded-full bg-emerald-400 px-5 py-2.5 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-300 lg:w-auto">
                  Schedule a ProjectPulse exploration call
                </button>
                <p className="text-[11px] text-slate-200">
                  Or email{" "}
                  <a
                    href="mailto:dejan@infinus.co"
                    className="font-semibold text-emerald-200 underline-offset-2 hover:underline"
                  >
                    dejan@infinus.co
                  </a>{" "}
                  to request the full brochure and video.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            © {new Date().getFullYear()} Infinus d.o.o. ProjectPulse is a SAP Qualified
            Partner-Packaged Solution for Professional Services companies.
          </p>
        </section>
      </div>
    </main>
  );
};

export default ProjectPulseBrochurePage;

