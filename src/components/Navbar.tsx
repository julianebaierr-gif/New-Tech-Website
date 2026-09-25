import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { BrandLogo } from "@/components/BrandLogo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group inline-flex items-center">
              <BrandLogo size="md" showTagline={true} />
            </Link>
          </div>

          {/* Core Categories with soft pills */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <Link
              href="/"
              className="px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-md transition-all"
            >
              Home
            </Link>
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
