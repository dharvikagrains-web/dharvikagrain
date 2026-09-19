'use client';

import React, { useState } from 'react';
import { initialReviews } from '@/data/admin';
import { ProductReview } from '@/types';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Trash2,
  MessageSquare,
  Search,
  ThumbsUp,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredReviews = reviews.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.customerName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Reputation & Customer Voice
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Reviews & Feedback Moderation
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit authentic reviews and verified harvest purchases.
          </p>
        </div>
      </div>

      {/* Trust Philosophy Box */}
      <div className="bg-[#FAF7F2] border border-[#C5A059]/40 p-4 flex items-center space-x-3 text-xs text-[#241611]">
        <CheckCircle2 className="w-5 h-5 text-[#0D3522] flex-shrink-0" />
        <div>
          <strong className="font-semibold">Zero-Fake Reviews Policy:</strong>
          <p className="text-[#6B5B52] mt-0.5">
            Dharvika Grains verifies every review against an authentic delivered order ID. We never purchase or generate simulated ratings.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, grain, or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
          />
        </div>

        <span className="text-xs text-gray-500 hidden sm:inline">
          Total <strong>{reviews.length}</strong> verified submissions
        </span>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Customer & Date</th>
                <th className="px-4 py-3">Provision</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Verified Purchase</th>
                <th className="px-4 py-3">Review Commentary</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">{rev.customerName}</p>
                    <p className="text-[10px] text-gray-400">{rev.date}</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800">
                    {rev.productName}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-[#C5A059] tracking-wider text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-block px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      ✓ Verified Buyer
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 max-w-md italic">
                    "{rev.comment}"
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
