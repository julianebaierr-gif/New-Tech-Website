"use client";

import { useEffect, useState } from "react";
import { TocItem } from "@/data/articles";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -60% 0%" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 sticky top-24 shadow-xs">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200">
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Contents
        </h4>
      </div>
      <nav className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-xs py-1.5 px-2.5 rounded transition-all leading-snug ${
                isActive
                  ? "bg-blue-100 text-blue-800 font-semibold border-l-2 border-blue-600 pl-2"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {item.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
