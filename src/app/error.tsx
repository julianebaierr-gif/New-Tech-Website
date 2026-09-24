"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mb-6 font-mono text-lg font-bold border border-amber-200">
        !
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        Unexpected System Exception
      </h2>
      <p className="text-slate-600 text-sm mb-8">
        An unexpected error occurred while rendering this page resource. You can try refreshing the view or navigate back to the home directory.
      </p>
      <div className="flex items-center justify-center gap-4 text-xs font-semibold">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
