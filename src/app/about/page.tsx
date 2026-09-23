import { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About SysOps Journal — Engineering Editorial Standards",
  description: "Learn about SysOps Journal, our senior editorial team, and our commitment to peer-reviewed, reproducible cloud infrastructure and data engineering content.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "About Us", href: "/about" }]} />

      <header className="mb-12 space-y-4">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block">
          Publication Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About SysOps Journal
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          SysOps Journal is an independent engineering publication dedicated to high-reliability cloud architecture, Linux systems administration, enterprise data hygiene, and automated workflows.
        </p>
      </header>

      <div className="space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base border-t border-slate-800 pt-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Why We Exist</h2>
          <p>
            In the modern digital landscape, technical documentation has become polluted with unverified AI-generated content, outdated StackOverflow snippets, and covert sponsored product placements.
          </p>
          <p>
            SysOps Journal was established to provide senior DevOps engineers, database administrators, and technical leads with rigorously verified, reproducible guides. Every command, configuration script, and architectural pattern published in our journal is tested inside live sandboxed environments prior to publication.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Editorial Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteConfig.authors.map((author) => (
              <div key={author.id} className="p-6 rounded-2xl border border-slate-800 bg-surface/70 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-14 h-14 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{author.name}</h3>
                    <p className="text-xs text-blue-400 font-mono">{author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {author.bio}
                </p>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  {author.socials.linkedin && (
                    <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                      LinkedIn ↗
                    </a>
                  )}
                  {author.socials.github && (
                    <a href={author.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
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
