"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { BrandLogo } from "@/components/BrandLogo";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Desktop Core Categories */}
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Home
          </Link>
          <div className="pt-2 pb-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Categories
          </div>
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col space-y-1">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              About Our Standards
            </Link>
            <Link
              href="/editorial-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Editorial Policy
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Contact Editorial Desk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
