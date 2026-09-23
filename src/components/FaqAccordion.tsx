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
    <div className="my-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="px-2 py-0.5 bg-blue-100 border border-blue-200 rounded text-blue-800 font-mono text-xs font-semibold">
          FAQ
        </span>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h3>
      </div>
      <div className="divide-y divide-slate-200">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="py-3.5">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors gap-4"
              >
                <span>{faq.question}</span>
                <span className="text-slate-400 font-mono text-base shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed pr-6 animate-fadeIn">
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
