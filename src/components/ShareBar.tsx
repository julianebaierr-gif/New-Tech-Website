"use client";

import { useState } from "react";

interface ShareBarProps {
  title: string;
  url: string;
}

export function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2 py-4 border-y border-slate-100 my-6 text-xs text-slate-500 font-mono">
      <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] mr-1">
        Share:
      </span>
      <button
        onClick={handleCopy}
        className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-all font-sans text-xs flex items-center gap-1.5 shadow-2xs"
      >
        {copied ? (
          <>
            <span className="text-emerald-600 font-bold">✓</span> Copied Link
          </>
        ) : (
          <>
            <span>🔗</span> Copy Link
          </>
        )}
      </button>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-all font-sans text-xs shadow-2xs"
      >
        Post on X ↗
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-all font-sans text-xs shadow-2xs"
      >
        LinkedIn ↗
      </a>
    </div>
  );
}
