"use client";

import { useState } from "react";
import { FaqItem } from "@/data/articles";

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="my-12 p-6 bg-surface/90 border border-slate-800 rounded-2xl">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-400 font-mono text-xs">
          FAQ
        </span>
        <h3 className="text-xl font-bold text-white tracking-tight">
          Frequently Asked Questions
        </h3>
      </div>
      <div className="divide-y divide-slate-800/80">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="py-4">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors gap-4"
              >
                <span>{faq.question}</span>
                <span className="text-slate-500 font-mono text-lg shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <p className="mt-3 text-sm text-slate-400 leading-relaxed pr-6 animate-fadeIn">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
