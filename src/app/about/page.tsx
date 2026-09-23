import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About TechOps Wire — Editorial Team & Mission",
  description: "Learn about TechOps Wire, our editorial background, and why we build clear, tested guides for spreadsheets, cloud setups, and operating systems.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "About Us", href: "/about" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Editorial Team &amp; Background
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          About TechOps Wire
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          A practical tech publication covering spreadsheet formulas, cloud setups, developer tools, and everyday computer systems.
        </p>
      </header>

      <div className="space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Mission Statement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Why We Started
          </h2>
          <p>
            Finding reliable technical answers on the internet has become surprisingly hard. Most search results today are either bloated with popups or copied from outdated manuals that fail when you try them on your computer.
          </p>
          <p>
            We started TechOps Wire with a straightforward standard: write down the exact steps that solve the problem, test them on real machines first, and skip the unnecessary filler. Whether you are trying to fix a broken Excel formula before a deadline or launch an AWS server without overpaying, our goal is to save you time.
          </p>
        </section>

        {/* 3 Core Principles */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Tested on Real Machines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every command and spreadsheet formula is run on clean Windows, Linux, or AWS setups before publishing.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Safe &amp; Non-Destructive</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We always point out what will happen to your files before you press Enter, with clear backup steps.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Regularly Updated</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When software updates change menus or flags, we update our tutorials so they keep working.
            </p>
          </div>
        </section>

        {/* Editorial Team */}
        <section className="space-y-6 pt-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Editorial Staff
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Systems administrators, data analysts, and practicing developers who use these tools every day.
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

        {/* Editorial Standards Link */}
        <section className="p-6 rounded-2xl border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Read How We Test and Verify Our Content
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Learn how we check commands, keep guides up to date, and handle reader feedback.
            </p>
          </div>
          <Link
            href="/editorial-policy"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition-colors shrink-0 text-center"
          >
            Editorial Policy →
          </Link>
        </section>
      </div>
    </div>
  );
}
