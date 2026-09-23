import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { articles, getFeaturedArticles } from "@/data/articles";

export default function HomePage() {
  const featured = getFeaturedArticles()[0] || articles[0];
  const secondaryLead = articles.find((a) => a.slug === "aws-ec2-instance-types-explained") || articles[1];
  const regularArticles = articles.filter((a) => a.slug !== featured.slug && a.slug !== secondaryLead.slug);

  // Quick jump popular runbooks for immediate reader engagement
  const trendingGuides = [
    { title: "Excel Deduplication: 4 Non-Destructive Methods", slug: "how-to-remove-duplicates-in-excel", category: "Excel Automation" },
    { title: "AWS EC2 Sizing: Choosing Between c7g vs m6i", slug: "aws-ec2-instance-types-explained", category: "Cloud Architecture" },
    { title: "Why ChatGPT Throttles: API & Browser Fixes", slug: "why-is-chatgpt-so-slow", category: "AI Tooling" },
    { title: "Windows 11 Pro vs Home: BitLocker & RAM Limits", slug: "windows-11-pro-vs-home", category: "OS & Systems" },
  ];

  // Category direct highlights mapping
  const categoryHighlights: Record<string, { topArticleSlug: string; topArticleTitle: string; icon: string }> = {
    "data-excel-automation": {
      topArticleSlug: "how-to-remove-duplicates-in-excel",
      topArticleTitle: "Enterprise Deduplication & Cleanup",
      icon: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z",
    },
    "cloud-infrastructure": {
      topArticleSlug: "aws-ec2-instance-types-explained",
      topArticleTitle: "AWS EC2 Instance Sizing & Pricing",
      icon: "M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z",
    },
    "ai-developer-tools": {
      topArticleSlug: "why-is-chatgpt-so-slow",
      topArticleTitle: "Diagnosing LLM Response Bottlenecks",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    "os-systems": {
      topArticleSlug: "windows-11-pro-vs-home",
      topArticleTitle: "Windows 11 Enterprise Hardware Limits",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Masthead & Value Proposition */}
      <div className="pb-8 mb-8 border-b border-slate-200">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Peer-Reviewed Engineering Field Notes
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Production-Tested Runbooks for Systems, Cloud &amp; Automation
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            Detailed technical tutorials, configuration benchmarks, and battle-tested scripts written by practicing systems engineers.
          </p>
        </div>

        {/* Quick-Jump Trending Ticker (Instant Click Triggers) */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] shrink-0 flex items-center gap-1.5 text-blue-700">
            <span>⚡ Essential Guides:</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {trendingGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/articles/${guide.slug}`}
                className="px-3 py-1 rounded-lg bg-slate-100/80 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/80 text-slate-700 transition-all font-medium inline-flex items-center gap-1.5"
              >
                <span>{guide.title}</span>
                <span className="text-slate-400 group-hover:text-blue-500">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Magazine Section (Featured Lead + Editor's Selection) */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Featured Lead Story */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 publication-card shadow-xs">
            <div className="relative h-64 sm:h-84 w-full rounded-xl overflow-hidden mb-6 border border-slate-100">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="object-cover w-full h-full hover:scale-[1.02] transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-white/95 text-blue-900 border border-slate-200 shadow-sm backdrop-blur-sm">
                Featured Lead Guide
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span className="text-blue-700 font-semibold">{featured.categoryName}</span>
                <span>•</span>
                <span>{featured.readingTimeMinutes} min read</span>
                <span>•</span>
                <span>Updated recently</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug hover:text-blue-600 transition-colors">
                <Link href={`/articles/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {featured.excerpt}
              </p>

              {/* Inside this Guide: Concrete Takeaways that compel clicking */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Technical Methods Covered:
                </p>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>Visual Audits:</strong> Highlighting single vs multiple duplicates via Conditional Formatting.
                  </li>
                  <li>
                    <strong>Dynamic Formulas:</strong> Extracting unique arrays dynamically with <code className="bg-slate-200/80 px-1 py-0.5 rounded text-slate-800 font-mono">=UNIQUE()</code>.
                  </li>
                  <li>
                    <strong>Batch Automation:</strong> Fast, non-destructive VBA subroutines for 50,000+ row datasets.
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs font-mono">
                    ER
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Elena Rostova</p>
                    <p className="text-[11px] text-slate-500">Senior Data Operations Engineer</p>
                  </div>
                </div>

                <Link
                  href={`/articles/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all shadow-xs"
                >
                  Read Full Guide <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Spotlight Story */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 publication-card shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
                  Editor&#39;s Selection
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {secondaryLead.readingTimeMinutes} min read
                </span>
              </div>

              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-5 border border-slate-100">
                <img
                  src={secondaryLead.coverImage}
                  alt={secondaryLead.title}
                  className="object-cover w-full h-full hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {secondaryLead.categoryName}
                </span>

                <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors leading-snug">
                  <Link href={`/articles/${secondaryLead.slug}`}>
                    {secondaryLead.headline}
                  </Link>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {secondaryLead.excerpt}
                </p>

                {/* Practical Takeaway box */}
                <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-950 space-y-1">
                  <p className="font-semibold text-blue-900">Why read this guide:</p>
                  <p className="text-blue-900/80 leading-relaxed">
                    Stop overpaying for compute. Benchmark vCPU-to-RAM ratios and see when ARM Graviton instances cut 20% off your AWS bill.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">By Marcus Vance</span>
              <Link
                href={`/articles/${secondaryLead.slug}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Read Sizing Guide <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Hubs & Categories (With Direct Article Links) */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore by Technical Domain
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct access to field tutorials across infrastructure, automation, and core operating systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteConfig.categories.map((cat) => {
            const highlight = categoryHighlights[cat.slug];
            return (
              <div
                key={cat.slug}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 publication-card shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={highlight?.icon || "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5 hover:text-blue-600 transition-colors">
                    <Link href={`/category/${cat.slug}`}>
                      {cat.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {highlight && (
                    <div className="text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Essential Runbook:
                      </span>
                      <Link
                        href={`/articles/${highlight.topArticleSlug}`}
                        className="font-medium text-slate-800 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {highlight.topArticleTitle} →
                      </Link>
                    </div>
                  )}

                  <div className="pt-1">
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      View All Guides <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest Technical Publications Grid */}
      <section className="mb-16">
        <div className="mb-8 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              All Technical Guides &amp; Benchmarks
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Field-tested implementations with full terminal snippets and architectural tables.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {articles.length} verified publications
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.slug}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white publication-card shadow-xs overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden border-b border-slate-100">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/95 text-slate-800 border border-slate-200 shadow-xs backdrop-blur-sm">
                  {art.categoryName}
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                  {art.readingTimeMinutes} min read
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/articles/${art.slug}`}>
                      {art.headline}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    By {siteConfig.authors.find((a) => a.id === art.authorId)?.name || "SysOps Team"}
                  </span>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    Read Guide <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Engineering Standards (Genuine Value Strip) */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-8 sm:p-10 mb-8">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            How SysOps Journal Maintains Technical Quality
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Every publication adheres to strict reproducibility standards designed for active infrastructure engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Tested in Live Sandboxes</h3>
            <p className="leading-relaxed text-slate-500">
              Commands, configurations, and scripts are executed in clean cloud VMs to verify edge cases and flags.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Practical Depth First</h3>
            <p className="leading-relaxed text-slate-500">
              We focus on actionable runbooks, architectural decision trade-offs, and non-destructive procedures.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Regularly Maintained</h3>
            <p className="leading-relaxed text-slate-500">
              When AWS, Linux distributions, or APIs introduce breaking changes, articles are updated and tagged.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
