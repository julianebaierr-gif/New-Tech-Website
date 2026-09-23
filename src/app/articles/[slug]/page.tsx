import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { articles, getArticleBySlug, getArticlesByCategory } from "@/data/articles";
import { TableOfContents } from "@/components/TableOfContents";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return {};

  const url = `${siteConfig.baseUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: url,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.authors.find((a) => a.id === article.authorId)?.name || siteConfig.name],
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const author = siteConfig.authors.find((a) => a.id === article.authorId) || siteConfig.authors[0];
  const relatedArticles = getArticlesByCategory(article.categorySlug)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  // Advanced TechArticle JSON-LD Schema
  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.coverImage,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.role,
      "url": author.socials.linkedin,
      "sameAs": Object.values(author.socials),
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.baseUrl}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.baseUrl}/articles/${article.slug}`,
    },
    "proficiencyLevel": article.difficulty,
    "keywords": [article.primaryKeyword, ...article.secondaryKeywords].join(", "),
  };

  // FAQPage Schema for SERP Rich Snippets
  const faqSchema = article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  } : null;

  return (
    <>
      <SchemaJsonLd schema={techArticleSchema} />
      {faqSchema && <SchemaJsonLd schema={faqSchema} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs
          crumbs={[
            { label: article.categoryName, href: `/category/${article.categorySlug}` },
            { label: article.headline, href: `/articles/${article.slug}` },
          ]}
        />

        {/* Article Header */}
        <header className="max-w-4xl mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/category/${article.categorySlug}`}
              className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              {article.categoryName}
            </Link>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-400">
              {article.readingTimeMinutes} min read
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              Verified {new Date(article.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author Byline Box */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{author.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    SME
                  </span>
                </div>
                <p className="text-xs text-slate-400">{author.role}</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
              {author.socials.linkedin && (
                <a
                  href={author.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  LinkedIn ↗
                </a>
              )}
              {author.socials.github && (
                <a
                  href={author.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 mb-12 shadow-2xl">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        {/* Main Content Layout with Sticky TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Body */}
          <article className="lg:col-span-8 space-y-6 text-slate-300 leading-relaxed font-sans prose-invert">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* Zero-Click AEO FAQ Accordion */}
            <FaqAccordion faqs={article.faqs} />

            {/* Author Profile Bio Footer */}
            <div className="my-12 p-6 rounded-2xl border border-slate-800 bg-surface/80">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{author.name}</h4>
                    <span className="text-xs text-slate-500 font-mono">• {author.role}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {author.bio}
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-xs font-mono text-blue-400">
                    <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Verified Identity Profile ↗
                    </a>
                    <Link href="/editorial-policy" className="text-slate-400 hover:text-white">
                      Editorial Fact-Checking Standards ↗
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Silo Articles (Internal Linking Architecture) */}
            {relatedArticles.length > 0 && (
              <div className="mt-14 pt-8 border-t border-slate-800">
                <h3 className="text-lg font-bold text-white mb-6">
                  Recommended Technical Studies in this Silo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/articles/${rel.slug}`}
                      className="p-4 rounded-xl border border-slate-800 bg-surface/60 hover:bg-surface hover:border-slate-700 transition-all block group"
                    >
                      <span className="text-[10px] font-mono text-blue-400 mb-1 block">
                        {rel.readingTimeMinutes} min read
                      </span>
                      <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {rel.headline}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sticky Sidebar with TOC */}
          <aside className="hidden lg:block lg:col-span-4">
            <TableOfContents items={article.tableOfContents} />
          </aside>
        </div>
      </div>
    </>
  );
}
