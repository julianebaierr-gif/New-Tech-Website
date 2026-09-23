import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

export const metadata: Metadata = {
  title: "Contact Our Editorial Desk — TechOps Wire",
  description: "Get in touch with the editorial team at TechOps Wire for tutorial corrections, technical suggestions, or licensing inquiries.",
  alternates: {
    canonical: `${siteConfig.baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact Our Editorial Desk — TechOps Wire",
    description: "Get in touch with the editorial team at TechOps Wire for tutorial corrections, technical suggestions, or licensing inquiries.",
    url: `${siteConfig.baseUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Our Editorial Desk — TechOps Wire",
    description: "Get in touch with the editorial team at TechOps Wire for tutorial corrections, technical suggestions, or licensing inquiries.",
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact TechOps Wire",
    "url": `${siteConfig.baseUrl}/contact`,
    "description": "Editorial contact channels, corrections desk, and feedback instructions for TechOps Wire.",
    "mainEntity": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.baseUrl,
      "contactPoint": {
        "@type": "ContactPoint",
        "email": siteConfig.contactEmail,
        "contactType": "editorial inquiries and reader corrections",
        "availableLanguage": ["English"],
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SchemaJsonLd schema={contactSchema} />
      <Breadcrumbs crumbs={[{ label: "Contact", href: "/contact" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Editorial Desk &amp; Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact Us
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          Have feedback on a tutorial, spotted an updated command flag, or want to suggest a new systems engineering topic? Our editorial staff welcomes direct communication.
        </p>
      </header>

      <div className="space-y-10">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editorial Inquiries */}
          <div className="p-7 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Primary Editorial Inbox
              </span>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors font-mono block"
              >
                {siteConfig.contactEmail}
              </a>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct channel to our editorial review desk. Use this email address for corrections, technical feedback, tutorial suggestions, and licensing questions.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Response Commitment:</p>
              <p>We review and respond to reader communications within 24 business hours.</p>
            </div>
          </div>

          {/* How to Report an Error */}
          <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Quality Assurance
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Reporting a Command or Setting Change
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                When software providers update tools or cloud interfaces, syntax can change. To help us reproduce and fix issues quickly, please include:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1 pt-1">
                <li>The specific article URL.</li>
                <li>Your operating system version or cloud provider region.</li>
                <li>The exact error message or terminal output received.</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              <Link href="/editorial-policy" className="text-blue-600 font-semibold hover:underline">
                Read our full Testing &amp; Revision Policy →
              </Link>
            </div>
          </div>
        </div>

        {/* Focus Areas & Submission Guidance */}
        <section className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Topics We Welcome Reader Questions About
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our editorial staff prioritizes answering practical, hands-on technical questions that help systems engineers, developers, and data workers:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
              <h3 className="font-bold text-slate-900">Cloud &amp; Containers</h3>
              <p className="text-slate-600">AWS instance selection, Docker Compose health checks, Linux systemd services, and networking bugs.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
              <h3 className="font-bold text-slate-900">Spreadsheets &amp; Data</h3>
              <p className="text-slate-600">Formula debugging (XLOOKUP, FILTER, UNIQUE), data deduplication workflows, and validation lists.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
              <h3 className="font-bold text-slate-900">Operating Systems</h3>
              <p className="text-slate-600">Windows 11 Pro virtualization settings, BitLocker recovery, Linux file permissions, and server end-of-life migrations.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
