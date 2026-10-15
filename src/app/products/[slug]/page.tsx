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
    <div className="pb-24 sm:pb-28 bg-[#F8F4EA] text-[#292B25]">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-[12px] text-[#5F6156] border-b border-[#E7D8B8] font-data">
        <NextLink href="/" className="hover:text-[#354C36]">Home</NextLink>
        <span className="mx-2 text-[#C47B4B]">/</span>
        <NextLink
          href={product.category === 'millets' ? '/millets' : '/spices'}
          className="hover:text-[#354C36] capitalize"
        >
          {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Spices'}
        </NextLink>
        <span className="mx-2 text-[#C47B4B]">/</span>
        <span className="text-[#292B25] font-medium">{product.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-[12px] bg-white border border-[#E7D8B8] p-4 overflow-hidden flex items-center justify-center shadow-2xs">
              <div className="relative w-full h-full rounded-[8px] overflow-hidden bg-[#F8F4EA]">
                <Image
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-all duration-300"
                />
              </div>

              {discount > 0 && (
                <span className="absolute top-6 left-6 rounded-[4px] bg-[#C47B4B] text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1">
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
                        ? 'border-[#354C36] ring-1 ring-[#354C36]'
                        : 'border-[#E7D8B8] opacity-75 hover:opacity-100'
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] bg-white border border-[#E7D8B8] text-[11px] font-semibold text-[#354C36] uppercase tracking-wider font-data">
                  {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Single-Origin Spice'}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-[12px] transition-colors border ${
                    inWishlist
                      ? 'border-[#C47B4B] bg-[#FBEFEA] text-[#C47B4B] font-semibold'
                      : 'border-[#E7D8B8] bg-white text-[#5F6156] hover:text-[#292B25]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Title & Regional Telugu Name */}
              <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#292B25] leading-tight">
                {product.name}
              </h1>
              {product.localName && (
                <p className="font-telugu text-[15px] sm:text-[16px] text-[#C47B4B] font-medium mt-1">
                  {product.localName}
                </p>
              )}

              {/* Star Rating & Review Anchor */}
              <div className="flex items-center gap-2 mt-2.5">
                {product.rating && product.reviewCount && product.reviewCount > 0 ? (
                  <>
                    <div className="flex text-[#B8863A]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current stroke-none" />
                      ))}
                    </div>
                    <span className="font-data text-[12px] font-bold text-[#292B25]">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-[#8C7A70] text-[12px]">·</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="text-[12px] text-[#5F6156] hover:text-[#354C36] underline underline-offset-2"
                    >
                      {product.reviewCount} verified reviews
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-medium text-[#354C36] bg-[#EBF2EE] px-2 py-0.5 rounded-[4px] font-data">
                      ✦ Farm-Fresh Harvest
                    </span>
                    <span className="text-[#8C7A70] text-[12px]">·</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="text-[12px] text-[#5F6156] hover:text-[#354C36] underline underline-offset-2"
                    >
                      Be the first verified customer to review
                    </button>
                  </>
                )}
              </div>

              {/* Product Short Description */}
              <p className="text-[13px] sm:text-[14px] text-[#5F6156] mt-3 leading-relaxed">
                {product.tagline || product.description}
              </p>

              {/* Price Banner */}
              <div className="mt-4 p-4 rounded-[8px] bg-white border border-[#E7D8B8] flex items-baseline gap-3 flex-wrap">
                <span className="font-data text-3xl sm:text-4xl font-bold text-[#292B25] tracking-tight">
                  {formatCurrency(currentWeightOpt.price)}
                </span>
                {currentWeightOpt.mrp > currentWeightOpt.price && (
                  <span className="font-data text-base text-[#8C7A70] line-through">
                    {formatCurrency(currentWeightOpt.mrp)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="font-data text-[11px] font-semibold bg-[#FBEFEA] text-[#C47B4B] px-2 py-0.5 rounded-[4px] border border-[#F0D5C9]">
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
                  <span className="font-semibold text-[#292B25] uppercase tracking-wider font-data">
                    Pack Size:
                  </span>
                  <span className="text-[#5F6156] font-data">Net: {currentWeightOpt.size}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {product.weights.map((w) => (
                    <button
                      key={w.size}
                      type="button"
                      onClick={() => setSelectedWeightSize(w.size)}
                      className={`py-2.5 px-3 rounded-[6px] border text-[12px] font-medium transition-all text-center ${
                        selectedWeightSize === w.size
                          ? 'border-[#354C36] bg-[#354C36] text-white shadow-2xs'
                          : 'border-[#E7D8B8] bg-white text-[#292B25] hover:border-[#354C36]/50'
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
                <span className="text-[12px] font-semibold text-[#292B25] uppercase tracking-wider font-data">
                  Quantity:
                </span>
                <div className="flex items-center rounded-[6px] border border-[#E7D8B8] bg-white p-0.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-[4px] text-[#5F6156] hover:bg-[#F8F4EA] hover:text-[#292B25] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-[13px] font-data font-semibold text-[#292B25] min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 rounded-[4px] text-[#5F6156] hover:bg-[#F8F4EA] hover:text-[#292B25] transition-colors"
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
                      : 'bg-[#354C36] hover:bg-[#132B21] text-white shadow-sm'
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
                  className="py-3.5 px-6 rounded-[6px] bg-[#C47B4B] hover:bg-[#853A22] text-white text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trust Signals Strip */}
            <div className="pt-5 border-t border-[#E7D8B8] grid grid-cols-2 gap-3 text-[12px] text-[#5F6156]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#354C36] shrink-0" />
                <span>100% Unpolished · Zero Additives</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#354C36] shrink-0" />
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
        <div className="rounded-[12px] border border-[#E7D8B8] bg-white overflow-hidden shadow-2xs">
          {/* Tab Navigation Header */}
          <div className="flex border-b border-[#E7D8B8] bg-[#F8F4EA] p-2 overflow-x-auto no-scrollbar gap-1.5">
            {[
              { id: 'story', label: 'Story & Origin' },
              { id: 'cooking', label: 'Culinary Uses' },
              { id: 'quality', label: 'Purity Checks' },
              { id: 'nutrition', label: 'Nutrition' },
              { id: 'batch', label: 'Batch Traceability' },
              { id: 'reviews', label: product.reviewCount ? `Reviews (${product.reviewCount})` : 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#354C36] font-semibold shadow-2xs border border-[#E7D8B8]'
                    : 'text-[#5F6156] hover:text-[#292B25]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 sm:p-8 text-[13px] sm:text-[14px] text-[#292B25] leading-relaxed bg-white">
            {/* Story Tab */}
            {activeTab === 'story' && (
              <div className="space-y-5 max-w-3xl">
                <div>
                  <h3 className="text-base font-semibold text-[#292B25] mb-2 font-dmsans">
                    About this Harvest
                  </h3>
                  <p className="text-[#5F6156] leading-relaxed">{product.description}</p>
                </div>

                <div className="p-4 bg-[#F8F4EA] rounded-[6px] border border-[#E7D8B8] space-y-1">
                  <span className="text-[11px] font-semibold text-[#C47B4B] uppercase tracking-wider block font-data">
                    Source & Regional Origin
                  </span>
                  <p className="text-[13px] text-[#292B25] font-medium">{product.origin}</p>
                </div>

                {product.spiceProfile && (
                  <div className="space-y-2 pt-2 border-t border-[#F0EAE1]">
                    <h4 className="text-[12px] uppercase tracking-wider font-semibold text-[#292B25] font-data">
                      Spice Sensory Profile
                    </h4>
                    <p className="text-[13px] text-[#5F6156]">
                      <strong>Aroma:</strong> {product.spiceProfile.aroma}
                    </p>
                    {product.spiceProfile.heatLevel && (
                      <p className="text-[13px] text-[#5F6156]">
                        <strong>Heat Level:</strong> {product.spiceProfile.heatLevel}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.spiceProfile.keyFlavors.map((fl) => (
                        <span key={fl} className="bg-[#F8F4EA] border border-[#E7D8B8] text-[11px] px-2 py-0.5 rounded-[4px]">
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
                  <h3 className="text-base font-semibold text-[#292B25] mb-2 font-dmsans">
                    Preparation & Cooking Method
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[#5F6156]">
                    {product.cookingInstructions.map((step, idx) => (
                      <li key={idx} className="pl-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-[12px] uppercase tracking-wider font-semibold text-[#292B25] mb-2 font-data">
                    Everyday Culinary Applications
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-[#5F6156]">
                    {product.culinaryUses.map((use, idx) => (
                      <li key={idx}>{use}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-[#F8F4EA] rounded-[6px] border border-[#E7D8B8]">
                  <span className="text-[12px] font-semibold text-[#292B25] block mb-0.5 font-data">
                    Storage Guidelines
                  </span>
                  <p className="text-[12px] text-[#5F6156]">{product.storage}</p>
                </div>
              </div>
            )}

            {/* Quality Tab */}
            {activeTab === 'quality' && (
              <div className="space-y-5 max-w-3xl">
                <div>
                  <h3 className="text-base font-semibold text-[#292B25] mb-2 font-dmsans">
                    Processing Protocols
                  </h3>
                  <p className="text-[#5F6156] leading-relaxed">{product.processing}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#F8F4EA] rounded-[6px] border border-[#E7D8B8] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#C47B4B]">
                      <FileText className="w-4 h-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider font-data">
                        Batch Lab Verification
                      </span>
                    </div>
                    <p className="text-[12px] font-data text-[#292B25]">
                      {product.labTestPlaceholder}
                    </p>
                    <p className="text-[11px] text-[#8C7A70]">
                      Tested for pesticide residue limits, moisture levels (&lt;12%), and zero foreign matter.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F8F4EA] rounded-[6px] border border-[#E7D8B8] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#354C36]">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider font-data">
                        Certification Status
                      </span>
                    </div>
                    <p className="text-[12px] font-data text-[#292B25]">
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
                  <h3 className="text-base font-semibold text-[#292B25] mb-1 font-dmsans">
                    Ingredients
                  </h3>
                  <p className="text-[13px] text-[#5F6156]">
                    {product.ingredients.join(', ')}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#292B25] mb-2 font-dmsans">
                    Nutrition Information ({product.nutrition.servingSize})
                  </h3>
                  <div className="border border-[#E7D8B8] rounded-[6px] overflow-hidden">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-[#F8F4EA] border-b border-[#E7D8B8] font-data text-[12px]">
                        <tr>
                          <th className="p-2.5 font-semibold text-[#292B25]">Parameter</th>
                          <th className="p-2.5 font-semibold text-[#292B25]">Approx. Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7D8B8] font-data">
                        <tr>
                          <td className="p-2.5 text-[#5F6156]">Energy (Calories)</td>
                          <td className="p-2.5 font-medium text-[#292B25]">{product.nutrition.energyKcal}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-[#5F6156]">Protein</td>
                          <td className="p-2.5 font-medium text-[#292B25]">{product.nutrition.protein}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-[#5F6156]">Carbohydrates</td>
                          <td className="p-2.5 font-medium text-[#292B25]">{product.nutrition.carbohydrates}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-[#5F6156]">Dietary Fiber</td>
                          <td className="p-2.5 font-medium text-[#292B25]">{product.nutrition.dietaryFiber}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-[#5F6156]">Total Fat</td>
                          <td className="p-2.5 font-medium text-[#292B25]">{product.nutrition.fat}</td>
                        </tr>
                        {product.nutrition.minerals && (
                          <tr>
                            <td className="p-2.5 text-[#5F6156]">Key Micronutrients</td>
                            <td className="p-2.5 font-medium text-[#292B25]">{product.nutrition.minerals}</td>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7D8B8] pb-3">
                  <div>
                    <span className="text-[10px] text-[#C47B4B] uppercase font-bold tracking-widest block font-data">
                      Lot Provenance
                    </span>
                    <h3 className="text-base font-semibold text-[#292B25] font-dmsans">
                      Harvest Lot Traceability
                    </h3>
                  </div>

                  {matchingBatches.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#5F6156] mr-1 font-data">Select Lot:</span>
                      {matchingBatches.map((b) => (
                        <button
                          key={b.batchNumber}
                          type="button"
                          onClick={() => setSelectedBatchNumber(b.batchNumber)}
                          className={`px-2.5 py-1 text-[11px] font-data font-semibold rounded-[4px] transition-all border ${
                            selectedBatchNumber === b.batchNumber
                              ? 'bg-[#354C36] text-white border-[#354C36]'
                              : 'bg-white text-[#5F6156] border-[#E7D8B8] hover:bg-[#F8F4EA]'
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
                    <div className="bg-[#F8F4EA] border border-[#E7D8B8] p-4 rounded-[6px] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#354C36] text-white font-data font-semibold text-[11px] rounded-[4px]">
                            LOT {activeBatch.batchNumber}
                          </span>
                          <span className="text-[12px] font-semibold text-[#354C36] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#354C36]" />
                            <span>Quality Checked & Cleared</span>
                          </span>
                        </div>
                        <span className="text-[11px] font-data text-[#8C7A70]">
                          {activeBatch.status || 'ACTIVE'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                        <div className="p-3 bg-white border border-[#E7D8B8] rounded-[4px]">
                          <span className="text-[10px] text-[#8C7A70] uppercase font-data block">Sourcing Cluster</span>
                          <strong className="text-[#292B25]">{activeBatch.supplier || activeBatch.farmerCluster || product.origin}</strong>
                          <span className="text-[11px] text-[#5F6156] block mt-0.5">{activeBatch.sourceRegion}</span>
                        </div>
                        <div className="p-3 bg-white border border-[#E7D8B8] rounded-[4px]">
                          <span className="text-[10px] text-[#8C7A70] uppercase font-data block">Harvest Timeline</span>
                          <strong className="text-[#292B25] font-data">Milled: {activeBatch.manufacturingDate || activeBatch.millingDate || '2026-08-01'}</strong>
                          <span className="text-[11px] text-[#C47B4B] block mt-0.5 font-data">Best Before: {activeBatch.expiryDate || activeBatch.bestBefore || '2027-07-31'}</span>
                        </div>
                        <div className="p-3 bg-white border border-[#E7D8B8] rounded-[4px]">
                          <span className="text-[10px] text-[#8C7A70] uppercase font-data block">Moisture Safety Check</span>
                          <strong className="text-[#354C36] font-data">{activeBatch.moisturePercent || '10.8%'} (&lt;12% Target)</strong>
                          <span className="text-[11px] text-[#5F6156] block mt-0.5">Optimal dryland storage</span>
                        </div>
                        <div className="p-3 bg-white border border-[#E7D8B8] rounded-[4px]">
                          <span className="text-[10px] text-[#8C7A70] uppercase font-data block">Grain Cleanliness</span>
                          <strong className="text-[#354C36] font-data">{activeBatch.purityPercent || '99.9%'} Pure</strong>
                          <span className="text-[11px] text-[#5F6156] block mt-0.5">Optical stone-separated</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E7D8B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-[11px] text-[#5F6156]">
                          Every retail pouch has lot code <strong>{activeBatch.batchNumber}</strong> printed on the crimp seal.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowCoAAnalysisModal(true)}
                          className="px-3.5 py-2 bg-[#354C36] hover:bg-[#132B21] text-white text-[12px] font-semibold rounded-[4px] flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Certificate of Analysis (CoA)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                    <div className="p-3.5 bg-[#F8F4EA] rounded-[4px] border border-[#E7D8B8]">
                      <span className="text-[#5F6156] block">Batch Series Code:</span>
                      <strong className="text-[#292B25] font-data">{product.batchInfo.batchPrefix}-0926</strong>
                    </div>
                    <div className="p-3.5 bg-[#F8F4EA] rounded-[4px] border border-[#E7D8B8]">
                      <span className="text-[#5F6156] block">Shelf Life:</span>
                      <strong className="text-[#292B25] font-data">{product.batchInfo.shelfLifeMonths} Months</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E7D8B8] gap-3">
                  <div>
                    {product.rating && product.reviewCount && product.reviewCount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-data text-2xl font-bold text-[#354C36]">{product.rating.toFixed(1)}</span>
                        <div className="flex text-[#B8863A]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current stroke-none" />
                          ))}
                        </div>
                        <span className="text-[12px] text-[#5F6156] font-data">
                          ({product.reviewCount} verified ratings)
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <h4 className="text-base font-semibold text-[#292B25]">Verified Consumer Reviews</h4>
                        <p className="text-[12px] text-[#5F6156] font-data">
                          All reviews require an authenticated order ID. No fake testimonials.
                        </p>
                      </div>
                    )}
                  </div>
                  <NextLink
                    href="/account/reviews"
                    className="px-4 py-2 bg-[#354C36] hover:bg-[#132B21] text-white text-[12px] font-semibold rounded-[4px] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Submit Verified Review</span>
                  </NextLink>
                </div>

                {/* Transparency Note adhering to BIS IS 19000:2022 */}
                <div className="p-3.5 bg-[#F8F4EA] rounded-[6px] border border-[#E7D8B8] text-xs text-[#5A4D45] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#354C36]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>BIS IS 19000:2022 &amp; Zero Fake Reviews Compliance</span>
                  </div>
                  <p className="leading-relaxed">
                    Under the <em>Guidelines for Prevention and Regulation of Dark Patterns (2023)</em>, Dharvika Grains does not display auto-generated, incentivized, or fabricated reviews. Customers who have completed a verified dispatch delivery can submit their honest culinary feedback through their order dashboard.
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-[#F0EAE1]">
                  <div className="pt-4 first:pt-0 space-y-2">
                    <p className="text-[13px] text-[#5F6156] italic leading-relaxed">
                      Have you cooked with this harvest batch? Log in to your customer account to rate the aroma, cleanliness, and grain texture. Your review will be published with a &quot;Verified Buyer&quot; badge following automated order confirmation.
                    </p>
                    <div className="pt-2">
                      <NextLink
                        href="/account/reviews"
                        className="text-[12px] font-semibold text-[#354C36] hover:text-[#C47B4B] underline underline-offset-2"
                      >
                        Write your review via Order History &rarr;
                      </NextLink>
                    </div>
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
          <div className="bg-white border border-[#E7D8B8] rounded-[8px] shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E7D8B8] pb-3">
              <div>
                <span className="text-[10px] font-semibold text-[#C47B4B] uppercase tracking-wider block font-data">
                  NABL Accredited Laboratory Testing
                </span>
                <h3 className="text-lg font-serif font-semibold text-[#354C36]">
                  Certificate of Analysis (CoA)
                </h3>
                <p className="text-[11px] text-[#5F6156] font-data mt-0.5">
                  Ref: NABL-DG-{activeBatch.batchNumber}-2026 · ISO/IEC 17025
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCoAAnalysisModal(false)}
                className="p-1 text-[#8C7A70] hover:text-[#292B25] rounded-[4px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-[#F8F4EA] p-2.5 rounded-[4px] font-data">
              <div>
                <span className="text-[#8C7A70] uppercase block text-[9px]">Commodity</span>
                <strong className="text-[#292B25]">{product.name}</strong>
              </div>
              <div>
                <span className="text-[#8C7A70] uppercase block text-[9px]">Lot Code</span>
                <strong className="text-[#354C36]">{activeBatch.batchNumber}</strong>
              </div>
              <div>
                <span className="text-[#8C7A70] uppercase block text-[9px]">Sampled</span>
                <strong className="text-[#292B25]">{activeBatch.manufacturingDate || '2026-08-01'}</strong>
              </div>
              <div>
                <span className="text-[#8C7A70] uppercase block text-[9px]">Status</span>
                <strong className="text-[#354C36]">COMPLIANT</strong>
              </div>
            </div>

            <div className="border border-[#E7D8B8] rounded-[4px] overflow-hidden text-[12px]">
              <table className="w-full text-left font-data">
                <thead className="bg-[#F8F4EA] text-[#292B25] text-[11px] border-b border-[#E7D8B8]">
                  <tr>
                    <th className="p-2">Parameter</th>
                    <th className="p-2">Result</th>
                    <th className="p-2 text-right">Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7D8B8]">
                  <tr>
                    <td className="p-2">Moisture Content</td>
                    <td className="p-2 font-semibold text-[#354C36]">{activeBatch.moisturePercent || '10.8%'}</td>
                    <td className="p-2 text-right">&le; 12.0%</td>
                  </tr>
                  <tr>
                    <td className="p-2">Purity & Cleanliness</td>
                    <td className="p-2 font-semibold text-[#354C36]">{activeBatch.purityPercent || '99.9%'}</td>
                    <td className="p-2 text-right">&ge; 98.0%</td>
                  </tr>
                  <tr>
                    <td className="p-2">Aflatoxins</td>
                    <td className="p-2 font-semibold text-[#354C36]">Not Detected</td>
                    <td className="p-2 text-right">&le; 10 ppb</td>
                  </tr>
                  <tr>
                    <td className="p-2">Chemical Polish & Dye</td>
                    <td className="p-2 font-semibold text-[#354C36]">Absent (Natural)</td>
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
                className="px-4 py-2 bg-[#354C36] hover:bg-[#132B21] text-white text-[12px] font-semibold rounded-[4px] flex items-center gap-1.5 transition-colors"
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
          <div className="flex items-center justify-between mb-6 border-b border-[#E7D8B8] pb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
                Culinary Heritage
              </span>
              <h2 className="text-2xl font-serif font-semibold text-[#292B25]">
                Tested Recipes Using This Harvest
              </h2>
            </div>
            <NextLink
              href="/recipes"
              className="text-[13px] font-semibold text-[#354C36] hover:text-[#C47B4B] flex items-center gap-1"
            >
              <span>All Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {relatedRecipes.map((r) => (
              <NextLink
                key={r.id}
                href={`/recipes/${r.slug}`}
                className="group flex flex-col sm:flex-row rounded-[10px] sm:rounded-[12px] bg-white border border-[#E7D8B8] p-2.5 sm:p-3 overflow-hidden hover:border-[#354C36]/40 transition-all shadow-2xs justify-between"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-auto sm:w-40 sm:h-40 rounded-[6px] overflow-hidden bg-[#F8F4EA] flex-shrink-0">
                  <Image src={r.image} alt={r.title} fill className="object-cover card-image-zoom" />
                </div>
                <div className="pt-2 sm:pt-0 sm:p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase font-data font-semibold text-[#C47B4B]">
                      {r.category}
                    </span>
                    <h3 className="text-[13px] sm:text-[15px] font-semibold text-[#292B25] group-hover:text-[#354C36] transition-colors mt-0.5 leading-snug line-clamp-1 sm:line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-[11px] sm:text-[12px] text-[#5F6156] mt-0.5 line-clamp-2 leading-relaxed">{r.description}</p>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#8C7A70] flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 border-t border-[#F0EAE1] font-data">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#354C36]" /> {r.cookTime}
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
          <div className="mb-6 border-b border-[#E7D8B8] pb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              Suggested Complements
            </span>
            <h2 className="text-2xl font-serif font-semibold text-[#292B25]">
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
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E7D8B8] p-3 shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#292B25] truncate">{product.name}</p>
            <p className="font-data text-[13px] font-bold text-[#354C36]">
              {formatCurrency(currentWeightOpt.price)}{' '}
              <span className="text-[10px] text-[#5F6156] font-normal">/ {currentWeightOpt.size}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-5 py-2.5 rounded-[6px] bg-[#354C36] hover:bg-[#132B21] text-white text-[12px] font-semibold transition-colors whitespace-nowrap shadow-2xs"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
