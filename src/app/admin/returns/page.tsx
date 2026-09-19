'use client';

import React, { useState } from 'react';
import { adminReturns } from '@/data/admin';
import { ReturnRequest } from '@/types';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export default function AdminReturnsPage() {
  const [returnsList, setReturnsList] = useState<ReturnRequest[]>(adminReturns);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleApprove = (id: string) => {
    setReturnsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    alert('Return approved. Refund initiated via Razorpay/Cashfree back to original payment method.');
  };

  const handleReject = (id: string) => {
    setReturnsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
  };

  const filteredReturns = returnsList.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.orderId.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q)
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
            Customer Resolution & Claims
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Returns & Refund Requests
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Fair 7-day transit damage resolution for sealed food provisions.
          </p>
        </div>
      </div>

      {/* Policy Notice Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 flex items-center space-x-3 text-xs text-blue-900">
        <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div>
          <strong className="font-semibold">Food Safety Standard Return Policy:</strong>
          <p className="text-blue-700 mt-0.5">
            Opened consumable bags cannot be restocked due to FSSAI hygiene standards. Transit damaged pouches are compensated via instant UPI refund or replacement dispatch.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
          />
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Claim ID & Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Provision Affected</th>
                <th className="px-4 py-3">Reported Reason</th>
                <th className="px-4 py-3">Refund Value</th>
                <th className="px-4 py-3">Claim Status</th>
                <th className="px-4 py-3 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReturns.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-gray-900 block">{item.id}</span>
                    <span className="font-mono text-[11px] text-[#0D3522]">Order: #{item.orderId}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">{item.customerName}</p>
                    <p className="text-[10px] text-gray-400">{item.requestedAt}</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 max-w-xs">
                    {item.reason}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-gray-900">
                    ₹{item.refundAmount}
                    <span className="block text-[10px] text-gray-400 font-normal">{item.refundMethod}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold border ${
                        item.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'Rejected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    {item.status === 'Pending Review' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold"
                        >
                          Approve Refund
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(item.id)}
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">Processed</span>
                    )}
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
