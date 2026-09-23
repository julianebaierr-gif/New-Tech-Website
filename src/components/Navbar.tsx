import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs group-hover:bg-blue-600 transition-colors">
                SJ
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-lg group-hover:text-blue-600 transition-colors">
                  {siteConfig.name}
                </span>
                <span className="hidden lg:block text-[11px] text-slate-500 font-sans tracking-normal -mt-0.5">
                  Systems &amp; Automation
                </span>
              </div>
            </Link>
          </div>

          {/* Core Categories with soft pills */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {siteConfig.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-md transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

        </div>
      </div>
    </header>
  );
}
