import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Editorial & Fact-Checking Policy — TechOps Wire",
  description: "Our technical review process, live environment benchmarking methodology, and zero-compromise link integrity standards.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "Editorial Standards", href: "/editorial-policy" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Governance &amp; Verification
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Editorial &amp; Verification Standards
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          How TechOps Wire verifies code, tests server configurations, and maintains editorial independence.
        </p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Hands-on Sandbox Verification
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every command, CLI flag, and script published on TechOps Wire is tested in clean cloud environments (Ubuntu LTS, Debian, or AWS EC2) before editorial approval. We verify exit codes, error outputs, and rollback steps.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Practical Value &amp; Depth
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We prioritize tutorials that solve real engineering bottlenecks: non-destructive data cleaning, memory-to-vCPU allocation formulas, and security compliance configurations that save hours of engineering time.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Strict Link Integrity
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              TechOps Wire does not sell paid dofollow links or accept commercial guest placements. Outbound citations exist exclusively to reference authoritative technical documentation (RFC standards, official AWS/Microsoft manuals, Python PEPs).
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Errata &amp; Continuous Maintenance
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              When operating systems deprecate flags or cloud providers update their CLI syntax, guides are promptly audited. Any modified content is marked with a clear &quot;Last Updated&quot; date for transparency.
            </p>
          </div>
        </div>

        {/* Contact Desk for Errata */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Found a Bug or Outdated Flag?</h3>
            <p className="text-xs text-slate-500">
              Submit corrections directly to our editorial engineering team.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 text-center"
          >
            Submit Technical Errata →
          </Link>
        </div>
      </div>
    </div>
  );
}
