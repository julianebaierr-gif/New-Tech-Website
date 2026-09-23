import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { articles, getFeaturedArticles } from "@/data/articles";

export default function HomePage() {
  const featured = getFeaturedArticles()[0] || articles[0];
  const regularArticles = articles.filter((a) => a.slug !== featured.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header Intro */}
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Practical Systems Engineering, Cloud & Data Automation
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          In-depth technical tutorials, architecture analyses, and field-tested scripts written by experienced systems engineers.
        </p>
      </div>

      {/* Featured Lead Story */}
      <section className="mb-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {featured.categoryName}
                </span>
                <span className="text-xs text-slate-500">
                  {featured.readingTimeMinutes} min read
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {featured.difficulty}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug hover:text-blue-600 transition-colors">
                <Link href={`/articles/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                    ER
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Elena Rostova</p>
                    <p className="text-[11px] text-slate-500">Senior Data Operations Engineer</p>
                  </div>
                </div>

                <Link
                  href={`/articles/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Read Guide <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Silos Grid */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Browse by Category</h2>
          <p className="text-xs text-slate-500 mt-1">Explore articles categorized by core engineering disciplines.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300 transition-all group shadow-sm"
            >
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded inline-block mb-3">
                {cat.name}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-4 flex items-center text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                View Articles →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Articles Grid */}
      <section>
        <div className="mb-6 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Latest Guides & Analyses
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Verified step-by-step documentation, configuration benchmarks, and troubleshooting manuals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((art) => (
            <article
              key={art.slug}
              className="flex flex-col rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all overflow-hidden shadow-sm"
            >
              <div className="relative h-48 w-full overflow-hidden border-b border-slate-100">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[11px] font-medium px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200 shadow-sm">
                  {art.categoryName}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{art.readingTimeMinutes} min read</span>
                    <span>{art.difficulty}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
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
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
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
