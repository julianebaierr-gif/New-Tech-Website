"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm">
                SJ
              </div>
              <span className="font-bold text-white tracking-tight text-base">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>ISSN 2994-1802</span>
              <span>•</span>
              <span className="text-emerald-500">Peer-Reviewed</span>
            </div>
          </div>

          {/* Core Silos */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">
              Knowledge Silos
            </h4>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial & E-E-A-T */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">
              Editorial Governance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/editorial-policy" className="hover:text-blue-400 transition-colors">
                  Editorial & Fact-Checking Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  Staff Authors & Engineers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Submit Technical Correction
                </Link>
              </li>
              <li>
                <span className="text-slate-600 cursor-not-allowed">
                  Sponsored Post Guidelines (Closed)
                </span>
              </li>
            </ul>
          </div>

          {/* Trust Guarantee & Newsletter */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">
              Engineering Dispatch
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Get our weekly deep-dive into cloud cost regressions, Linux performance profiling, and enterprise automation scripts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="devops@company.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs py-2 rounded-md transition-colors"
              >
                Subscribe to Dispatch
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-400">XML Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
