import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { getArticlesByCategory } from "@/data/articles";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return siteConfig.categories.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = siteConfig.categories.find((c) => c.slug === slug);

  if (!category) return {};

  const url = `${siteConfig.baseUrl}/category/${category.slug}`;

  return {
    title: `${category.name} Archives & Guides`,
    description: category.description,
    alternates: {
      canonical: url,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = siteConfig.categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs
        crumbs={[{ label: category.name, href: `/category/${category.slug}` }]}
      />

      <header className="max-w-3xl mb-12 space-y-3">
        <span className={`text-xs font-mono px-2.5 py-1 rounded border inline-block ${category.badgeColor}`}>
          Knowledge Silo
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {category.name}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {category.description}
        </p>
      </header>

      {categoryArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-surface/50 text-slate-500 font-mono text-sm">
          No articles published in this silo yet. Upcoming guides are queued in editorial review.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((art) => (
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
                  <span className="text-xs font-mono text-slate-400">
                    Vol: {art.combinedVolume.toLocaleString()} /mo
                  </span>
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
      )}
    </div>
  );
}
