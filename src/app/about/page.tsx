import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About SysOps Journal — Engineering Editorial Standards",
  description: "Learn about SysOps Journal, our senior editorial team, and our commitment to peer-reviewed, reproducible cloud infrastructure and data engineering content.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs crumbs={[{ label: "About Us", href: "/about" }]} />

      <header className="mb-10 space-y-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block">
          About
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About SysOps Journal
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          SysOps Journal is an independent engineering publication covering cloud architecture, Linux systems administration, and data automation.
        </p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-200 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Our Mission</h2>
          <p>
            Technical documentation has become crowded with superficial overviews, AI-spun articles, and hidden sponsored affiliate placements.
          </p>
          <p>
            SysOps Journal was created to deliver clean, reproducible, and field-tested tutorials. Every command and configuration guide is written and audited by real systems engineers.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Editorial Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteConfig.authors.map((author) => (
              <div key={author.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-14 h-14 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{author.name}</h3>
                    <p className="text-xs text-blue-700 font-medium">{author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {author.bio}
                </p>
                <div className="flex items-center gap-3 text-xs text-blue-600 pt-2 border-t border-slate-200">
                  {author.socials.linkedin && (
                    <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn Profile ↗
                    </a>
                  )}
                  {author.socials.github && (
                    <a href={author.socials.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
