import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { articles, getArticleBySlug, getArticlesByCategory } from "@/data/articles";
import { TableOfContents } from "@/components/TableOfContents";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { ShareBar } from "@/components/ShareBar";

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
        {
          url: article.secondaryImage.url,
          width: 1200,
          height: 630,
          alt: article.secondaryImage.alt,
        },
        ...(article.tertiaryImage ? [{
          url: article.tertiaryImage.url,
          width: 1200,
          height: 630,
          alt: article.tertiaryImage.alt,
        }] : []),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [
        article.coverImage,
        article.secondaryImage.url,
        ...(article.tertiaryImage ? [article.tertiaryImage.url] : []),
      ],
    },
  };
}

interface SplitSections {
  part1: string;
  part2: string;
  part3: string;
}

function splitContentForImages(html: string, img2Heading: number = 3, img3Heading: number = 6): SplitSections {
  const h2Regex = /<h2\b/gi;
  const indices: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = h2Regex.exec(html)) !== null) {
    indices.push(match.index);
  }

  if (indices.length < 2) {
    return { part1: html, part2: "", part3: "" };
  }

  // Heading position for Image 2 (default 3rd H2, or 2nd if fewer)
  const idx2 = indices.length >= img2Heading ? indices[img2Heading - 1] : indices[1];

  // Heading position for Image 3 (default 6th H2, or 5th/last available if fewer)
  let target3 = img3Heading;
  if (indices.length < target3) {
    target3 = Math.max(3, indices.length);
  }
  const idx3 = indices.length >= target3 && target3 > 2 ? indices[target3 - 1] : -1;

  if (idx3 === -1 || idx3 <= idx2) {
    return {
      part1: html.slice(0, idx2),
      part2: html.slice(idx2),
      part3: "",
    };
  }

  return {
    part1: html.slice(0, idx2),
    part2: html.slice(idx2, idx3),
    part3: html.slice(idx3),
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

  const articleUrl = `${siteConfig.baseUrl}/articles/${article.slug}`;

  const sections = splitContentForImages(article.contentHtml, 3, 6);

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.excerpt,
    "image": [
      article.coverImage,
      article.secondaryImage.url,
      ...(article.tertiaryImage ? [article.tertiaryImage.url] : []),
    ],
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Person",
      "@id": `${siteConfig.baseUrl}/authors/${author.id}#person`,
      "name": author.name,
      "jobTitle": author.role,
      "url": `${siteConfig.baseUrl}/authors/${author.id}`,
      "image": `${siteConfig.baseUrl}${author.avatar}`,
      "sameAs": Object.values(author.socials).filter(Boolean),
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${siteConfig.baseUrl}/#organization`,
      "name": siteConfig.name,
      "url": siteConfig.baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.baseUrl}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "proficiencyLevel": article.difficulty,
    "keywords": [article.primaryKeyword, ...article.secondaryKeywords].join(", "),
  };

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
      <ReadingProgressBar />
      <SchemaJsonLd schema={techArticleSchema} />
      {faqSchema && <SchemaJsonLd schema={faqSchema} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs
          crumbs={[
            { label: article.categoryName, href: `/category/${article.categorySlug}` },
            { label: article.headline, href: `/articles/${article.slug}` },
          ]}
        />

        {/* Article Masthead */}
        <header className="max-w-4xl mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Link
              href={`/category/${article.categorySlug}`}
              className="font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              {article.categoryName}
            </Link>
            <span>•</span>
            <span>{article.readingTimeMinutes} min read</span>
            <span>•</span>
            <span>
              Updated {new Date(article.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
            {article.excerpt}
          </p>

          {/* Author Byline */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <Link href={`/authors/${author.id}`} className="flex items-center gap-3 group">
              <img
                src={author.avatar}
                alt={author.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-blue-500 transition-all shadow-xs"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  {author.name}
                  <span className="text-[10px] text-slate-400 group-hover:text-blue-500 font-normal">↗</span>
                </p>
                <p className="text-[11px] text-slate-500">{author.role}</p>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
              <Link
                href={`/authors/${author.id}`}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Author Profile →
              </Link>
            </div>
          </div>

          {/* Editorial Verification & Testing Trust Box (Google E-E-A-T & Anti-HCU Shield) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                Tested &amp; Confirmed
              </span>
              <span className="hidden sm:inline">Tested on clean physical hardware and isolated virtual machines.</span>
              <span className="sm:hidden">Hardware &amp; VM tested.</span>
            </div>
            <Link
              href="/editorial-policy"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5 shrink-0"
            >
              Testing Protocol ↗
            </Link>
          </div>

          {/* Social Share Bar */}
          <ShareBar title={article.title} url={articleUrl} />
        </header>

        {/* Featured Cover Image */}
        <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 mb-12 shadow-sm bg-slate-100">
          <img
            src={article.coverImage}
            alt={article.title}
            width={1200}
            height={630}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content Layout with Sticky TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Body */}
          <article className="lg:col-span-8 space-y-6 text-slate-700 leading-relaxed font-sans">
            {/* Injected Article HTML with Integrated Mid-Article and Lower-Article Images */}
            {sections.part1 && (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: sections.part1 }}
              />
            )}

            {article.secondaryImage && (
              <figure className="my-10 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
                <img
                  src={article.secondaryImage.url}
                  alt={article.secondaryImage.alt}
                  width={1200}
                  height={630}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-72 sm:h-96 object-cover"
                />
                <figcaption className="p-3.5 text-xs text-slate-600 text-center border-t border-slate-200 bg-white">
                  {article.secondaryImage.caption}
                </figcaption>
              </figure>
            )}

            {sections.part2 && (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: sections.part2 }}
              />
            )}

            {article.tertiaryImage && sections.part3 && (
              <figure className="my-10 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
                <img
                  src={article.tertiaryImage.url}
                  alt={article.tertiaryImage.alt}
                  width={1200}
                  height={630}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-72 sm:h-96 object-cover"
                />
                <figcaption className="p-3.5 text-xs text-slate-600 text-center border-t border-slate-200 bg-white">
                  {article.tertiaryImage.caption}
                </figcaption>
              </figure>
            )}

            {sections.part3 && (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: sections.part3 }}
              />
            )}

            {/* Zero-Click AEO FAQ Accordion */}
            <FaqAccordion faqs={article.faqs} />

            {/* Author Profile Bio Footer */}
            <div className="my-10 p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition-colors shadow-xs">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <Link href={`/authors/${author.id}`} className="shrink-0">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 hover:border-blue-500 transition-all shadow-xs"
                  />
                </Link>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/authors/${author.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {author.name}
                    </Link>
                    <span className="text-xs text-slate-500">• {author.role}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {author.experienceYears}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {author.bio}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-blue-600">
                    <Link href={`/authors/${author.id}`} className="font-bold hover:underline flex items-center gap-1">
                      View Full Profile &amp; All Articles by {author.name} →
                    </Link>
                    {author.socials.linkedin && (
                      <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn ↗
                      </a>
                    )}
                    <Link href="/editorial-policy" className="text-slate-500 hover:text-slate-900">
                      Editorial Policy ↗
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Guides */}
            {relatedArticles.length > 0 && (
              <div className="mt-14 pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Recommended Follow-up Guides
                  </h3>
                  <Link
                    href={`/category/${article.categorySlug}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View Category Archive →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {relatedArticles.map((rel) => (
                    <article
                      key={rel.slug}
                      className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 publication-card shadow-xs overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-100 bg-slate-100">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <span className="text-[11px] font-mono text-slate-500 block">
                          {rel.readingTimeMinutes} min read • {rel.difficulty}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          <Link href={`/articles/${rel.slug}`}>
                            {rel.headline}
                          </Link>
                        </h4>
                      </div>
                    </article>
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
