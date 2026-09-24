import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

export const metadata: Metadata = {
  title: {
    absolute: "Terms of Service and Reader Agreement | TechOps Wire",
  },
  description: "Read our terms of service, acceptable use rules, and licensing policies for code snippets, configuration files, and software tutorials on this website.",
  alternates: {
    canonical: `${siteConfig.baseUrl}/terms`,
  },
  openGraph: {
    title: "Terms of Service and Reader Agreement | TechOps Wire",
    description: "Read our terms of service, acceptable use rules, and licensing policies for code snippets, configuration files, and software tutorials on this website.",
    url: `${siteConfig.baseUrl}/terms`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service and Reader Agreement | TechOps Wire",
    description: "Read our terms of service, acceptable use rules, and licensing policies for code snippets, configuration files, and software tutorials on this website.",
  },
};

export default function TermsPage() {
  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Use | TechOps Wire",
    "url": `${siteConfig.baseUrl}/terms`,
    "description": "Terms of use, code licenses, and disclaimers for TechOps Wire.",
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.baseUrl,
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SchemaJsonLd schema={termsSchema} />
      <Breadcrumbs crumbs={[{ label: "Terms of Use", href: "/terms" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Terms of Use
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          Last revised: September 24, 2026. Please review these terms governing the use of tutorials, code snippets, and system documentation on TechOps Wire.
        </p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            1. Acceptance of Terms &amp; Educational Purpose
          </h2>
          <p>
            By accessing or reading TechOps Wire, you agree to comply with and be bound by these Terms of Use. All content published on TechOps Wire (including tutorials, configuration snippets, spreadsheet formulas, and infrastructure comparisons) is provided strictly for educational and informational purposes.
          </p>
        </section>

        {/* 2. Code Snippets License */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            2. Permissive Code Snippet Usage
          </h2>
          <p>
            Unless explicitly noted otherwise, all individual shell scripts, command-line snippets, Docker Compose templates, and spreadsheet formulas presented within our articles are made available under permissive terms.
          </p>
          <p>
            You are free to adapt, incorporate, and execute these code snippets within your personal or commercial software projects and server environments without paying royalties or requiring prior written permission.
          </p>
        </section>

        {/* 3. Disclaimer of Liability */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            3. Disclaimer of Warranties and Liability
          </h2>
          <p>
            While our editorial staff rigorously tests every tutorial in clean lab environments before publication, operating system configurations, software versions, and cloud provider settings vary widely across individual machines.
          </p>
          <p>
            TechOps Wire provides all materials on an &quot;as is&quot; basis without warranties of any kind, whether express or implied. Under no circumstances will TechOps Wire, its authors, or its publishers be liable for any direct, indirect, incidental, or consequential damages resulting from the execution of commands, loss of data, hardware malfunction, or system downtime.
          </p>
          <p className="font-semibold text-slate-900">
            You are strongly advised to test all commands, scripts, and registry or configuration modifications in an isolated staging or test environment with active backups before applying them to mission-critical production systems.
          </p>
        </section>

        {/* 4. Intellectual Property & Editorial Copyright */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            4. Editorial Copyright &amp; Prohibited Scraping
          </h2>
          <p>
            The original explanatory prose, article structure, analytical comparisons, and editorial tutorials published on TechOps Wire are protected under international copyright law.
          </p>
          <p>
            You may not republish, syndicate, mirror, or bulk-scrape our full article texts or tutorials on other websites or publications without explicit prior written authorization from TechOps Wire. Brief quotations with clear attribution and a direct link to the original article are permitted.
          </p>
        </section>

        {/* 5. Nominative Trademark Fair Use */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            5. Trademark Fair Use Disclosures
          </h2>
          <p>
            Amazon Web Services (AWS), Microsoft, Windows, Excel, Linux, Docker, OpenAI, ChatGPT, and all other third-party product names, logos, and brands mentioned on this website are trademarks or registered trademarks of their respective owners.
          </p>
          <p>
            Their use on TechOps Wire is strictly nominative and for identification and informational purposes only. Such use does not imply any affiliation with, endorsement by, or sponsorship from the respective trademark holders.
          </p>
        </section>

        {/* 6. Contact Desk */}
        <section className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            6. Questions Regarding Terms
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            For licensing inquiries, permissions, or questions regarding these Terms of Use, please reach out to our legal and editorial desk:
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
