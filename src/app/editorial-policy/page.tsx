import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

export const metadata: Metadata = {
  title: "Editorial Policy & Testing Standards — TechOps Wire",
  description: "Learn how we test code on real systems, keep tutorials up to date, verify command safety, and handle reader corrections.",
  alternates: {
    canonical: `${siteConfig.baseUrl}/editorial-policy`,
  },
  openGraph: {
    title: "Editorial Policy & Testing Standards — TechOps Wire",
    description: "Learn how we test code on real systems, keep tutorials up to date, verify command safety, and handle reader corrections.",
    url: `${siteConfig.baseUrl}/editorial-policy`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Policy & Testing Standards — TechOps Wire",
    description: "Learn how we test code on real systems, keep tutorials up to date, verify command safety, and handle reader corrections.",
  },
};

export default function EditorialPolicyPage() {
  const policySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Editorial Policy & Testing Standards — TechOps Wire",
    "url": `${siteConfig.baseUrl}/editorial-policy`,
    "description": "How TechOps Wire tests commands, maintains factual accuracy, verifies code snippets, and handles reader corrections.",
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.baseUrl,
      "publishingPrinciples": `${siteConfig.baseUrl}/editorial-policy`,
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SchemaJsonLd schema={policySchema} />
      <Breadcrumbs crumbs={[{ label: "Editorial Standards", href: "/editorial-policy" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Editorial Standards &amp; Quality Control
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Editorial Policy &amp; Testing Standards
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          Technical tutorials should never be guesswork. We outline our exact testing procedures, environment specifications, safety rules, and correction policies below.
        </p>
      </header>

      <div className="space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Testing Environments */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            1. Real-World Lab Testing Environments
          </h2>
          <p>
            Every terminal command, script snippet, and configuration block published on TechOps Wire is tested on clean, real-world systems before it is added to a tutorial. We do not write hypothetical instructions or copy unverified answers from online discussion boards.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900">Linux &amp; Container Testbeds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tested on fresh Ubuntu LTS (22.04 &amp; 24.04), Debian 12, and official Docker Engine releases. We verify command line syntax, exit code 0 status, and file permission boundaries.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900">Cloud Infrastructure Testbeds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AWS EC2 instances (ARM64 Graviton t4g/c7g and x86_64 c6i) provisioned inside standard Amazon VPC configurations to record accurate benchmark latencies and real pricing numbers.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900">Windows &amp; Workstations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean installations of Windows 11 Pro and Home, tested with Hyper-V, Windows Sandbox, BitLocker volume policies, and PowerShell 7.4.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900">Spreadsheets &amp; Data Sets</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Excel formulas (XLOOKUP, UNIQUE, FILTER) and Data Validation menus tested against real multi-thousand row datasets in both Microsoft 365 desktop builds and web versions.
              </p>
            </div>
          </div>
        </section>

        {/* Safety First Rules */}
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            2. Safety and Reversibility Rules
          </h2>
          <p>
            Systems administration involves operations that can damage data or bring down servers if executed carelessly. Our writing guidelines require authors to follow three strict safety rules:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Mandatory Backup Step:</strong> Any instruction that modifies configuration files, deletes records, or changes disk partitions must explicitly show how to make a backup first (such as creating a dated copy like <code>cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak</code>).
            </li>
            <li>
              <strong>Documented Rollback:</strong> When an operation could lead to service disruption, we provide the exact reversal steps so administrators can return to their previous working state quickly.
            </li>
            <li>
              <strong>No Risky Shortcuts:</strong> We never recommend blanket insecure fixes like setting <code>chmod 777</code> to bypass web server permission errors or disabling firewalls permanently instead of opening specific ports.
            </li>
          </ul>
        </section>

        {/* Author Qualifications & Fact Checking */}
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            3. Author Qualifications and Review
          </h2>
          <p>
            Guides on TechOps Wire are authored by professionals who work directly with systems engineering, cloud architecture, and data pipelines. We do not use anonymous bylines.
          </p>
          <p>
            Before an article goes live, an independent editor reviews the draft to check:
          </p>
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
              <strong>Reproducibility Check:</strong> Can a reader start from a clean terminal or blank workbook and reach the exact same result following the listed steps?
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
              <strong>Clarity Check:</strong> Are all flags, parameters, and formula arguments defined in plain English without unnecessary jargon?
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
              <strong>Source Verification:</strong> Do all references point directly to primary vendor documentation (Microsoft Learn, AWS Knowledge Center, Docker Documentation, or official man pages)?
            </div>
          </div>
        </section>

        {/* Independence & Commercial Integrity */}
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            4. Commercial Independence &amp; Links Policy
          </h2>
          <p>
            To protect reader trust, TechOps Wire operates under strict commercial independence:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>We do not sell sponsored article placements, guest backlink insertions, or paid tool rankings.</li>
            <li>Our software evaluations and benchmark numbers are determined solely by objective testing data.</li>
            <li>We do not accept gifts, free hardware, or compensation from vendors in exchange for positive reviews.</li>
          </ul>
        </section>

        {/* Corrections & Revision Policy */}
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            5. Reader Corrections and Revision Process
          </h2>
          <p>
            Software platforms change. If an update changes a menu path, a cloud provider renames a pricing tier, or you spot a typo in a command, our editorial team wants to know immediately.
          </p>
          <p>
            Here is our standard correction workflow:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-slate-700">
            <li>A reader submits feedback to <a href={`mailto:${siteConfig.contactEmail}`} className="text-blue-600 font-mono hover:underline">{siteConfig.contactEmail}</a>.</li>
            <li>A staff engineer replicates the reported behavior in our test environment within 24 business hours.</li>
            <li>If a syntax change or step adjustment is verified, we update the article and record the updated date at the top of the guide.</li>
          </ol>
        </section>

        {/* Contact Banner */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Notice a Command That Needs Updating?</h3>
            <p className="text-xs text-slate-500">
              Send the article link and revised command directly to our editorial desk.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 text-center"
          >
            Submit a Correction →
          </Link>
        </div>
      </div>
    </div>
  );
}
