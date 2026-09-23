import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About TechOps Wire — Engineering Staff & Mission",
  description: "Learn about TechOps Wire, our technical editorial staff, and our commitment to peer-reviewed, reproducible cloud infrastructure, data automation, and developer tutorials.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "About Us", href: "/about" }]} />

      <header className="mb-10 space-y-3 pb-8 border-b border-slate-200">
        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
          Publication Staff &amp; Mission
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          About TechOps Wire
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          An independent technical publication covering cloud architecture, modern developer tools, and enterprise data automation.
        </p>
      </header>

      <div className="space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Mission Statement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Our Editorial Purpose
          </h2>
          <p>
            Modern infrastructure changes rapidly. Engineering teams regularly lose productive hours deciphering outdated blog posts, conflicting stack overflow answers, and half-baked tutorials that fail on real servers.
          </p>
          <p>
            TechOps Wire was founded to provide reliable, non-destructive, and battle-tested guides. Every command, script, and configuration tutorial is validated in isolated environments before release.
          </p>
        </section>

        {/* 3 Core Editorial Principles */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Tested in Sandboxes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every terminal snippet is executed on fresh Ubuntu, Debian, or AWS cloud environments.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Reproducible Value</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We focus on non-destructive commands, step-by-step procedures, and explicit rollback options.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Maintained Content</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Articles are audited when tools update flags or cloud interfaces undergo breaking changes.
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
              Practicing systems engineers with production background in large-scale deployments.
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
              Review Our Fact-Checking &amp; Verification Policy
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Read how we test code, manage errata, and maintain strict link integrity.
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
