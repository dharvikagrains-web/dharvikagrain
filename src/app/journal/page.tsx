import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { journalArticles } from '@/data/journal';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Kitchen Journal | Notes on Chiru Dhanyalu, Sourcing & Spice Traditions',
  description:
    'Essays and kitchen guides on traditional unpolished millets, volatile oils in pure spices, water-to-grain ratios, and the heritage of Deccan cooking.',
};

export default function JournalIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          The Editorial Desk
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#241611]">
          The Kitchen Journal
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
          Thoughtful explorations into ancient grain agricultural ecology, the science of spice volatility,
          and practical cooking techniques for everyday Indian households.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
        {journalArticles.map((article) => (
          <Link
            key={article.id}
            href={`/journal/${article.slug}`}
            className="group bg-white border border-[#E2D9CE] rounded-[10px] sm:rounded-[12px] overflow-hidden hover:border-[#1A382B]/40 transition-all flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            <div className="relative aspect-16/10 w-full bg-[#FAF7F2] overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#1A382B] text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[4px]">
                {article.category}
              </span>
            </div>

            <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] sm:text-[11px] text-[#8C7A70] font-data">{article.publishedDate}</span>
                <h3 className="text-[13px] sm:text-lg font-serif font-semibold text-[#241611] group-hover:text-[#1A382B] transition-colors leading-snug mt-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#7A6B62] mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-3 sm:mt-6 pt-2 sm:pt-3 border-t border-[#F0E8DF] flex items-center justify-between text-[10px] sm:text-xs text-[#8C7A70]">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-[#1A382B]" /> {article.readTime}
                </span>
                <span className="font-semibold text-[#1A382B] group-hover:text-[#9E462A] flex items-center">
                  <span>Read</span> <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5 sm:ml-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
