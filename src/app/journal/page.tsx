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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {journalArticles.map((article) => (
          <Link
            key={article.id}
            href={`/journal/${article.slug}`}
            className="group bg-white border border-[#E7DED4] hover:border-[#B35638] transition-all flex flex-col h-full"
          >
            <div className="relative aspect-16/10 w-full bg-[#F5EFEB] overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#241611] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1">
                {article.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#8C7A70]">{article.publishedDate}</span>
                <h3 className="text-lg font-serif font-semibold text-[#241611] group-hover:text-[#B35638] transition-colors leading-snug mt-1">
                  {article.title}
                </h3>
                <p className="text-xs text-[#7A6B62] mt-2 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#F0E8DF] flex items-center justify-between text-xs text-[#8C7A70]">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {article.readTime}
                </span>
                <span className="font-semibold text-[#241611] group-hover:text-[#B35638] flex items-center">
                  Read Article <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
