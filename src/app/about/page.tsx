import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

export const metadata: Metadata = {
  title: "About TechOps Wire | Editorial Team, Testing Standards & Mission",
  description: "Learn about TechOps Wire, our editorial background, and why we test every spreadsheet formula, cloud configuration, and operating system tutorial on real machines before publishing.",
  alternates: {
    canonical: `${siteConfig.baseUrl}/about`,
  },
  openGraph: {
    title: "About TechOps Wire | Editorial Team, Testing Standards & Mission",
    description: "Learn about TechOps Wire, our editorial background, and why we test every spreadsheet formula, cloud configuration, and operating system tutorial on real machines before publishing.",
    url: `${siteConfig.baseUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About TechOps Wire | Editorial Team, Testing Standards & Mission",
    description: "Learn about TechOps Wire, our editorial background, and why we test every spreadsheet formula, cloud configuration, and operating system tutorial on real machines before publishing.",
  },
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About TechOps Wire",
    "description": "Editorial background, testing standards, and team behind TechOps Wire.",
    "url": `${siteConfig.baseUrl}/about`,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.baseUrl,
      "logo": `${siteConfig.baseUrl}/logo.png`,
    },
    "mainEntity": {
      "@type": "Organization",
      "name": siteConfig.name,
      "foundingDate": "2026",
      "url": siteConfig.baseUrl,
      "description": siteConfig.description,
      "member": siteConfig.authors.map((author) => ({
        "@type": "Person",
        "name": author.name,
        "jobTitle": author.role,
        "description": author.bio,
        "sameAs": Object.values(author.socials).filter(Boolean),
      })),
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SchemaJsonLd schema={aboutSchema} />
      <Breadcrumbs crumbs={[{ label: "About Us", href: "/about" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Editorial Team &amp; Background
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          About TechOps Wire
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          An independent technical publication providing clear, tested tutorials on spreadsheets, cloud servers, developer tools, and everyday computer operating systems.
        </p>
      </header>

      <div className="space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Why We Started */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Why We Started TechOps Wire
          </h2>
          <p>
            If you have spent any time searching the web for technical troubleshooting steps, you have likely run into the same frustrations we did: bloated pages with dozens of intrusive ads, copied-and-pasted articles that do not explain what the commands actually do, and outdated tutorials that fail the moment you paste them into your terminal or spreadsheet.
          </p>
          <p>
            Worse still, many websites give risky advice without warning you of the consequences, such as telling people to run dangerous file permission commands like <code>chmod 777</code> to solve a minor web server issue, or advising users to clean duplicate rows in Excel without explaining how to preserve their historical data.
          </p>
          <p>
            We founded <strong>TechOps Wire</strong> in 2026 to offer a straightforward alternative: honest, practical guides written by experienced technicians. Every tutorial on this site focuses on solving real problems without wasting your time, without sales pitches, and without confusing jargon.
          </p>
        </section>

        {/* 4 Core Focus Areas */}
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            What We Cover
          </h2>
          <p>
            TechOps Wire focuses on four core areas that sysadmins, office professionals, and software developers interact with daily:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">01. Spreadsheets &amp; Data</span>
              <h3 className="font-bold text-slate-900 text-base">Data &amp; Excel Automation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step instructions for dynamic formulas (XLOOKUP, UNIQUE, FILTER), cleaning messy exports, fixing broken drop-down lists, and formatting tables properly so your reports remain accurate.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">02. DevOps &amp; Servers</span>
              <h3 className="font-bold text-slate-900 text-base">Cloud &amp; Infrastructure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear guides for Amazon Web Services (AWS EC2 sizing, VPC setups), Docker container storage and networking, and Linux administration commands that keep production environments running smoothly.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">03. Modern Workflows</span>
              <h3 className="font-bold text-slate-900 text-base">AI &amp; Developer Tools</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Practical breakdowns of modern tools like ChatGPT, including token context limits, file upload restrictions for large PDFs and spreadsheets, and developer utilities that speed up day-to-day coding.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">04. Workstations &amp; OS</span>
              <h3 className="font-bold text-slate-900 text-base">Operating Systems &amp; Maintenance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct comparisons between Windows 11 editions, setting up BitLocker drive encryption, configuring Hyper-V virtual machines, and planning Windows Server migration timelines before support ends.
              </p>
            </div>
          </div>
        </section>

        {/* How We Test and Verify */}
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            How We Test Our Guides
          </h2>
          <p>
            We take accuracy seriously. Before any guide is approved and published on TechOps Wire, it goes through a hands-on verification process:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">1. Tested on Real Systems</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We test commands on clean virtual machines (fresh Ubuntu LTS and Debian installations, Windows 11 test builds, and active AWS accounts). We verify that terminal commands return exit code 0 and produce the expected results.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">2. Safety and Backup Steps First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If a tutorial involves modifying system files, deleting records, or running administrative commands, we always explain how to make a backup first and provide the exact rollback steps in case you need to revert changes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">3. Plain English Explanations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe that good technical writing is easy to follow. We explain what each flag or argument means (such as why <code>chmod 755</code> gives read and execute rights to others while keeping write access restricted to the owner).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h3 className="text-sm font-bold text-slate-900">4. Regular Updates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Software tools and cloud provider menus change frequently. We review our tutorials periodically and update commands or screenshots whenever new software releases alter menu locations or deprecate syntax flags.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Independence */}
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Editorial Independence &amp; Ethics
          </h2>
          <p>
            TechOps Wire is completely editorially independent. We do not sell paid search rankings, we do not accept sponsored guest articles designed solely to insert backlink advertisements, and we do not let commercial sponsors influence our recommendations.
          </p>
          <p>
            When we recommend a tool, operating system setting, or software utility, it is because we have tested it and found it genuinely helpful for solving technical problems. When our articles link to external websites, those links lead directly to official software documentation, open-source repositories, or vendor knowledge bases.
          </p>
        </section>

        {/* Editorial Staff */}
        <section className="space-y-6 pt-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Our Editorial Team
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              The writers and editors responsible for testing and maintaining our guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteConfig.authors.map((author) => (
              <div key={author.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-14 h-14 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{author.name}</h3>
                    <p className="text-xs text-blue-700 font-semibold">{author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {author.bio}
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-blue-600 pt-3 border-t border-slate-100">
                  {author.socials.linkedin && (
                    <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn Profile ↗
                    </a>
                  )}
                  {author.socials.github && (
                    <a href={author.socials.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      GitHub Profile ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Questions and Feedback */}
        <section className="p-6 rounded-2xl border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Have Questions or Feedback for Our Team?
            </h3>
            <p className="text-xs text-slate-500">
              Spotted a command syntax change or want to request a guide? Send a note to our desk.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/editorial-policy"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-semibold text-xs transition-colors text-center"
            >
              Editorial Standards
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors text-center"
            >
              Contact Us →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
