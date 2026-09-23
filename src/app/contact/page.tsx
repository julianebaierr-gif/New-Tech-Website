import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Editorial Staff — SysOps Journal",
  description: "Get in touch with the editorial team at SysOps Journal for technical corrections, feedback, and enterprise inquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Contact", href: "/contact" }]} />

      <header className="mb-10 space-y-3">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block">
          Direct Line
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact Editorial Desk
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Reach our engineers regarding errata, benchmark verification, or technical feedback.
        </p>
      </header>

      <div className="p-8 rounded-2xl border border-slate-800 bg-surface/70 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-300 block">General Inquiries & Errata</label>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors font-mono"
          >
            {siteConfig.contactEmail}
          </a>
          <p className="text-xs text-slate-500">
            Average response time for verified technical corrections: &lt; 24 hours.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-800/80 space-y-3 text-xs text-slate-400 leading-relaxed">
          <h4 className="font-semibold text-slate-200">Note to PR & Link Builders:</h4>
          <p>
            SysOps Journal does not sell dofollow links, participate in link exchanges, or accept mass-generated guest articles. Unsolicited commercial link requests will be marked as spam.
          </p>
        </div>
      </div>
    </div>
  );
}
