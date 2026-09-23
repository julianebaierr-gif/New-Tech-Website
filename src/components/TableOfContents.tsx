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
    <div className="bg-surface/80 border border-slate-800 rounded-xl p-5 sticky top-24 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800/80">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
          Table of Contents
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
                  ? "bg-blue-600/15 text-blue-400 font-medium border-l-2 border-blue-500 pl-2"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
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
