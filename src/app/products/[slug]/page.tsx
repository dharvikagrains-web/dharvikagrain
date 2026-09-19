'use client';

import React, { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/image';
import NextLink from 'next/link';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ShieldCheck,
  Truck,
  Heart,
  Plus,
  Minus,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  Compass,
  FileText,
  AlertCircle,
} from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeightSize, setSelectedWeightSize] = useState(product.weights[0].size);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'cooking' | 'quality' | 'nutrition' | 'batch'>('story');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentWeightOpt =
    product.weights.find((w) => w.size === selectedWeightSize) || product.weights[0];
  const discount = calculateDiscount(currentWeightOpt.price, currentWeightOpt.mrp);
  const inWishlist = isInWishlist(product.id);

  // Related products & recipes
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  const relatedRecipes = recipes
    .filter((r) => r.productSlug === product.slug || r.milletOrSpiceUsed.includes(product.name.split(' ')[0]))
    .slice(0, 2);

  const handleAddToCart = () => {
    addToCart(product, selectedWeightSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeightSize, quantity);
    router.push('/checkout');
  };

  return (
    <div className="pb-24 sm:pb-28">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-[#6B5B52] border-b border-[#E7DED4]">
        <NextLink href="/" className="hover:text-[#241611]">Home</NextLink>
        <span className="mx-2 text-[#C4924A]">/</span>
        <NextLink
          href={product.category === 'millets' ? '/millets' : '/spices'}
          className="hover:text-[#241611] capitalize"
        >
          {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Spices'}
        </NextLink>
        <span className="mx-2 text-[#C4924A]">/</span>
        <span className="text-[#241611] font-semibold">{product.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full bg-[#F5EFEB] border border-[#E7DED4] overflow-hidden">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-300"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-[#B35638] text-white text-xs font-bold uppercase tracking-wider px-3 py-1">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 bg-[#F5EFEB] border transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#241611] ring-1 ring-[#241611]'
                        : 'border-[#E7DED4] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Purchase Details */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Origin label */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="uppercase tracking-widest font-semibold text-[#B35638]">
                  {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Single-Origin Spice'}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center space-x-1 text-xs transition-colors ${
                    inWishlist ? 'text-[#B35638] font-semibold' : 'text-[#6B5B52] hover:text-[#241611]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
                </button>
              </div>

              {/* Title & Local Name */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[#241611] leading-tight">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-[#6B5B52] font-medium mt-1">
                {product.localName}
              </p>

              {/* Tagline / Short description */}
              <p className="text-xs sm:text-sm text-[#7A6B62] mt-3 leading-relaxed">
                {product.tagline}
              </p>

              {/* Price Row */}
              <div className="mt-5 pt-4 border-t border-[#E7DED4] flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-[#241611]">
                  {formatCurrency(currentWeightOpt.price)}
                </span>
                {currentWeightOpt.mrp > currentWeightOpt.price && (
                  <span className="text-base text-[#9E8E84] line-through">
                    {formatCurrency(currentWeightOpt.mrp)}
                  </span>
                )}
                <span className="text-xs text-[#8C7A70]">Inclusive of all taxes</span>
              </div>

              {/* Pack Size / Weight Selector */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#241611] uppercase tracking-wider">
                    Select Pack Size:
                  </span>
                  <span className="text-[#6B5B52]">Net Quantity: {currentWeightOpt.size}</span>
                </div>
                <div className="flex gap-3">
                  {product.weights.map((w) => (
                    <button
                      key={w.size}
                      type="button"
                      onClick={() => setSelectedWeightSize(w.size)}
                      className={`flex-1 py-3 px-4 border text-xs uppercase tracking-wider font-semibold transition-all text-center ${
                        selectedWeightSize === w.size
                          ? 'border-[#241611] bg-[#241611] text-white shadow-xs'
                          : 'border-[#E7DED4] bg-white text-[#241611] hover:border-[#241611]'
                      }`}
                    >
                      <span>{w.size}</span>
                      <span className="block text-[10px] mt-0.5 opacity-80">
                        {formatCurrency(w.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center space-x-4">
                <span className="text-xs font-semibold text-[#241611] uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#E7DED4] bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-[#6B5B52] hover:text-[#241611] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#241611] min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-[#6B5B52] hover:text-[#241611] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-4 px-6 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 border ${
                    addedAnimation
                      ? 'bg-[#274135] border-[#274135] text-white'
                      : 'bg-[#241611] border-[#241611] text-white hover:bg-[#B35638] hover:border-[#B35638]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-4 px-6 bg-[#B35638] hover:bg-[#9E462A] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-[#E7DED4] grid grid-cols-2 gap-4 text-xs text-[#6B5B52]">
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#B35638] flex-shrink-0 mt-0.5" />
                <span>100% Unpolished & Zero Additives</span>
              </div>
              <div className="flex items-start space-x-2">
                <Truck className="w-4 h-4 text-[#B35638] flex-shrink-0 mt-0.5" />
                <span>Free delivery on orders above ₹500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          DETAILED TABS & QUALITY INFORMATION
          ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border border-[#E7DED4] bg-white">
          {/* Tab Navigation Header */}
          <div className="flex border-b border-[#E7DED4] overflow-x-auto">
            <button
              onClick={() => setActiveTab('story')}
              className={`py-4 px-6 text-xs uppercase tracking-wider font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'story'
                  ? 'border-[#B35638] text-[#B35638] bg-[#FAF7F2]'
                  : 'border-transparent text-[#6B5B52] hover:text-[#241611]'
              }`}
            >
              Product Story & Origin
            </button>
            <button
              onClick={() => setActiveTab('cooking')}
              className={`py-4 px-6 text-xs uppercase tracking-wider font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'cooking'
                  ? 'border-[#B35638] text-[#B35638] bg-[#FAF7F2]'
                  : 'border-transparent text-[#6B5B52] hover:text-[#241611]'
              }`}
            >
              Cooking & Culinary Uses
            </button>
            <button
              onClick={() => setActiveTab('quality')}
              className={`py-4 px-6 text-xs uppercase tracking-wider font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'quality'
                  ? 'border-[#B35638] text-[#B35638] bg-[#FAF7F2]'
                  : 'border-transparent text-[#6B5B52] hover:text-[#241611]'
              }`}
            >
              Processing & Purity Checks
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`py-4 px-6 text-xs uppercase tracking-wider font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'nutrition'
                  ? 'border-[#B35638] text-[#B35638] bg-[#FAF7F2]'
                  : 'border-transparent text-[#6B5B52] hover:text-[#241611]'
              }`}
            >
              Nutrition & Ingredients
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`py-4 px-6 text-xs uppercase tracking-wider font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'batch'
                  ? 'border-[#B35638] text-[#B35638] bg-[#FAF7F2]'
                  : 'border-transparent text-[#6B5B52] hover:text-[#241611]'
              }`}
            >
              Batch & Packaging Details
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 sm:p-10 text-xs sm:text-sm text-[#241611] leading-relaxed">
            {/* Story Tab */}
            {activeTab === 'story' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-base font-serif font-semibold text-[#241611] mb-2">
                    About this Harvest
                  </h3>
                  <p className="text-[#6B5B52] leading-relaxed">{product.description}</p>
                </div>

                <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4] space-y-1">
                  <span className="text-xs font-semibold text-[#B35638] uppercase tracking-wider block">
                    Source & Farm Origin
                  </span>
                  <p className="text-xs text-[#241611] font-mono">{product.origin}</p>
                </div>

                {product.spiceProfile && (
                  <div className="space-y-2 pt-2 border-t border-[#F0E8DF]">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#241611]">
                      Spice Sensory Profile
                    </h4>
                    <p className="text-xs text-[#6B5B52]">
                      <strong>Aroma:</strong> {product.spiceProfile.aroma}
                    </p>
                    {product.spiceProfile.heatLevel && (
                      <p className="text-xs text-[#6B5B52]">
                        <strong>Heat Level:</strong> {product.spiceProfile.heatLevel}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {product.spiceProfile.keyFlavors.map((fl) => (
                        <span key={fl} className="bg-[#FAF7F2] border border-[#E7DED4] text-[11px] px-2.5 py-0.5">
                          {fl}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cooking Tab */}
            {activeTab === 'cooking' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-base font-serif font-semibold text-[#241611] mb-3">
                    Preparation & Cooking Method
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2 text-[#6B5B52]">
                    {product.cookingInstructions.map((step, idx) => (
                      <li key={idx} className="pl-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#241611] mb-2">
                    Everyday Culinary Applications
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-[#6B5B52]">
                    {product.culinaryUses.map((use, idx) => (
                      <li key={idx}>{use}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4]">
                  <span className="text-xs font-semibold text-[#241611] block mb-1">
                    Storage Guidelines
                  </span>
                  <p className="text-xs text-[#6B5B52]">{product.storage}</p>
                </div>
              </div>
            )}

            {/* Quality & Lab Tab */}
            {activeTab === 'quality' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-base font-serif font-semibold text-[#241611] mb-2">
                    Processing Protocols
                  </h3>
                  <p className="text-[#6B5B52] leading-relaxed">{product.processing}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4] space-y-2">
                    <div className="flex items-center space-x-2 text-[#B35638]">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Batch Lab Verification
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#6B5B52]">
                      {product.labTestPlaceholder}
                    </p>
                    <p className="text-[11px] text-[#8C7A70]">
                      Reports test for pesticide residue limits, moisture threshold, and foreign matter.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4] space-y-2">
                    <div className="flex items-center space-x-2 text-[#274135]">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Certification Status
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#6B5B52]">
                      {product.certificationsPlaceholder}
                    </p>
                    <p className="text-[11px] text-[#8C7A70]">
                      We do not publish unverified organic claims. Formal audit credentials display here.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-base font-serif font-semibold text-[#241611] mb-1">
                    Ingredients
                  </h3>
                  <p className="text-xs text-[#6B5B52] font-mono">
                    {product.ingredients.join(', ')}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-serif font-semibold text-[#241611] mb-3">
                    Nutrition Information ({product.nutrition.servingSize})
                  </h3>
                  <div className="border border-[#E7DED4] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] border-b border-[#E7DED4]">
                        <tr>
                          <th className="p-3 font-semibold text-[#241611]">Parameter</th>
                          <th className="p-3 font-semibold text-[#241611]">Approx. Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7DED4]">
                        <tr>
                          <td className="p-3 text-[#6B5B52]">Energy (Calories)</td>
                          <td className="p-3 font-medium text-[#241611]">{product.nutrition.energyKcal}</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[#6B5B52]">Protein</td>
                          <td className="p-3 font-medium text-[#241611]">{product.nutrition.protein}</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[#6B5B52]">Carbohydrates</td>
                          <td className="p-3 font-medium text-[#241611]">{product.nutrition.carbohydrates}</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[#6B5B52]">Dietary Fiber</td>
                          <td className="p-3 font-medium text-[#241611]">{product.nutrition.dietaryFiber}</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[#6B5B52]">Total Fat</td>
                          <td className="p-3 font-medium text-[#241611]">{product.nutrition.fat}</td>
                        </tr>
                        {product.nutrition.minerals && (
                          <tr>
                            <td className="p-3 text-[#6B5B52]">Key Micronutrients</td>
                            <td className="p-3 font-medium text-[#241611]">{product.nutrition.minerals}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-[#8C7A70] mt-2">
                    * Values derived from standard Indian food composition tables and verified batch analytics.
                  </p>
                </div>
              </div>
            )}

            {/* Batch Tab */}
            {activeTab === 'batch' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base font-serif font-semibold text-[#241611]">
                  Batch Traceability Structure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#E7DED4]">
                    <span className="text-[#6B5B52] block">Batch Series Code:</span>
                    <strong className="text-[#241611] font-mono">{product.batchInfo.batchPrefix}-XXXX-2026</strong>
                  </div>
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#E7DED4]">
                    <span className="text-[#6B5B52] block">Shelf Life:</span>
                    <strong className="text-[#241611]">{product.batchInfo.shelfLifeMonths} Months from Packaging</strong>
                  </div>
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#E7DED4]">
                    <span className="text-[#6B5B52] block">FSSAI Category:</span>
                    <strong className="text-[#241611]">{product.batchInfo.fssaiCategory}</strong>
                  </div>
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#E7DED4]">
                    <span className="text-[#6B5B52] block">Packaging Standard:</span>
                    <strong className="text-[#241611]">{product.batchInfo.packagingType}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Recipes Section */}
      {relatedRecipes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-6 border-b border-[#E7DED4] pb-3">
            <h2 className="text-xl font-serif font-semibold text-[#241611]">
              Recommended Recipes Using This Harvest
            </h2>
            <NextLink
              href="/recipes"
              className="text-xs font-semibold uppercase tracking-wider text-[#B35638] hover:underline"
            >
              All Recipes →
            </NextLink>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedRecipes.map((r) => (
              <NextLink
                key={r.id}
                href={`/recipes/${r.slug}`}
                className="group flex flex-col sm:flex-row bg-white border border-[#E7DED4] overflow-hidden hover:border-[#B35638] transition-colors"
              >
                <div className="relative w-full sm:w-40 h-40 bg-[#F5EFEB] flex-shrink-0">
                  <Image src={r.image} alt={r.title} fill className="object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B35638]">
                      {r.category}
                    </span>
                    <h3 className="text-sm font-semibold text-[#241611] group-hover:text-[#B35638] transition-colors mt-0.5">
                      {r.title}
                    </h3>
                    <p className="text-xs text-[#6B5B52] mt-1 line-clamp-2">{r.description}</p>
                  </div>
                  <div className="text-[11px] text-[#8C7A70] flex items-center space-x-3 mt-3">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {r.cookTime}
                    </span>
                    <span>•</span>
                    <span>{r.difficulty}</span>
                  </div>
                </div>
              </NextLink>
            ))}
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-xl font-serif font-semibold text-[#241611] mb-6 border-b border-[#E7DED4] pb-3">
            Pair With Traditional Grains & Spices
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          STICKY MOBILE ADD TO CART BAR
          ========================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E7DED4] p-3 shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#241611] truncate">{product.name}</p>
            <p className="text-xs font-bold text-[#B35638]">
              {formatCurrency(currentWeightOpt.price)}{' '}
              <span className="text-[10px] text-[#6B5B52] font-normal">/ {currentWeightOpt.size}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-6 py-3 bg-[#B35638] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#9E462A] transition-colors whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
