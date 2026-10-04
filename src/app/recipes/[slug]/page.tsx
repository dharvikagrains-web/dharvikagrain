import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { recipes } from '@/data/recipes';
import { products } from '@/data/products';
import { Clock, Users, ChefHat, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = recipes.find((r) => r.slug === slug);
  if (!recipe) return { title: 'Recipe Not Found' };

  return {
    title: `${recipe.title} Recipe | Traditional Chiru Dhanyalu`,
    description: recipe.description,
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = recipes.find((r) => r.slug === slug);

  if (!recipe) {
    notFound();
  }

  const linkedProduct = products.find((p) => p.slug === recipe.productSlug);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div>
        <Link
          href="/recipes"
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EDE9E1] border border-[#D5CDBD] text-xs font-semibold text-[#0D3522] hover:bg-[#0D3522] hover:text-white transition-all mb-6 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to All Recipes
        </Link>

        <span className="inline-block px-3 py-0.5 rounded-full bg-[#EDE9E1] border border-[#D5CDBD] text-[11px] font-semibold text-[#0D3522] uppercase tracking-wider mb-2">
          ✦ {recipe.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#241611] leading-tight">
          {recipe.title}
        </h1>
        {recipe.localName && (
          <p className="text-base font-semibold text-[#0D3522] mt-1">{recipe.localName}</p>
        )}
        <p className="text-xs sm:text-sm text-[#6B5B52] mt-3 leading-relaxed">
          {recipe.description}
        </p>

        {/* Recipe Meta Pill Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mt-6 rounded-[24px] bg-[#EDE9E1] border border-[#D5CDBD] text-xs text-[#6B5B52] shadow-2xs">
          <div>
            <span className="text-[#8C7A70] block text-[10px] uppercase font-semibold">Prep Time</span>
            <strong className="text-[#241611] font-serif text-sm">{recipe.prepTime}</strong>
          </div>
          <div className="h-6 w-px bg-[#D5CDBD]" />
          <div>
            <span className="text-[#8C7A70] block text-[10px] uppercase font-semibold">Cook Time</span>
            <strong className="text-[#0D3522] font-serif text-sm">{recipe.cookTime}</strong>
          </div>
          <div className="h-6 w-px bg-[#D5CDBD]" />
          <div>
            <span className="text-[#8C7A70] block text-[10px] uppercase font-semibold">Servings</span>
            <strong className="text-[#241611] font-serif text-sm">{recipe.servings}</strong>
          </div>
          <div className="h-6 w-px bg-[#D5CDBD]" />
          <div>
            <span className="text-[#8C7A70] block text-[10px] uppercase font-semibold">Difficulty</span>
            <strong className="text-[#C4924A] font-semibold text-xs">{recipe.difficulty}</strong>
          </div>
        </div>
      </div>

      {/* Main Recipe Image Stage */}
      <div className="relative aspect-16/9 w-full rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] p-3 sm:p-4 overflow-hidden shadow-xs">
        <div className="relative w-full h-full rounded-[20px] sm:rounded-[28px] overflow-hidden">
          <Image src={recipe.image} alt={recipe.title} fill priority className="object-cover" />
        </div>
      </div>

      {/* Linked Product Banner */}
      {linkedProduct && (
        <div className="rounded-[28px] bg-[#EDE9E1] border border-[#D5CDBD] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/80 border border-[#D5CDBD] text-[10px] uppercase tracking-wider font-semibold text-[#0D3522]">
              ✦ Recommended Harvest
            </span>
            <h3 className="text-lg font-serif font-bold text-[#241611] mt-1">
              {linkedProduct.name} ({linkedProduct.localName})
            </h3>
            <p className="text-xs text-[#6B5B52] max-w-lg">{linkedProduct.shortDescription}</p>
          </div>
          <Link
            href={`/products/${linkedProduct.slug}`}
            className="px-6 py-3 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm whitespace-nowrap self-start sm:self-auto"
          >
            Order Provisions →
          </Link>
        </div>
      )}

      {/* Ingredients & Instructions Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-5 rounded-[28px] bg-[#EDE9E1] border border-[#D5CDBD] p-6 sm:p-8 space-y-4 shadow-xs self-start">
          <h2 className="text-xl font-serif font-bold text-[#241611] pb-3 border-b border-[#D5CDBD]">
            Ingredients
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#6B5B52]">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D3522] mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {recipe.pairingTips && (
            <div className="p-4 rounded-[20px] bg-white/80 border border-[#D5CDBD] text-xs space-y-1 mt-6">
              <strong className="text-[#0D3522] block font-serif">Serving Suggestion:</strong>
              <p className="text-[#6B5B52] leading-relaxed">{recipe.pairingTips}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="md:col-span-7 rounded-[28px] bg-white/80 border border-[#D5CDBD] p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-xl font-serif font-bold text-[#241611] pb-3 border-b border-[#D5CDBD]">
            Step-by-Step Instructions
          </h2>
          <ol className="space-y-5 text-xs sm:text-sm text-[#241611]">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-3.5">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0D3522] text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                  {idx + 1}
                </span>
                <span className="text-[#6B5B52] leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
