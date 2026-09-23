import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Us — TechOps Wire",
  description: "Get in touch with the editorial team at TechOps Wire for corrections, tutorial feedback, or general questions.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "Contact", href: "/contact" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact Us
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          Have a question about a tutorial, spotted a command that needs updating, or want to suggest a topic? We would love to hear from you.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Box */}
        <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Email Us Directly
            </span>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors font-mono block"
            >
              {siteConfig.contactEmail}
            </a>
            <p className="text-xs text-slate-600 leading-relaxed">
              We check our inbox every business day. If you are reporting a broken link or a command syntax change, please include the article URL so we can test and update it quickly.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>Typical reply time: Within 24 hours</span>
          </div>
        </div>

        {/* Editorial Submissions */}
        <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Contribute &amp; Feedback
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Share a Tutorial or Fix
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you a developer, systems administrator, or data specialist with a practical workaround or setup guide that solved a tough problem? We welcome reader contributions and guest tips.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            <span>Direct engineer-to-engineer communication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
