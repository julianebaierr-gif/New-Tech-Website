import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { articles, getFeaturedArticles } from "@/data/articles";

export default function HomePage() {
  const featured = getFeaturedArticles()[0] || articles[0];
  const regularArticles = articles.filter((a) => a.slug !== featured.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Editorial Trust Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-surface/60 border border-slate-800 rounded-xl mb-10 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300 font-semibold uppercase">Systems Status: Normal</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Peer-Reviewed Technical Standards</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline text-emerald-400">Production-Verified Code</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Zero Sponsored Bias</span>
        </div>
      </div>

      {/* Hero Featured Article */}
      <section className="mb-16">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-surface to-slate-900/40 p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  {featured.categoryName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {featured.readingTimeMinutes} min read
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {featured.difficulty}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight hover:text-blue-400 transition-colors">
                <Link href={`/articles/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white font-mono">
                    ER
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Elena Rostova</p>
                    <p className="text-[11px] text-slate-400 font-mono">Verified Lead Author</p>
                  </div>
                </div>

                <Link
                  href={`/articles/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 font-mono"
                >
                  Read Investigation <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-slate-700/60 shadow-xl group">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Silos Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core Knowledge Silos</h2>
            <p className="text-xs text-slate-400 mt-1">Structured technical domains adhering to zero topical drift.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="p-5 rounded-xl border border-slate-800 bg-surface/70 hover:bg-surface hover:border-slate-700 transition-all group"
            >
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border inline-block mb-3 ${cat.badgeColor}`}>
                {cat.name}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">
                {cat.description}
              </p>
              <div className="mt-4 flex items-center text-xs font-mono text-blue-400 group-hover:translate-x-1 transition-transform">
                Explore Silo →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Latest Engineering Blueprints
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Field-tested guides with copyable CLI scripts, architectural benchmarks, and verified workflows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((art) => (
            <article
              key={art.slug}
              className="flex flex-col rounded-xl border border-slate-800 bg-surface/70 hover:border-slate-700 transition-all overflow-hidden group shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden border-b border-slate-800">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700">
                  {art.categoryName}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{art.readingTimeMinutes} min read</span>
                    <span>{art.difficulty}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    <Link href={`/articles/${art.slug}`}>
                      {art.headline}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-300">
                      MV
                    </div>
                    <span className="text-xs text-slate-300 font-medium">Marcus Vance</span>
                  </div>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="text-xs font-mono text-blue-400 hover:text-blue-300"
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
