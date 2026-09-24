"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm">
                TW
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-base">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Core Silos */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial & E-E-A-T */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Editorial Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/editorial-policy" className="hover:text-blue-600 transition-colors">
                  Editorial & Fact-Checking Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About Our Editorial Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Editorial Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Updates */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              System Updates
            </h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Weekly articles on Linux, AWS, and enterprise data workflows. No spam.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="your.email@company.com"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-slate-800">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-800">Terms of Use</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-800">XML Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
