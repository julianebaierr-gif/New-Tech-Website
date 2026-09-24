import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6 font-mono text-xl font-bold border border-blue-100">
        404
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
        Page Not Found
      </h1>
      
      <p className="text-slate-600 max-w-lg mx-auto text-base leading-relaxed mb-10">
        The page or reference you are looking for has been moved or updated. Review our primary content sections below.
      </p>

      {/* Category Silos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
        {siteConfig.categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs transition-all group"
          >
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
              {cat.name} →
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {cat.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          Return to Homepage
        </Link>
        <Link
          href="/about"
          className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          About Our Standards
        </Link>
      </div>
    </div>
  );
}
