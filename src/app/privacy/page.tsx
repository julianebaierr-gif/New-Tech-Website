import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

export const metadata: Metadata = {
  title: "Privacy Policy | TechOps Wire",
  description: "TechOps Wire privacy policy regarding server logs, cookies, third-party analytics, user rights, and data protection.",
  alternates: {
    canonical: `${siteConfig.baseUrl}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | TechOps Wire",
    description: "TechOps Wire privacy policy regarding server logs, cookies, third-party analytics, user rights, and data protection.",
    url: `${siteConfig.baseUrl}/privacy`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | TechOps Wire",
    description: "TechOps Wire privacy policy regarding server logs, cookies, third-party analytics, user rights, and data protection.",
  },
};

export default function PrivacyPage() {
  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy | TechOps Wire",
    "url": `${siteConfig.baseUrl}/privacy`,
    "description": "TechOps Wire privacy, cookies, and data protection disclosures.",
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.baseUrl,
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SchemaJsonLd schema={privacySchema} />
      <Breadcrumbs crumbs={[{ label: "Privacy Policy", href: "/privacy" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Legal &amp; Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          Effective Date: September 24, 2026. This policy explains what information is collected when you visit TechOps Wire and how that data is protected.
        </p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* 1. Log Files */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            1. Server Logs and Network Data
          </h2>
          <p>
            Like most websites, TechOps Wire follows standard procedures for utilizing log files. When visitors access our tutorials, our web servers automatically log certain non-personally identifiable information.
          </p>
          <p>
            This information includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and the number of clicks. These logs are used solely to analyze web traffic patterns, administer the site, prevent denial-of-service attacks, and ensure reliable server uptime. This data is not linked to any personally identifiable information.
          </p>
        </section>

        {/* 2. Cookies and Web Beacons */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            2. Cookies and Web Beacons
          </h2>
          <p>
            TechOps Wire uses cookies to store information about visitors&apos; preferences and to record user-specific information on which pages the visitor accesses. This helps us optimize our website content and improve site performance.
          </p>
          <p>
            Third-party vendors, including advertising networks or analytics providers, may also use cookies, JavaScript, or Web Beacons in their respective technologies. You can choose to disable cookies through your individual browser settings. Detailed information about cookie management with specific web browsers can be found at the browsers&apos; respective websites.
          </p>
        </section>

        {/* 3. Direct Communications */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            3. Direct Communications and Submissions
          </h2>
          <p>
            TechOps Wire does not require user registration, passwords, or personal profile creation to read our articles.
          </p>
          <p>
            If you voluntarily contact our editorial staff via email or submit a tutorial correction, we collect your email address and the content of your message to respond to your inquiry. We do not sell, rent, or lease your email address or contact details to third-party marketing brokers under any circumstances.
          </p>
        </section>

        {/* 4. External Documentation Links */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            4. External Documentation Links
          </h2>
          <p>
            Our tutorials regularly cite and link to primary source documentation, such as Microsoft Docs, Amazon Web Services Documentation, Linux man pages, and GitHub source code repositories.
          </p>
          <p>
            Please note that TechOps Wire has no control over the privacy practices or content of these external third-party sites. We encourage readers to review the privacy policies of any external website they visit through our outbound reference links.
          </p>
        </section>

        {/* 5. User Privacy Rights */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            5. User Privacy Rights (GDPR &amp; CCPA Compliance)
          </h2>
          <p>
            We respect the privacy rights of all readers across international jurisdictions:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Right to Access:</strong> You have the right to request copies of any personal correspondence or data we hold associated with your email address.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You have the right to request correction of any inaccurate information.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You have the right to request that we delete any voluntary email communications or records we retain.
            </li>
            <li>
              <strong>Right to Non-Discrimination:</strong> We do not discriminate against any user for exercising their privacy rights.
            </li>
          </ul>
        </section>

        {/* 6. Contact Information */}
        <section className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            6. Privacy Inquiries and Requests
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            If you have questions about our privacy policy or wish to exercise your data protection rights, please contact our data team at:
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-sm font-bold text-blue-600 font-mono hover:underline block pt-1"
          >
            {siteConfig.contactEmail}
          </a>
        </section>
      </div>
    </div>
  );
}
