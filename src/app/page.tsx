import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { articles, getFeaturedArticles } from "@/data/articles";

export default function HomePage() {
  const featured = getFeaturedArticles()[0] || articles[0];
  const secondaryLead = articles.find((a) => a.slug === "aws-ec2-instance-types-explained") || articles[1];
  const regularArticles = articles.filter((a) => a.slug !== featured.slug && a.slug !== secondaryLead.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Publication Masthead Header */}
      <div className="pb-8 mb-10 border-b border-slate-200">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            High-Reliability Cloud, Linux &amp; Data Systems
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Practical tutorials, architectural benchmarks, and enterprise automation guides written by experienced practitioners.
          </p>
        </div>
      </div>

      {/* Hero Section (Featured Lead + Editor's Pick) */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Featured Lead Story */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 publication-card">
            <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden mb-6 border border-slate-100">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="object-cover w-full h-full"
              />
              <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-blue-800 border border-slate-200 shadow-sm backdrop-blur-sm">
                Featured Guide
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span className="text-blue-700 font-semibold">{featured.categoryName}</span>
                <span>•</span>
                <span>{featured.readingTimeMinutes} min read</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {featured.difficulty}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug hover:text-blue-600 transition-colors">
                <Link href={`/articles/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm font-mono">
                    ER
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Elena Rostova</p>
                    <p className="text-[11px] text-slate-500">Senior Data Operations Engineer</p>
                  </div>
                </div>

                <Link
                  href={`/articles/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Read Full Guide <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Spotlight Story */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 publication-card flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-3 block">
                Editor&#39;s Selection
              </span>

              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-5 border border-slate-200">
                <img
                  src={secondaryLead.coverImage}
                  alt={secondaryLead.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="text-blue-700 font-medium">{secondaryLead.categoryName}</span>
                  <span>•</span>
                  <span>{secondaryLead.readingTimeMinutes} min</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors leading-snug">
                  <Link href={`/articles/${secondaryLead.slug}`}>
                    {secondaryLead.headline}
                  </Link>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {secondaryLead.excerpt}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">By Marcus Vance</span>
              <Link
                href={`/articles/${secondaryLead.slug}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Read Analysis →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Silo Explorer */}
      {/* Category Explorer */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Browse Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Core technical disciplines covering infrastructure, automation, and systems administration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 publication-card group"
            >
              <div className="mb-2">
                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {cat.description}
              </p>
              <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                Browse Articles <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Publications Grid */}
      <section className="mb-16">
        <div className="mb-8 pb-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Latest Articles
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Field-tested guides, architectural comparisons, and terminal workflows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((art) => (
            <article
              key={art.slug}
              className="flex flex-col rounded-xl border border-slate-200 bg-white publication-card overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden border-b border-slate-100">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="object-cover w-full h-full"
                />
                <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/95 text-slate-800 border border-slate-200 shadow-2xs backdrop-blur-sm">
                  {art.categoryName}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{art.readingTimeMinutes} min read</span>
                    <span>{art.difficulty}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/articles/${art.slug}`}>
                      {art.headline}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">By Marcus Vance</span>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Read Guide →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
