'use client';

import React, { useState } from 'react';
import { faqItems } from '@/data/faqs';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-4']);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Sourcing & Quality',
    'Millets & Preparation',
    'Spices & Storage',
    'Shipping & Orders',
  ];

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = activeCategory === 'All'
    ? faqItems
    : faqItems.filter((f) => f.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          Kitchen Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#241611]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] max-w-xl mx-auto leading-relaxed">
          Everything you need to know about preparing unpolished Chiru Dhanyalu, storing volatile spices,
          and our farm-to-home quality protocols.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-2 border-b border-[#E7DED4]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-[#241611] text-white'
                : 'bg-white text-[#6B5B52] hover:bg-[#F5EFEB] border border-[#E7DED4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="bg-white border border-[#E7DED4] transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between space-x-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#B35638] block mb-1">
                    {faq.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-serif font-semibold text-[#241611]">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#6B5B52] transform transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-[#B35638]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#6B5B52] leading-relaxed border-t border-[#F0E8DF] pt-4">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-[#F5EFEB] border border-[#E7DED4] p-8 text-center space-y-3">
        <MessageSquare className="w-8 h-8 text-[#B35638] mx-auto" />
        <h3 className="text-base font-serif font-semibold text-[#241611]">
          Still have a question about cooking or batches?
        </h3>
        <p className="text-xs text-[#6B5B52] max-w-md mx-auto">
          Our culinary and sourcing team will be happy to talk about cooking ratios and purity tests.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 bg-[#241611] hover:bg-[#B35638] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
