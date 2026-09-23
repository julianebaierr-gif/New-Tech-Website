import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Clean Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
                SJ
              </div>
              <div>
                <span className="font-bold text-slate-900 tracking-tight text-lg group-hover:text-blue-600 transition-colors">
                  {siteConfig.name}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Silos */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {siteConfig.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Actions & Trust Badges */}
          <div className="flex items-center gap-3">
            <Link
              href="/editorial-policy"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-full transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Editorial Standards
            </Link>
            <Link
              href="/about"
              className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-md transition-all shadow-sm"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
