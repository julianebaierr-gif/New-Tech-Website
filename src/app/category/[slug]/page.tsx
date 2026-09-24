import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { getArticlesByCategory } from "@/data/articles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

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
    title: `${category.name} Articles | ${siteConfig.name}`,
    description: category.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${category.name} Articles | ${siteConfig.name}`,
      description: category.description,
      url: url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Articles | ${siteConfig.name}`,
      description: category.description,
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
  const categoryUrl = `${siteConfig.baseUrl}/category/${category.slug}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Articles`,
    "description": category.description,
    "url": categoryUrl,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.baseUrl,
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": categoryArticles.map((art, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${siteConfig.baseUrl}/articles/${art.slug}`,
        "name": art.title,
      })),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SchemaJsonLd schema={collectionSchema} />
      <Breadcrumbs
        crumbs={[{ label: category.name, href: `/category/${category.slug}` }]}
      />

      {/* Category Hero Masthead */}
      <header className="mb-10 pb-8 border-b border-slate-200">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Category Archive
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">
              {categoryArticles.length} {categoryArticles.length === 1 ? "article" : "articles"} available
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {category.name}
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
            {category.description}
          </p>
        </div>

        {/* Quick Category Switcher Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Other Areas:</span>
          {siteConfig.categories.map((c) => {
            const isCurrent = c.slug === category.slug;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Articles Grid */}
      {categoryArticles.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-sm space-y-3">
          <p>No guides published in this category yet.</p>
          <Link href="/" className="inline-block text-xs font-semibold text-blue-600 hover:underline">
            Return to Homepage →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((art) => (
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
                  <Link
                    href={`/authors/${art.authorId}`}
                    className="flex items-center gap-2 group/author hover:text-blue-600 transition-colors"
                  >
                    <img
                      src={siteConfig.authors.find((a) => a.id === art.authorId)?.avatar}
                      alt={siteConfig.authors.find((a) => a.id === art.authorId)?.name || "Author"}
                      className="w-5 h-5 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-slate-600 font-medium group-hover/author:text-blue-600 transition-colors">
                      {siteConfig.authors.find((a) => a.id === art.authorId)?.name || "TechOps Team"}
                    </span>
                  </Link>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="font-bold text-blue-600 hover:text-blue-700 text-xs inline-flex items-center gap-0.5"
                  >
                    Read Article →
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
