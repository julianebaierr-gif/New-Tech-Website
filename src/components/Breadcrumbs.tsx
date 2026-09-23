import Link from "next/link";
import { SchemaJsonLd } from "./SchemaJsonLd";
import { siteConfig } from "@/lib/siteConfig";

export interface BreadcrumbCrumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: BreadcrumbCrumb[] }) {
  const baseUrl = siteConfig.baseUrl;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      ...crumbs.map((c, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": c.label,
        "item": `${baseUrl}${c.href}`,
      })),
    ],
  };

  return (
    <>
      <SchemaJsonLd schema={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <div key={c.href} className="flex items-center space-x-2">
              <span className="text-slate-600">/</span>
              {isLast ? (
                <span className="text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-white transition-colors">
                  {c.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
