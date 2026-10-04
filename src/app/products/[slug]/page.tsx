'use client';

import React, { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import NextLink from 'next/link';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { batchRecords } from '@/data/batches';
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
  ArrowRight,
  Clock,
  FileText,
  Download,
  X,
  CheckCircle2,
  Star,
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
  const [activeTab, setActiveTab] = useState<'story' | 'cooking' | 'quality' | 'nutrition' | 'batch' | 'reviews'>('story');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Batch traceability integration
  const matchingBatches = batchRecords.filter((b) => b.productId === product.id);
  const [selectedBatchNumber, setSelectedBatchNumber] = useState<string>(
    matchingBatches[0]?.batchNumber || 'B001'
  );
  const [showCoAAnalysisModal, setShowCoAAnalysisModal] = useState<boolean>(false);
  const activeBatch =
    matchingBatches.find((b) => b.batchNumber === selectedBatchNumber) || matchingBatches[0];

  const currentWeightOpt =
    product.weights.find((w) => w.size === selectedWeightSize) || product.weights[0];
  const discount = calculateDiscount(currentWeightOpt.price, currentWeightOpt.mrp);
  const inWishlist = isInWishlist(product.id);

  // Related products & recipes
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
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
    <div className="pb-24 sm:pb-28 bg-[#FAF7F2] text-[#221814]">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-[12px] text-[#685950] border-b border-[#E2D9CE] font-data">
        <NextLink href="/" className="hover:text-[#1A382B]">Home</NextLink>
        <span className="mx-2 text-[#C4924A]">/</span>
        <NextLink
          href={product.category === 'millets' ? '/millets' : '/spices'}
          className="hover:text-[#1A382B] capitalize"
        >
          {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Spices'}
        </NextLink>
        <span className="mx-2 text-[#C4924A]">/</span>
        <span className="text-[#221814] font-medium">{product.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-[12px] bg-white border border-[#E2D9CE] p-4 overflow-hidden flex items-center justify-center shadow-2xs">
              <div className="relative w-full h-full rounded-[8px] overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-all duration-300"
                />
              </div>

              {discount > 0 && (
                <span className="absolute top-6 left-6 rounded-[4px] bg-[#9E462A] text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-18 h-18 rounded-[8px] overflow-hidden bg-white border transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#1A382B] ring-1 ring-[#1A382B]'
                        : 'border-[#E2D9CE] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Purchase Details */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Wishlist Header */}
              <div className="flex items-center justify-between text-[12px] mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] bg-white border border-[#E2D9CE] text-[11px] font-semibold text-[#1A382B] uppercase tracking-wider font-data">
                  {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Single-Origin Spice'}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-[12px] transition-colors border ${
                    inWishlist
                      ? 'border-[#9E462A] bg-[#FBEFEA] text-[#9E462A] font-semibold'
                      : 'border-[#E2D9CE] bg-white text-[#685950] hover:text-[#221814]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Title & Regional Telugu Name */}
              <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#221814] leading-tight">
                {product.name}
              </h1>
              {product.localName && (
                <p className="font-telugu text-[15px] sm:text-[16px] text-[#9E462A] font-medium mt-1">
                  {product.localName}
                </p>
              )}

              {/* Star Rating & Review Anchor */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex text-[#B8863A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current stroke-none" />
                  ))}
                </div>
                <span className="font-data text-[12px] font-bold text-[#221814]">
                  {(product.rating ?? 4.9).toFixed(1)}
                </span>
                <span className="text-[#8C7A70] text-[12px]">·</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-[12px] text-[#685950] hover:text-[#1A382B] underline underline-offset-2"
                >
                  {product.reviewCount || 24} verified harvest reviews
                </button>
              </div>

              {/* Product Short Description */}
              <p className="text-[13px] sm:text-[14px] text-[#685950] mt-3 leading-relaxed">
                {product.tagline || product.description}
              </p>

              {/* Price Banner */}
              <div className="mt-4 p-4 rounded-[8px] bg-white border border-[#E2D9CE] flex items-baseline gap-3 flex-wrap">
                <span className="font-data text-3xl sm:text-4xl font-bold text-[#221814] tracking-tight">
                  {formatCurrency(currentWeightOpt.price)}
                </span>
                {currentWeightOpt.mrp > currentWeightOpt.price && (
                  <span className="font-data text-base text-[#8C7A70] line-through">
                    {formatCurrency(currentWeightOpt.mrp)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="font-data text-[11px] font-semibold bg-[#FBEFEA] text-[#9E462A] px-2 py-0.5 rounded-[4px] border border-[#F0D5C9]">
                    Save {discount}%
                  </span>
                )}
                <span className="text-[11px] text-[#8C7A70] ml-auto font-data">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Pack Size Selector Tabs */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-[12px]">
                  <span className="font-semibold text-[#221814] uppercase tracking-wider font-data">
                    Pack Size:
                  </span>
                  <span className="text-[#685950] font-data">Net: {currentWeightOpt.size}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {product.weights.map((w) => (
                    <button
                      key={w.size}
                      type="button"
                      onClick={() => setSelectedWeightSize(w.size)}
                      className={`py-2.5 px-3 rounded-[6px] border text-[12px] font-medium transition-all text-center ${
                        selectedWeightSize === w.size
                          ? 'border-[#1A382B] bg-[#1A382B] text-white shadow-2xs'
                          : 'border-[#E2D9CE] bg-white text-[#221814] hover:border-[#1A382B]/50'
                      }`}
                    >
                      <span className="block font-semibold">{w.size}</span>
                      <span className="font-data text-[11px] opacity-80">
                        {formatCurrency(w.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-[12px] font-semibold text-[#221814] uppercase tracking-wider font-data">
                  Quantity:
                </span>
                <div className="flex items-center rounded-[6px] border border-[#E2D9CE] bg-white p-0.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-[4px] text-[#685950] hover:bg-[#FAF7F2] hover:text-[#221814] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-[13px] font-data font-semibold text-[#221814] min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 rounded-[4px] text-[#685950] hover:bg-[#FAF7F2] hover:text-[#221814] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-3.5 px-6 rounded-[6px] text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
                    addedAnimation
                      ? 'bg-[#264A3B] text-white'
                      : 'bg-[#1A382B] hover:bg-[#132B21] text-white shadow-sm'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Basket</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-[6px] bg-[#9E462A] hover:bg-[#853A22] text-white text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trust Signals Strip */}
            <div className="pt-5 border-t border-[#E2D9CE] grid grid-cols-2 gap-3 text-[12px] text-[#685950]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1A382B] shrink-0" />
                <span>100% Unpolished · Zero Additives</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1A382B] shrink-0" />
                <span>Free delivery on orders above ₹500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          DETAILED TABS & BATCH TRACEABILITY
          ========================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-[12px] border border-[#E2D9CE] bg-white overflow-hidden shadow-2xs">
          {/* Tab Navigation Header */}
          <div className="flex border-b border-[#E2D9CE] bg-[#FAF7F2] p-2 overflow-x-auto no-scrollbar gap-1.5">
            {[
              { id: 'story', label: 'Story & Origin' },
              { id: 'cooking', label: 'Culinary Uses' },
              { id: 'quality', label: 'Purity Checks' },
              { id: 'nutrition', label: 'Nutrition' },
              { id: 'batch', label: 'Batch Traceability' },
              { id: 'reviews', label: `Reviews (${product.reviewCount || 24})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#1A382B] font-semibold shadow-2xs border border-[#E2D9CE]'
                    : 'text-[#685950] hover:text-[#221814]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 sm:p-8 text-[13px] sm:text-[14px] text-[#221814] leading-relaxed bg-white">
            {/* Story Tab */}
            {activeTab === 'story' && (
              <div className="space-y-5 max-w-3xl">
                <div>
                  <h3 className="text-base font-semibold text-[#221814] mb-2 font-dmsans">
                    About this Harvest
                  </h3>
                  <p className="text-[#685950] leading-relaxed">{product.description}</p>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] space-y-1">
                  <span className="text-[11px] font-semibold text-[#9E462A] uppercase tracking-wider block font-data">
                    Source & Regional Origin
                  </span>
                  <p className="text-[13px] text-[#221814] font-medium">{product.origin}</p>
                </div>

                {product.spiceProfile && (
                  <div className="space-y-2 pt-2 border-t border-[#F0EAE1]">
                    <h4 className="text-[12px] uppercase tracking-wider font-semibold text-[#221814] font-data">
                      Spice Sensory Profile
                    </h4>
                    <p className="text-[13px] text-[#685950]">
                      <strong>Aroma:</strong> {product.spiceProfile.aroma}
                    </p>
                    {product.spiceProfile.heatLevel && (
                      <p className="text-[13px] text-[#685950]">
                        <strong>Heat Level:</strong> {product.spiceProfile.heatLevel}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.spiceProfile.keyFlavors.map((fl) => (
                        <span key={fl} className="bg-[#FAF7F2] border border-[#E2D9CE] text-[11px] px-2 py-0.5 rounded-[4px]">
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
              <div className="space-y-5 max-w-3xl">
                <div>
                  <h3 className="text-base font-semibold text-[#221814] mb-2 font-dmsans">
                    Preparation & Cooking Method
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[#685950]">
                    {product.cookingInstructions.map((step, idx) => (
                      <li key={idx} className="pl-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-[12px] uppercase tracking-wider font-semibold text-[#221814] mb-2 font-data">
                    Everyday Culinary Applications
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-[#685950]">
                    {product.culinaryUses.map((use, idx) => (
                      <li key={idx}>{use}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE]">
                  <span className="text-[12px] font-semibold text-[#221814] block mb-0.5 font-data">
                    Storage Guidelines
                  </span>
                  <p className="text-[12px] text-[#685950]">{product.storage}</p>
                </div>
              </div>
            )}

            {/* Quality Tab */}
            {activeTab === 'quality' && (
              <div className="space-y-5 max-w-3xl">
                <div>
                  <h3 className="text-base font-semibold text-[#221814] mb-2 font-dmsans">
                    Processing Protocols
                  </h3>
                  <p className="text-[#685950] leading-relaxed">{product.processing}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#9E462A]">
                      <FileText className="w-4 h-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider font-data">
                        Batch Lab Verification
                      </span>
                    </div>
                    <p className="text-[12px] font-data text-[#221814]">
                      {product.labTestPlaceholder}
                    </p>
                    <p className="text-[11px] text-[#8C7A70]">
                      Tested for pesticide residue limits, moisture levels (&lt;12%), and zero foreign matter.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#1A382B]">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider font-data">
                        Certification Status
                      </span>
                    </div>
                    <p className="text-[12px] font-data text-[#221814]">
                      {product.certificationsPlaceholder}
                    </p>
                    <p className="text-[11px] text-[#8C7A70]">
                      We only publish verified audit credentials. No fabricated organic badges.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div className="space-y-5 max-w-3xl">
                <div>
                  <h3 className="text-base font-semibold text-[#221814] mb-1 font-dmsans">
                    Ingredients
                  </h3>
                  <p className="text-[13px] text-[#685950]">
                    {product.ingredients.join(', ')}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#221814] mb-2 font-dmsans">
                    Nutrition Information ({product.nutrition.servingSize})
                  </h3>
                  <div className="border border-[#E2D9CE] rounded-[6px] overflow-hidden">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-[#FAF7F2] border-b border-[#E2D9CE] font-data text-[12px]">
                        <tr>
                          <th className="p-2.5 font-semibold text-[#221814]">Parameter</th>
                          <th className="p-2.5 font-semibold text-[#221814]">Approx. Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2D9CE] font-data">
                        <tr>
                          <td className="p-2.5 text-[#685950]">Energy (Calories)</td>
                          <td className="p-2.5 font-medium text-[#221814]">{product.nutrition.energyKcal}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-[#685950]">Protein</td>
                          <td className="p-2.5 font-medium text-[#221814]">{product.nutrition.protein}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-[#685950]">Carbohydrates</td>
                          <td className="p-2.5 font-medium text-[#221814]">{product.nutrition.carbohydrates}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-[#685950]">Dietary Fiber</td>
                          <td className="p-2.5 font-medium text-[#221814]">{product.nutrition.dietaryFiber}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-[#685950]">Total Fat</td>
                          <td className="p-2.5 font-medium text-[#221814]">{product.nutrition.fat}</td>
                        </tr>
                        {product.nutrition.minerals && (
                          <tr>
                            <td className="p-2.5 text-[#685950]">Key Micronutrients</td>
                            <td className="p-2.5 font-medium text-[#221814]">{product.nutrition.minerals}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Batch Traceability Tab */}
            {activeTab === 'batch' && (
              <div className="space-y-5 max-w-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D9CE] pb-3">
                  <div>
                    <span className="text-[10px] text-[#9E462A] uppercase font-bold tracking-widest block font-data">
                      Lot Provenance
                    </span>
                    <h3 className="text-base font-semibold text-[#221814] font-dmsans">
                      Harvest Lot Traceability
                    </h3>
                  </div>

                  {matchingBatches.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#685950] mr-1 font-data">Select Lot:</span>
                      {matchingBatches.map((b) => (
                        <button
                          key={b.batchNumber}
                          type="button"
                          onClick={() => setSelectedBatchNumber(b.batchNumber)}
                          className={`px-2.5 py-1 text-[11px] font-data font-semibold rounded-[4px] transition-all border ${
                            selectedBatchNumber === b.batchNumber
                              ? 'bg-[#1A382B] text-white border-[#1A382B]'
                              : 'bg-white text-[#685950] border-[#E2D9CE] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {b.batchNumber}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {activeBatch ? (
                  <div className="space-y-4">
                    <div className="bg-[#FAF7F2] border border-[#E2D9CE] p-4 rounded-[6px] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#1A382B] text-white font-data font-semibold text-[11px] rounded-[4px]">
                            LOT {activeBatch.batchNumber}
                          </span>
                          <span className="text-[12px] font-semibold text-[#1A382B] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1A382B]" />
                            <span>Quality Checked & Cleared</span>
                          </span>
                        </div>
                        <span className="text-[11px] font-data text-[#8C7A70]">
                          {activeBatch.status || 'ACTIVE'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                        <div className="p-3 bg-white border border-[#E2D9CE] rounded-[4px]">
                          <span className="text-[10px] text-[#8C7A70] uppercase font-data block">Sourcing Cluster</span>
                          <strong className="text-[#221814]">{activeBatch.supplier || activeBatch.farmerCluster || product.origin}</strong>
                          <span className="text-[11px] text-[#685950] block mt-0.5">{activeBatch.sourceRegion}</span>
                        </div>
                        <div className="p-3 bg-white border border-[#E2D9CE] rounded-[4px]">
                          <span className="text-[10px] text-[#8C7A70] uppercase font-data block">Harvest Timeline</span>
                          <strong className="text-[#221814] font-data">Milled: {activeBatch.manufacturingDate || activeBatch.millingDate || '2026-08-01'}</strong>
                          <span className="text-[11px] text-[#9E462A] block mt-0.5 font-data">Best Before: {activeBatch.expiryDate || activeBatch.bestBefore || '2027-07-31'}</span>
                        </div>
                        <div className="p-3 bg-white border border-[#E2D9CE] rounded-[4px]">
                          <span className="text-[10px] text-[#8C7A70] uppercase font-data block">Moisture Safety Check</span>
                          <strong className="text-[#1A382B] font-data">{activeBatch.moisturePercent || '10.8%'} (&lt;12% Target)</strong>
                          <span className="text-[11px] text-[#685950] block mt-0.5">Optimal dryland storage</span>
                        </div>
                        <div className="p-3 bg-white border border-[#E2D9CE] rounded-[4px]">
                          <span className="text-[10px] text-[#8C7A70] uppercase font-data block">Grain Cleanliness</span>
                          <strong className="text-[#1A382B] font-data">{activeBatch.purityPercent || '99.9%'} Pure</strong>
                          <span className="text-[11px] text-[#685950] block mt-0.5">Optical stone-separated</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E2D9CE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-[11px] text-[#685950]">
                          Every retail pouch has lot code <strong>{activeBatch.batchNumber}</strong> printed on the crimp seal.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowCoAAnalysisModal(true)}
                          className="px-3.5 py-2 bg-[#1A382B] hover:bg-[#132B21] text-white text-[12px] font-semibold rounded-[4px] flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Certificate of Analysis (CoA)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                    <div className="p-3.5 bg-[#FAF7F2] rounded-[4px] border border-[#E2D9CE]">
                      <span className="text-[#685950] block">Batch Series Code:</span>
                      <strong className="text-[#221814] font-data">{product.batchInfo.batchPrefix}-0926</strong>
                    </div>
                    <div className="p-3.5 bg-[#FAF7F2] rounded-[4px] border border-[#E2D9CE]">
                      <span className="text-[#685950] block">Shelf Life:</span>
                      <strong className="text-[#221814] font-data">{product.batchInfo.shelfLifeMonths} Months</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E2D9CE] gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-data text-2xl font-bold text-[#1A382B]">4.9</span>
                      <div className="flex text-[#B8863A]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current stroke-none" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[12px] text-[#685950] mt-0.5 font-data">
                      Based on verified customer purchases
                    </p>
                  </div>
                  <NextLink
                    href="/account/reviews"
                    className="px-4 py-2 bg-[#1A382B] hover:bg-[#132B21] text-white text-[12px] font-semibold rounded-[4px] transition-colors"
                  >
                    Write a Review
                  </NextLink>
                </div>

                <div className="space-y-4 divide-y divide-[#F0EAE1]">
                  <div className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#221814] text-[13px]">Saritha Reddy</span>
                        <span className="text-[10px] bg-[#EBF2EE] text-[#1A382B] px-1.5 py-0.2 rounded-[2px] font-data font-medium">
                          Verified Purchase
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8C7A70] font-data">September 2026</span>
                    </div>
                    <div className="text-[#B8863A] flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current stroke-none" />
                      ))}
                    </div>
                    <p className="text-[13px] text-[#4A3B32] leading-relaxed">
                      "Completely stone-picked and remarkably clean. We cook this every morning without needing to sieve or wash multiple times. Fragrant and fluffy."
                    </p>
                  </div>

                  <div className="pt-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#221814] text-[13px]">Dr. Ramesh Rao</span>
                        <span className="text-[10px] bg-[#EBF2EE] text-[#1A382B] px-1.5 py-0.2 rounded-[2px] font-data font-medium">
                          Verified Purchase
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8C7A70] font-data">August 2026</span>
                    </div>
                    <div className="text-[#B8863A] flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current stroke-none" />
                      ))}
                    </div>
                    <p className="text-[13px] text-[#4A3B32] leading-relaxed">
                      "Authentic unpolished grain with natural bran layers intact. Truly low glycemic impact, excellent for balanced daily cooking."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CoA Modal */}
      {showCoAAnalysisModal && activeBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E2D9CE] rounded-[8px] shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E2D9CE] pb-3">
              <div>
                <span className="text-[10px] font-semibold text-[#9E462A] uppercase tracking-wider block font-data">
                  NABL Accredited Laboratory Testing
                </span>
                <h3 className="text-lg font-serif font-semibold text-[#1A382B]">
                  Certificate of Analysis (CoA)
                </h3>
                <p className="text-[11px] text-[#685950] font-data mt-0.5">
                  Ref: NABL-DG-{activeBatch.batchNumber}-2026 · ISO/IEC 17025
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCoAAnalysisModal(false)}
                className="p-1 text-[#8C7A70] hover:text-[#221814] rounded-[4px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-[#FAF7F2] p-2.5 rounded-[4px] font-data">
              <div>
                <span className="text-[#8C7A70] uppercase block text-[9px]">Commodity</span>
                <strong className="text-[#221814]">{product.name}</strong>
              </div>
              <div>
                <span className="text-[#8C7A70] uppercase block text-[9px]">Lot Code</span>
                <strong className="text-[#1A382B]">{activeBatch.batchNumber}</strong>
              </div>
              <div>
                <span className="text-[#8C7A70] uppercase block text-[9px]">Sampled</span>
                <strong className="text-[#221814]">{activeBatch.manufacturingDate || '2026-08-01'}</strong>
              </div>
              <div>
                <span className="text-[#8C7A70] uppercase block text-[9px]">Status</span>
                <strong className="text-[#1A382B]">COMPLIANT</strong>
              </div>
            </div>

            <div className="border border-[#E2D9CE] rounded-[4px] overflow-hidden text-[12px]">
              <table className="w-full text-left font-data">
                <thead className="bg-[#FAF7F2] text-[#221814] text-[11px] border-b border-[#E2D9CE]">
                  <tr>
                    <th className="p-2">Parameter</th>
                    <th className="p-2">Result</th>
                    <th className="p-2 text-right">Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D9CE]">
                  <tr>
                    <td className="p-2">Moisture Content</td>
                    <td className="p-2 font-semibold text-[#1A382B]">{activeBatch.moisturePercent || '10.8%'}</td>
                    <td className="p-2 text-right">&le; 12.0%</td>
                  </tr>
                  <tr>
                    <td className="p-2">Purity & Cleanliness</td>
                    <td className="p-2 font-semibold text-[#1A382B]">{activeBatch.purityPercent || '99.9%'}</td>
                    <td className="p-2 text-right">&ge; 98.0%</td>
                  </tr>
                  <tr>
                    <td className="p-2">Aflatoxins</td>
                    <td className="p-2 font-semibold text-[#1A382B]">Not Detected</td>
                    <td className="p-2 text-right">&le; 10 ppb</td>
                  </tr>
                  <tr>
                    <td className="p-2">Chemical Polish & Dye</td>
                    <td className="p-2 font-semibold text-[#1A382B]">Absent (Natural)</td>
                    <td className="p-2 text-right">Nil</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  alert(`Certificate for Lot ${activeBatch.batchNumber} downloaded.`);
                  setShowCoAAnalysisModal(false);
                }}
                className="px-4 py-2 bg-[#1A382B] hover:bg-[#132B21] text-white text-[12px] font-semibold rounded-[4px] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Related Recipes Section */}
      {relatedRecipes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="flex items-center justify-between mb-6 border-b border-[#E2D9CE] pb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
                Culinary Heritage
              </span>
              <h2 className="text-2xl font-serif font-semibold text-[#221814]">
                Tested Recipes Using This Harvest
              </h2>
            </div>
            <NextLink
              href="/recipes"
              className="text-[13px] font-semibold text-[#1A382B] hover:text-[#9E462A] flex items-center gap-1"
            >
              <span>All Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {relatedRecipes.map((r) => (
              <NextLink
                key={r.id}
                href={`/recipes/${r.slug}`}
                className="group flex flex-col sm:flex-row rounded-[10px] bg-white border border-[#E2D9CE] p-3 overflow-hidden hover:border-[#1A382B]/40 transition-all shadow-2xs"
              >
                <div className="relative w-full sm:w-40 h-40 rounded-[6px] overflow-hidden bg-[#FAF7F2] flex-shrink-0">
                  <Image src={r.image} alt={r.title} fill className="object-cover card-image-zoom" />
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-data font-semibold text-[#9E462A]">
                      {r.category}
                    </span>
                    <h3 className="text-[15px] font-semibold text-[#221814] group-hover:text-[#1A382B] transition-colors mt-1 leading-snug">
                      {r.title}
                    </h3>
                    <p className="text-[12px] text-[#685950] mt-1 line-clamp-2 leading-relaxed">{r.description}</p>
                  </div>
                  <div className="text-[11px] text-[#8C7A70] flex items-center gap-2 mt-3 pt-2 border-t border-[#F0EAE1] font-data">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#1A382B]" /> {r.cookTime}
                    </span>
                    <span>·</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="mb-6 border-b border-[#E2D9CE] pb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
              Suggested Complements
            </span>
            <h2 className="text-2xl font-serif font-semibold text-[#221814]">
              Pair With Traditional Grains & Spices
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E2D9CE] p-3 shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#221814] truncate">{product.name}</p>
            <p className="font-data text-[13px] font-bold text-[#1A382B]">
              {formatCurrency(currentWeightOpt.price)}{' '}
              <span className="text-[10px] text-[#685950] font-normal">/ {currentWeightOpt.size}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-5 py-2.5 rounded-[6px] bg-[#1A382B] hover:bg-[#132B21] text-white text-[12px] font-semibold transition-colors whitespace-nowrap shadow-2xs"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
