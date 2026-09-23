import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { articles } from "@/data/articles";

export default function HomePage() {
  // Top 5 Hero Grid articles: 1 main lead + 4 companion grid cards
  const leadArticle = articles[0]; // Excel Deduplication
  const topFourArticles = articles.slice(1, 5); // AWS EC2, ChatGPT, Windows 11, Linux permissions

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* =========================================================================
          TOP 5 MAGAZINE / BENTO HERO GRID (Inspired by The Verge & Ars Technica)
          Exactly 5 items: 1 prominent lead story + 4 complementary runbooks
         ========================================================================= */}
      <section className="mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Lead Story (Left 7 Cols on desktop, full height card) */}
          <div className="lg:col-span-7">
            <article className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group h-full min-h-[440px] sm:min-h-[500px] flex flex-col justify-end shadow-xs hover:border-slate-300 transition-all">
              {/* Background Image with Ambient Zoom */}
              <img
                src={leadArticle.coverImage}
                alt={leadArticle.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
              />
              {/* Dark Gradient Overlay for Maximum Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white shadow-sm">
                  {leadArticle.categoryName}
                </span>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-200 border border-slate-700/80 backdrop-blur-sm">
                  Featured Runbook
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span>{leadArticle.readingTimeMinutes} min read</span>
                  <span>•</span>
                  <span>Updated recently</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-300 transition-colors">
                  <Link href={`/articles/${leadArticle.slug}`}>
                    {leadArticle.title}
                  </Link>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-2xl">
                  {leadArticle.excerpt}
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-slate-700/60">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <span className="w-7 h-7 rounded-full bg-blue-600/90 flex items-center justify-center text-white font-mono font-bold text-xs">
                      ER
                    </span>
                    <span>By Elena Rostova</span>
                  </div>

                  <Link
                    href={`/articles/${leadArticle.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all shadow-sm"
                  >
                    Read Guide <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* 4-Story Sub-Grid (Right 5 Cols: 2x2 Grid) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topFourArticles.map((art) => (
              <article
                key={art.slug}
                className="rounded-xl border border-slate-200 bg-white hover:border-blue-400 publication-card shadow-xs overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-32 w-full overflow-hidden border-b border-slate-100">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200 shadow-2xs backdrop-blur-xs">
                      {art.categoryName}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
                      <span>{art.readingTimeMinutes} min read</span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/articles/${art.slug}`}>
                        {art.headline}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[120px]">
                    By {siteConfig.authors.find((a) => a.id === art.authorId)?.name || "SysOps Team"}
                  </span>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="font-bold text-blue-600 hover:text-blue-700 text-xs inline-flex items-center gap-0.5 shrink-0"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          TOPIC QUICK-FILTERS (Streamlined Category Bar)
         ========================================================================= */}
      <section className="mb-12 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Browse Topics:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-medium transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          EDITORIAL 2-COLUMN SECTION (Main Feed + Curated Sidebar)
          Standard layout used by Ars Technica, The Verge, Smashing Magazine
         ========================================================================= */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Feed Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Latest Technical Runbooks
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {articles.length} verified publications
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {articles.map((art) => (
                <article
                  key={art.slug}
                  className="py-6 first:pt-0 flex flex-col sm:flex-row gap-5 items-start group"
                >
                  <div className="relative w-full sm:w-56 h-36 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200 shadow-xs">
                      {art.categoryName}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span>{art.readingTimeMinutes} min read</span>
                      <span>•</span>
                      <span>By {siteConfig.authors.find((a) => a.id === art.authorId)?.name || "SysOps Team"}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      <Link href={`/articles/${art.slug}`}>
                        {art.headline}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href={`/articles/${art.slug}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        Read Full Runbook <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Sidebar Column (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Curated Most Referenced Box */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Essential Benchmarks
                </h3>
              </div>

              <div className="space-y-3.5">
                {articles.map((art, idx) => (
                  <div key={art.slug} className="flex items-start gap-3 group">
                    <span className="text-base font-extrabold font-mono text-slate-300 group-hover:text-blue-600 transition-colors shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <Link
                        href={`/articles/${art.slug}`}
                        className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
                      >
                        {art.headline}
                      </Link>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {art.readingTimeMinutes} min read
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Standards Box */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Editorial Benchmark Promise
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SysOps Journal runbooks are executed in isolated staging environments before publication. Every CLI command and configuration preset is verified for production safety.
              </p>
              <div className="pt-2">
                <Link
                  href="/editorial-policy"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
                >
                  Review Our Testing Protocol ↗
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
