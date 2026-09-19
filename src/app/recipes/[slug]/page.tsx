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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div>
        <Link
          href="/recipes"
          className="inline-flex items-center text-xs text-[#6B5B52] hover:text-[#241611] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to All Recipes
        </Link>

        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638] block mb-2">
          {recipe.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#241611] leading-tight">
          {recipe.title}
        </h1>
        {recipe.localName && (
          <p className="text-base text-[#6B5B52] font-medium mt-1">{recipe.localName}</p>
        )}
        <p className="text-xs sm:text-sm text-[#7A6B62] mt-3 leading-relaxed">
          {recipe.description}
        </p>

        {/* Recipe Meta Pill Strip */}
        <div className="flex flex-wrap items-center gap-6 py-4 mt-4 border-y border-[#E7DED4] text-xs text-[#6B5B52]">
          <div>
            <span className="text-[#8C7A70] block text-[10px] uppercase">Prep Time</span>
            <strong className="text-[#241611]">{recipe.prepTime}</strong>
          </div>
          <div className="h-6 w-px bg-[#E7DED4]" />
          <div>
            <span className="text-[#8C7A70] block text-[10px] uppercase">Cook Time</span>
            <strong className="text-[#241611]">{recipe.cookTime}</strong>
          </div>
          <div className="h-6 w-px bg-[#E7DED4]" />
          <div>
            <span className="text-[#8C7A70] block text-[10px] uppercase">Servings</span>
            <strong className="text-[#241611]">{recipe.servings}</strong>
          </div>
          <div className="h-6 w-px bg-[#E7DED4]" />
          <div>
            <span className="text-[#8C7A70] block text-[10px] uppercase">Difficulty</span>
            <strong className="text-[#B35638]">{recipe.difficulty}</strong>
          </div>
        </div>
      </div>

      {/* Main Recipe Image */}
      <div className="relative aspect-16/9 w-full bg-[#F5EFEB] border border-[#E7DED4] overflow-hidden">
        <Image src={recipe.image} alt={recipe.title} fill priority className="object-cover" />
      </div>

      {/* Linked Product Banner */}
      {linkedProduct && (
        <div className="bg-[#F5EFEB] border border-[#E7DED4] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#B35638]">
              Cook with the authentic harvest
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-[#241611]">
              {linkedProduct.name} ({linkedProduct.localName})
            </h3>
            <p className="text-xs text-[#6B5B52]">{linkedProduct.shortDescription}</p>
          </div>
          <Link
            href={`/products/${linkedProduct.slug}`}
            className="px-5 py-2.5 bg-[#241611] hover:bg-[#B35638] text-white text-xs uppercase tracking-wider font-semibold transition-colors whitespace-nowrap"
          >
            Order Millet / Spices
          </Link>
        </div>
      )}

      {/* Ingredients & Instructions Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Ingredients */}
        <div className="md:col-span-5 space-y-4">
          <h2 className="text-lg font-serif font-semibold text-[#241611] pb-2 border-b border-[#E7DED4]">
            Ingredients
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-[#6B5B52]">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-[#B35638] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {recipe.pairingTips && (
            <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4] text-xs space-y-1 mt-6">
              <strong className="text-[#241611] block">Serving Suggestion:</strong>
              <p className="text-[#6B5B52]">{recipe.pairingTips}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-lg font-serif font-semibold text-[#241611] pb-2 border-b border-[#E7DED4]">
            Step-by-Step Instructions
          </h2>
          <ol className="space-y-4 text-xs sm:text-sm text-[#241611]">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#E7DED4] text-xs font-bold text-[#B35638] flex items-center justify-center mt-0.5">
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
