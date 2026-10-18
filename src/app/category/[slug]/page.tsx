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

const categoryMetaMap: Record<string, { title: string; desc: string }> = {
  "data-excel-automation": {
    title: "Excel Formulas and Data Cleaning Steps | TechOps Wire",
    desc: "Browse practical Excel tutorials, dynamic array formulas, drop-down validation menus, and reliable spreadsheet data cleaning steps tested by specialists.",
  },
  "cloud-infrastructure": {
    title: "Cloud Infrastructure and Linux Setups | TechOps Wire",
    desc: "Browse hands-on Linux administration tutorials, AWS EC2 compute sizing roadmaps, and Docker container networking setups tested on live server deployments.",
  },
  "ai-developer-tools": {
    title: "AI Developer Tools and API Token Specs | TechOps Wire",
    desc: "Practical developer references covering large language model token contexts, file upload constraints, API response speeds, and production AI utilities.",
  },
  "os-systems": {
    title: "Operating Systems and Server Migration | TechOps Wire",
    desc: "Practical operating system manuals covering Windows 11 settings, Linux octal permissions, and structured Windows Server upgrade and migration roadmaps.",
  },
};

const categoryHubDetails: Record<string, {
  heading: string;
  sub1: string;
  p1: string;
  sub2: string;
  p2: string;
  sub3: string;
  p3: string;
}> = {
  "data-excel-automation": {
    heading: "Spreadsheet Operations and Formula Auditing Standards",
    sub1: "Workbook Hygiene and Data Integrity",
    p1: "Spreadsheets serve as critical operational backbones in finance, inventory management, and business intelligence. Hidden duplicate rows, broken lookup formulas, and manual entry errors frequently cost organizations hours of remediation. Our tutorials emphasize non-destructive data cleaning methods, dynamic array functions such as UNIQUE and FILTER, and data validation interfaces.",
    sub2: "Formula Execution and Error Handling",
    p2: "Each spreadsheet technique published on TechOps Wire is validated across current versions of Microsoft Excel and Google Sheets. We test formulas on datasets exceeding 50,000 rows to measure calculation overhead, ensuring proposed solutions do not cause worksheet freeze or performance bottlenecks. Our tutorials prioritize clear syntax, maintainable cell references, and error-trapping patterns.",
    sub3: "Lab Validation Protocol",
    p3: "Workbooks are evaluated in isolated test environments with formula auditing enabled. We examine volatile calculations, circular dependencies, and cross-sheet references to ensure long-term stability in shared corporate folders."
  },
  "cloud-infrastructure": {
    heading: "Infrastructure Architecture and Server Testing Standards",
    sub1: "Cloud Compute and Cost Governance",
    p1: "Operating cloud workloads requires balancing compute capacity with monthly financial constraints. Selecting oversized virtual machines wastes capital, while underprovisioned hosts cause memory exhaustion and connection drops. Our cloud infrastructure tutorials analyze compute families, memory-to-vCPU ratios, and predictable provisioning workflows across Amazon Web Services and hybrid environments.",
    sub2: "Container Architecture and Linux Administration",
    p2: "All Linux server commands, container networking configurations, and permission scripts are tested on clean Debian and Ubuntu LTS installations before release. We check bridge network routing, persistent volume bindings, and permission modes in isolated virtual machines. We never advise blind execution of elevated root permissions without explaining the exact security trade-offs involved.",
    sub3: "Network Routing and Resilience",
    p3: "Network configurations are validated using packet capture tools, simulated high-latency connections, and failover drills. Our tutorials verify firewall rules, subnet boundaries, and port mappings under realistic production traffic loads."
  },
  "ai-developer-tools": {
    heading: "Developer Workflows and Language Model Execution",
    sub1: "Context Window Limits and Document Processing",
    p1: "Current generative models and developer utilities offer powerful automation, but practical adoption requires understanding strict constraints. Context token ceilings, file upload parsers, and API latency dictate whether an automated workflow succeeds or fails in production. Our manuals outline concrete boundaries for spreadsheet ingestion, code analysis, and large document processing.",
    sub2: "Latency Diagnostics and API Reliability",
    p2: "When developer utilities lag, diagnosing the exact bottleneck prevents wasted troubleshooting cycles. We test model response times across peak server hours, evaluate local browser caching issues, and compare API response metrics against web interfaces. Every tutorial provides reproducible diagnostic steps and alternative routing strategies for developers.",
    sub3: "Token Economy and Rate Limits",
    p3: "Benchmarking tests measure payload size against token limits and monthly API expenses. We analyze streaming responses, timeout handling, and request retries to help engineers deploy dependable automation without surprise cost spikes."
  },
  "os-systems": {
    heading: "Operating System Security and Lifecycle Roadmaps",
    sub1: "Enterprise OS Configuration and Hardening",
    p1: "Desktop and server operating systems form the foundation of enterprise device fleets. Properly managing BitLocker encryption, Remote Desktop gateway policies, and granular octal permissions protects corporate data from unauthorized exfiltration. Our step-by-step instructions focus on administrative efficiency without bypassing security controls.",
    sub2: "Server Lifecycle Planning and Migration",
    p2: "Legacy infrastructure phase-outs, including operating system end-of-support deadlines, require structured migration plans to prevent unexpected compliance failures. We construct phased upgrade schedules covering hardware inventory, backup verification, and parallel virtualization strategies to ensure zero unplanned downtime during server cutovers.",
    sub3: "Hardware Compatibility and Rollback Safeguards",
    p3: "Before documenting server upgrades, our team tests bare-metal installations and hypervisor snapshots. We verify backup images, driver compatibility matrices, and automated restore procedures to guarantee rollback capability if an in-place upgrade stalls."
  }
};


export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = siteConfig.categories.find((c) => c.slug === slug);

  if (!category) return {};

  const meta = categoryMetaMap[slug] || {
    title: `${category.name} Articles | ${siteConfig.name}`,
    desc: category.description,
  };

  const url = `${siteConfig.baseUrl}/category/${category.slug}`;

  return {
    title: {
      absolute: meta.title,
    },
    description: meta.desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.desc,
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
  const hubDetails = categoryHubDetails[category.slug];

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
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Published Practical Manuals in {category.name}
            </h2>
          </div>

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
                      width={800}
                      height={500}
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
                        width={20}
                        height={20}
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
        </div>
      )}

      {/* Topic Overview and Testing Standards */}
      {hubDetails && (
        <section className="mt-16 pt-10 border-t border-slate-200">
          <div className="max-w-4xl space-y-6">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                E-E-A-T Testing Methodology
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
                {hubDetails.heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">{hubDetails.sub1}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{hubDetails.p1}</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">{hubDetails.sub2}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{hubDetails.p2}</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">{hubDetails.sub3}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{hubDetails.p3}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
