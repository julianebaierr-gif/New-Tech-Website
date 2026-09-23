import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { articles } from "@/data/articles";

export default function HomePage() {
  // Top 5 Hero Magazine Grid: 1 prominent lead article + 4 companion grid cards
  const leadArticle = articles[0]; // Excel Deduplication
  const topFourArticles = articles.slice(1, 5); // AWS EC2, ChatGPT, Windows 11, Linux permissions

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* =========================================================================
          TOP 5 MAGAZINE HERO GRID (Clean, Editorial, High-Impact)
          1 Large Featured Lead + 4 Companion Stories in a 2x2 Grid = Exactly 5
         ========================================================================= */}
      <section className="mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Lead Story (Left 7 Columns on desktop) */}
          <div className="lg:col-span-7">
            <article className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 group h-full min-h-[440px] sm:min-h-[500px] flex flex-col justify-end shadow-xs hover:border-slate-300 transition-all">
              {/* Background Cover Image with Ambient Hover Zoom */}
              <img
                src={leadArticle.coverImage}
                alt={leadArticle.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
              />
              {/* Gradient Overlay for Crisp Typography Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

              {/* Bottom Card Content */}
              <div className="relative z-10 p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-400 font-bold uppercase tracking-wider text-xs">
                    {leadArticle.categoryName}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{leadArticle.readingTimeMinutes} min read</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">Elena Rostova</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-300 transition-colors">
                  <Link href={`/articles/${leadArticle.slug}`}>
                    {leadArticle.title}
                  </Link>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-2xl">
                  {leadArticle.excerpt}
                </p>

                <div className="pt-3 flex items-center justify-between border-t border-slate-700/60 text-xs">
                  <span className="text-slate-400 font-medium">
                    Published in {leadArticle.categoryName}
                  </span>
                  <Link
                    href={`/articles/${leadArticle.slug}`}
                    className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    Read Guide <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* 4 Companion Story Cards (Right 5 Columns in a 2x2 Grid) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topFourArticles.map((art) => (
              <article
                key={art.slug}
                className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 publication-card shadow-xs overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-32 w-full overflow-hidden border-b border-slate-100">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                      {art.categoryName}
                    </span>

                    <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/articles/${art.slug}`}>
                        {art.headline}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pt-1">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{art.readingTimeMinutes} min read</span>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
                  >
                    Read <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION DIVIDER & NATURAL TOPIC NAVIGATION (No Blue Dots, No Gimmicks)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-8 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Latest Articles
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Practical tutorials, architectural comparisons, and systems guides.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5 text-xs">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* =========================================================================
          CLEAN 3-COLUMN ARTICLE GRID (9 Articles: Exactly 3x3 Balanced Grid)
         ========================================================================= */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 9).map((art) => (
            <article
              key={art.slug}
              className="rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 publication-card shadow-xs overflow-hidden flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-100 bg-slate-100">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-600 uppercase tracking-wider text-[11px]">
                      {art.categoryName}
                    </span>
                    <span className="text-slate-500 font-mono">{art.readingTimeMinutes} min read</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/articles/${art.slug}`}>
                      {art.headline}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 font-mono">
                      {art.authorId === "elena-rostova" ? "ER" : "MV"}
                    </span>
                    <span className="text-slate-600 font-medium">
                      {siteConfig.authors.find((a) => a.id === art.authorId)?.name || "SysOps Team"}
                    </span>
                  </div>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="font-bold text-blue-600 hover:text-blue-700 text-xs inline-flex items-center gap-0.5"
                  >
                    Read Guide →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Learn More & Full Directory Action Button */}
        <div className="mt-12 text-center pt-4">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition-all shadow-xs group"
            >
              <span>Explore All Guides &amp; Verification Standards</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5">
            Peer-reviewed tutorials across cloud architecture, spreadsheet automation &amp; Linux internals.
          </p>
        </div>
      </section>

      {/* =========================================================================
          EXPLORE BY TOPIC (Clean, Functional Categories)
         ========================================================================= */}
      <section className="mb-14">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Explore by Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse our core areas of technical coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 publication-card shadow-xs group flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                View Articles <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
