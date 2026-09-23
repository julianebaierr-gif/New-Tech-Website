import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Editorial Staff — SysOps Journal",
  description: "Get in touch with the editorial team at SysOps Journal for technical corrections, feedback, and enterprise inquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "Contact", href: "/contact" }]} />

      <header className="mb-8 space-y-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block">
          Contact
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Editorial Desk
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Reach our engineers regarding errata, benchmark verification, or technical feedback.
        </p>
      </header>

      <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 block">General Inquiries & Errata</label>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors font-mono"
          >
            {siteConfig.contactEmail}
          </a>
          <p className="text-xs text-slate-500">
            Average response time for verified technical corrections: &lt; 24 hours.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-2 text-xs text-slate-500 leading-relaxed">
          <h4 className="font-semibold text-slate-800">Editorial Submissions &amp; Errata:</h4>
          <p>
            We welcome technical feedback, corrections, and article suggestions from practicing systems engineers and cloud architects.
          </p>
        </div>
      </div>
    </div>
  );
}
