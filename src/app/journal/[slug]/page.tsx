import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { journalArticles } from '@/data/journal';
import { ArrowLeft, Clock, Calendar, User, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return journalArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = journalArticles.find((a) => a.slug === slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | The Kitchen Journal`,
    description: article.excerpt,
  };
}

export default async function JournalArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = journalArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <Link
          href="/journal"
          className="inline-flex items-center text-xs text-[#6B5B52] hover:text-[#241611] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to All Journal Entries
        </Link>

        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638] block mb-2">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#241611] leading-tight">
          {article.title}
        </h1>
        <p className="text-sm sm:text-base text-[#6B5B52] font-light mt-2 leading-relaxed">
          {article.subtitle}
        </p>

        <div className="flex items-center space-x-4 py-4 mt-4 border-y border-[#E7DED4] text-xs text-[#8C7A70]">
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" /> {article.publishedDate}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" /> {article.readTime}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <User className="w-3.5 h-3.5 mr-1" /> {article.author}
          </span>
        </div>
      </div>

      <div className="relative aspect-16/10 w-full bg-[#F5EFEB] border border-[#E7DED4] overflow-hidden">
        <Image src={article.image} alt={article.title} fill priority className="object-cover" />
      </div>

      <div className="space-y-8 text-sm sm:text-base text-[#241611] leading-relaxed font-light">
        <p className="text-base sm:text-lg font-serif italic text-[#38241C] border-l-2 border-[#B35638] pl-4">
          &ldquo;{article.excerpt}&rdquo;
        </p>

        {article.content.map((section, idx) => (
          <div key={idx} className="space-y-3">
            {section.heading && (
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#241611] pt-4">
                {section.heading}
              </h2>
            )}
            <p className="text-xs sm:text-sm md:text-base text-[#4A3B32] leading-relaxed whitespace-pre-line">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-[#E7DED4] flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="text-xs bg-[#F5EFEB] border border-[#E7DED4] px-3 py-1 text-[#6B5B52]">
            #{tag}
          </span>
        ))}
      </div>

      <div className="bg-[#FAF7F2] border border-[#E7DED4] p-6 text-center space-y-3 mt-12">
        <h3 className="text-base font-serif font-semibold text-[#241611]">
          Explore Unpolished Chiru Dhanyalu & Cold-Ground Spices
        </h3>
        <p className="text-xs text-[#6B5B52]">
          Taste the difference that unadulterated harvesting brings to daily cooking.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-2.5 bg-[#241611] hover:bg-[#B35638] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <span>Visit Shop</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
