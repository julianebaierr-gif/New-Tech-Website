import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Use — TechOps Wire",
  description: "Terms of use and disclaimer for tutorials and code examples on TechOps Wire.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "Terms of Use", href: "/terms" }]} />

      <header className="mb-10 space-y-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 inline-block">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Use
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Last updated: January 2026
        </p>
      </header>

      <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-200 pt-8">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Technical Disclaimer</h2>
          <p>
            Tutorials, code snippets, and architecture configurations provided on TechOps Wire are intended for educational and reference purposes. Readers are advised to test scripts and configurations in staging or isolated test environments before applying them to production systems.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Intellectual Property</h2>
          <p>
            The original editorial content, illustrations, and analytical comparisons published on TechOps Wire are protected by copyright. Code snippets within tutorials are provided under standard open permissive terms for engineering use.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Contact</h2>
          <p>
            For terms inquiries or licensing requests, please contact us at{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 hover:underline">
              {siteConfig.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
