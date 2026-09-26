import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { getArticlesByAuthor } from "@/data/articles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

interface AuthorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return siteConfig.authors.map((author) => ({
    id: author.id,
  }));
}

const authorMetaMap: Record<string, { title: string; desc: string }> = {
  "sarah-blake": {
    title: "Sarah Blake | Excel and Data Workflow | TechOps Wire",
    desc: "Sarah Blake is a data operations analyst with 3+ years designing automated reporting workbooks, dynamic financial models, and clean spreadsheet workflows.",
  },
  "evan-mitchell": {
    title: "Evan Mitchell | Cloud Systems Admin | TechOps Wire",
    desc: "Evan Mitchell is a cloud systems administrator with 3+ years configuring Linux clusters, AWS EC2 instances, and Docker containers in enterprise networks.",
  },
};

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  const author = siteConfig.authors.find((a) => a.id === id);

  if (!author) {
    return {
      title: "Author Not Found | TechOps Wire",
    };
  }

  const meta = authorMetaMap[author.id] || {
    title: `${author.name} | ${author.role} | ${siteConfig.name}`,
    desc: author.bio,
  };

  const authorUrl = `${siteConfig.baseUrl}/authors/${author.id}`;

  return {
    title: {
      absolute: meta.title,
    },
    description: meta.desc,
    alternates: {
      canonical: authorUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: authorUrl,
      type: "profile",
      images: [
        {
          url: `${siteConfig.baseUrl}${author.avatar}`,
          width: 400,
          height: 400,
          alt: author.name,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.desc,
      images: [`${siteConfig.baseUrl}${author.avatar}`],
    },
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { id } = await params;
  const author = siteConfig.authors.find((a) => a.id === id);

  if (!author) {
    notFound();
  }

  const authorArticles = getArticlesByAuthor(author.id);
  const authorUrl = `${siteConfig.baseUrl}/authors/${author.id}`;

  // Google E-E-A-T Person & ProfilePage Schema
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "@id": `${authorUrl}#person`,
      "name": author.name,
      "jobTitle": author.role,
      "description": author.fullBio || author.bio,
      "image": `${siteConfig.baseUrl}${author.avatar}`,
      "url": authorUrl,
      "worksFor": {
        "@type": "Organization",
        "@id": `${siteConfig.baseUrl}/#organization`,
        "name": siteConfig.name,
        "url": siteConfig.baseUrl,
      },
      "knowsAbout": author.skills,
      "sameAs": Object.values(author.socials).filter(Boolean),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SchemaJsonLd schema={profileSchema} />
      
      <Breadcrumbs
        crumbs={[
          { label: "About", href: "/about" },
          { label: "Authors", href: "/about" },
          { label: author.name, href: `/authors/${author.id}` },
        ]}
      />

      {/* Author Profile Hero Card */}
      <div className="mt-6 p-6 sm:p-10 rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-100">
          <div className="relative shrink-0">
            <img
              src={author.avatar}
              alt={author.name}
              width={112}
              height={112}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-200 shadow-sm"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white" title="Staff Writer">
              ✓
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                Staff Writer
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                {author.experienceYears}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {author.name}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-blue-700">
              {author.role}
            </p>
            <p className="text-xs text-slate-500">
              📍 {author.location} • Contributing Writer &amp; Systems Tester at TechOps Wire
            </p>
          </div>
        </div>

        {/* Detailed Bio & Background */}
        <div className="py-8 space-y-6 border-b border-slate-100">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About {author.name}</h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {author.fullBio || author.bio}
            </p>
          </div>

          {/* Core Competencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Core Competencies &amp; Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {author.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {author.certifications && author.certifications.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Industry Certifications &amp; Credentials
              </h3>
              <div className="flex flex-wrap gap-2">
                {author.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100"
                  >
                    <span>🛡️</span>
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Public Profiles */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Public Profiles &amp; Links
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-600">
              {author.socials.linkedin && (
                <a
                  href={author.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  LinkedIn Profile ↗
                </a>
              )}
              {author.socials.github && (
                <a
                  href={author.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  GitHub Profile ↗
                </a>
              )}
              {author.socials.twitter && (
                <a
                  href={author.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  Twitter / X ↗
                </a>
              )}
              <Link
                href="/editorial-policy"
                className="text-slate-500 hover:text-slate-900"
              >
                Editorial Standards ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial Promise */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            🛡️ All tutorials authored by {author.name} undergo hands-on verification on clean test machines and live spreadsheets before release.
          </p>
          <Link
            href="/contact"
            className="font-semibold text-blue-600 hover:underline shrink-0"
          >
            Report an Error / Ask a Question →
          </Link>
        </div>
      </div>

      {/* Articles Published by this Author */}
      <div className="mt-14 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Guides Authored by {author.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {authorArticles.length} tested practical tutorials
            </p>
          </div>
        </div>

        {authorArticles.length === 0 ? (
          <p className="text-sm text-slate-500 py-8">
            No articles published yet under this author profile.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorArticles.map((art) => (
              <article
                key={art.slug}
                className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 publication-card shadow-xs overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      width={600}
                      height={375}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
                        {art.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                      <span>{art.readingTimeMinutes} min read</span>
                      <span>•</span>
                      <span>{art.difficulty}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/articles/${art.slug}`}>
                        {art.headline}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(art.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Link
                      href={`/articles/${art.slug}`}
                      className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
                    >
                      Read Tutorial →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
