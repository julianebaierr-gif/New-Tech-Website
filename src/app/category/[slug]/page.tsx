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
    title: `${category.name} Guides & Articles`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        crumbs={[{ label: category.name, href: `/category/${category.slug}` }]}
      />

      <header className="max-w-3xl mb-10 space-y-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block">
          Category
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {category.name}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {category.description}
        </p>
      </header>

      {categoryArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-sm">
          No articles published in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((art) => (
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
                  <span className="text-xs text-slate-500">
                    {art.combinedVolume.toLocaleString()} searches/mo
                  </span>
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
      )}
    </div>
  );
}
