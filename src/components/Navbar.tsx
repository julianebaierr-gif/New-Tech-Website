import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-base shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                SJ
              </div>
              <div>
                <span className="font-bold text-white tracking-tight text-lg group-hover:text-blue-400 transition-colors">
                  {siteConfig.name}
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  v2026.1
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
                className="px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Actions & Trust Badges */}
          <div className="flex items-center gap-3">
            <Link
              href="/editorial-policy"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-3 py-1.5 rounded-full transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Editorial Standards
            </Link>
            <Link
              href="/about"
              className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-md transition-all shadow-md shadow-blue-600/20"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
