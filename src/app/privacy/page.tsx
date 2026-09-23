import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy — TechOps Wire",
  description: "TechOps Wire privacy policy regarding cookies, analytics, and data retention.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "Privacy Policy", href: "/privacy" }]} />

      <header className="mb-10 space-y-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 inline-block">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Last updated: January 2026
        </p>
      </header>

      <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-200 pt-8">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Information We Collect</h2>
          <p>
            TechOps Wire operates as an open technical publication. We do not require registration or personal accounts to read articles, tutorials, or architecture comparisons.
          </p>
          <p>
            When you optionally subscribe to technical dispatches or contact our editorial staff via email, we collect only the email address and communication details you provide voluntarily.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Analytics &amp; Cookies</h2>
          <p>
            We use standard server logs and privacy-preserving analytics to measure page views, popular technical topics, and referral paths. We do not sell user data to advertising brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">External Links</h2>
          <p>
            Our articles contain references to external official documentation (such as AWS, Microsoft, and open-source project repositories). We are not responsible for the privacy practices of external third-party sites.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Contact</h2>
          <p>
            For questions regarding privacy practices, please contact us at{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 hover:underline">
              {siteConfig.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
