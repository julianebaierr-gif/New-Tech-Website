import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "How We Write and Test Our Guides — TechOps Wire",
  description: "Learn how we test code on real systems, keep tutorials up to date, and handle reader corrections.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "Editorial Standards", href: "/editorial-policy" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Editorial Standards &amp; Testing
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          How We Write and Test Our Guides
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          A clear breakdown of how we test tutorials on real machines, verify commands, and keep our guides accurate.
        </p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Tested Before Publishing
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every terminal command, script, and Excel formula is executed on real machines (clean Windows 11 installs, Ubuntu servers, or AWS instances). If a command requires root access or can overwrite files, we state it clearly.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Straightforward Steps
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We focus on solving common problems quickly: removing duplicate rows without breaking formulas, choosing the right server size to save money, and fixing permission errors without creating security risks.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              No Sponsored Bias or Paid Links
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We do not accept payment to rank tools higher or include commercial backlinks. Links to external sites go directly to official documentation, open-source repositories, or trusted standards manuals.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Kept Up to Date
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Software evolves. When an operating system update changes a command or an app updates its interface, we revise our guides and note the last updated date directly at the top of the article.
            </p>
          </div>
        </div>

        {/* Contact Desk for Corrections */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Spotted an Error or Changed Setting?</h3>
            <p className="text-xs text-slate-500">
              Let us know and our team will test the fix and update the guide promptly.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 text-center"
          >
            Suggest a Correction →
          </Link>
        </div>
      </div>
    </div>
  );
}
