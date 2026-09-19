'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialReviews } from '@/data/admin';
import { ProductReview } from '@/types';
import { Star, ArrowLeft, CheckCircle2, Image as ImageIcon, Send } from 'lucide-react';

export default function AccountReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [selectedProduct, setSelectedProduct] = useState('Korralu (Foxtail Millet)');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: 'millet-korralu',
      productName: selectedProduct,
      customerName: 'Pavan Geesala',
      rating,
      date: 'Today',
      verifiedPurchase: true,
      comment,
    };

    setReviews([newReview, ...reviews]);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
        <Link href="/account" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Account
        </Link>
      </div>

      <div className="border-b border-[#E7DED4] pb-6">
        <span className="text-xs font-semibold tracking-widest text-[#B35638] uppercase">
          Feedback & Stories
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#0D3522] mt-1">
          Ratings & Verified Reviews
        </h1>
        <p className="text-xs text-[#6B5B52] mt-1">
          Share your experience with genuine unpolished grains and cold-ground spices.
        </p>
      </div>

      {/* Review Submission Form Card */}
      <div className="bg-white border border-[#E7DED4] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#C5A059]">
            Post Delivery Feedback
          </span>
          <h2 className="text-xl font-serif font-bold text-[#0D3522]">
            How was your DHARVIKA experience?
          </h2>
        </div>

        {submitted && (
          <div className="p-4 bg-[#EBF7EE] border border-[#0D3522]/30 text-[#0D3522] text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you! Your verified review has been published.</span>
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#241611] block">Select Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
            >
              <option value="Korralu (Foxtail Millet)">Korralu (Foxtail Millet)</option>
              <option value="Samalu (Little Millet)">Samalu (Little Millet)</option>
              <option value="Arikelu (Kodo Millet)">Arikelu (Kodo Millet)</option>
              <option value="Ragi (Finger Millet)">Ragi (Finger Millet)</option>
              <option value="Pure Turmeric Powder">Pure Turmeric Powder</option>
              <option value="Signature Regional Spice Blend">Signature Regional Spice Blend</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#241611] block">Your Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-[#C5A059] fill-[#C5A059]' : 'text-[#D8CCC0]'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-[#6B5B52] ml-2">
                {rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : 'Good'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#241611] block">
              Tell us about your experience
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the grain texture, aroma, or culinary result? Did you try cooking upma or dosa?"
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-3 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522] leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
              <span className="px-2 py-0.5 bg-[#EBF7EE] text-[#0D3522] font-bold text-[10px] uppercase rounded-xs">
                Verified Buyer
              </span>
              <span>Review tied to Order #DG10248</span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SUBMIT REVIEW</span>
            </button>
          </div>
        </form>
      </div>

      {/* Community Reviews List */}
      <div className="space-y-4">
        <h3 className="text-base font-serif font-bold text-[#241611] uppercase tracking-wider">
          Recent Verified Community Reviews ({reviews.length})
        </h3>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-[#E7DED4] p-5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#241611]">{rev.productName}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs font-semibold text-[#6B5B52]">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-[#0D3522] font-bold bg-[#EBF7EE] px-1.5 py-0.5 rounded-xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0D3522]" />
                        <span>Verified Purchase</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-0.5 text-[#C5A059]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#6B5B52] leading-relaxed italic font-serif">
                &ldquo;{rev.comment}&rdquo;
              </p>
              <span className="text-[10px] text-[#8C7A70] block">Reviewed on {rev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
