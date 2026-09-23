import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Editorial & Fact-Checking Policy — SysOps Journal",
  description: "Our technical review process, live environment benchmarking methodology, and zero-compromise link integrity standards.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "Editorial Standards", href: "/editorial-policy" }]} />

      <header className="mb-10 space-y-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
          Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Editorial & Verification Standards
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          How SysOps Journal verifies code, tests configurations, and maintains link integrity.
        </p>
      </header>

      <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-200 pt-8">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">1. Hands-on Verification</h2>
          <p>
            Tutorials and commands published on SysOps Journal are tested in isolated environments (Ubuntu, Debian, or AWS) before release. We verify that commands produce expected outcomes and document edge cases.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">2. Original Technical Value</h2>
          <p>
            We prioritize tutorials with practical depth: clear CLI commands, configuration benchmarks, and troubleshooting warnings that save engineering hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">3. Independent Editorial Integrity</h2>
          <p>
            SysOps Journal does not sell paid links or publish undisclosed sponsored content. External links exist solely to cite official documentation (AWS documentation, RFC specifications, Python PEPs).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">4. Errata & Updates</h2>
          <p>
            Operating systems and cloud interfaces evolve. When tools or flags change, articles are updated and tagged with a &quot;Last Updated&quot; date to keep readers current.
          </p>
        </section>
      </div>
    </div>
  );
}
