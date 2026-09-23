import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Editorial & Fact-Checking Policy — SysOps Journal",
  description: "Our technical review process, live environment benchmarking methodology, and zero-compromise link integrity standards.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Editorial Standards", href: "/editorial-policy" }]} />

      <header className="mb-12 space-y-4">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
          Governance & Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Editorial & Verification Standards
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          How SysOps Journal audits code, benchmarks cloud instances, and guarantees 100% technical accuracy.
        </p>
      </header>

      <div className="space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base border-t border-slate-800 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Peer Review & Staging Sandbox Testing</h2>
          <p>
            No technical tutorial or terminal snippet is published on SysOps Journal without reproduction inside an isolated, containerized environment (Ubuntu 24.04 LTS, Debian 12, or AWS EC2). Submissions must include full command execution logs and expected error states.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Information Gain Requirement</h2>
          <p>
            We strictly reject rehashed or generic overview articles. Every published piece must contribute net-new technical value:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Original architectural diagrams or reproducible CLI commands.</li>
            <li>Real-world benchmarks (latency percentiles p95/p99, RAM consumption).</li>
            <li>Production warnings highlighting edge cases, memory leaks, and breaking changes.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">3. Independence & Outbound Link Integrity</h2>
          <p>
            SysOps Journal does not accept unsolicited paid links, commercial review compensation, or automated promotional guest post submissions. External links are curated exclusively by our editorial staff to cite primary documentation (e.g., official AWS docs, Python PEPs, IETF RFC standards).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">4. Correction & Revision Policy</h2>
          <p>
            As cloud APIs and operating systems update, configurations can deprecate. Each guide carries a public "Last Verified" date. If a community member spots a broken command or deprecated flag, our editorial team audits and patches the article within 48 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
