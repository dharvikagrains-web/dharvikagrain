'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockOrdersList } from '@/data/orders';
import { Package, ArrowLeft, ArrowRight, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function MyOrdersPage() {
  const [filter, setFilter] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');

  const filteredOrders = mockOrdersList.filter((order) => {
    if (filter === 'All') return true;
    if (filter === 'Processing') return order.status === 'Order Processing' || order.status === 'Packed';
    if (filter === 'Shipped') return order.status === 'Shipped' || order.status === 'Out for Delivery';
    return order.status === filter;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
        <Link href="/account" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Account
        </Link>
      </div>

      <div className="border-b border-[#E7DED4] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#B35638] uppercase">
            Order History
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#0D3522] mt-1">
            My Orders
          </h1>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs ${
                filter === tab
                  ? 'bg-[#0D3522] text-white'
                  : 'bg-white border border-[#E7DED4] text-[#6B5B52] hover:border-[#241611]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E7DED4] p-8 space-y-3">
          <p className="text-base font-serif text-[#241611]">No orders found for this status</p>
          <p className="text-xs text-[#6B5B52]">Try viewing &ldquo;All&rdquo; orders or discover our traditional grain catalogue.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white border border-[#E7DED4] p-6 space-y-4 hover:border-[#C5A059] transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7DED4] gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-serif font-bold text-[#0D3522]">
                      #{order.orderId}
                    </span>
                    <span className="text-xs text-[#8C7A70]">• {order.date}</span>
                  </div>
                  <p className="text-xs text-[#6B5B52] mt-0.5">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Total: <strong className="text-[#241611]">₹{order.total}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-[#EBF7EE] text-[#0D3522]'
                        : order.status === 'Out for Delivery' || order.status === 'Shipped'
                        ? 'bg-[#FDF7E7] text-[#C5A059]'
                        : 'bg-[#FAF7F2] text-[#6B5B52]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    <span>{order.status}</span>
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="relative w-14 h-14 bg-[#FAF7F2] border border-[#E7DED4] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[#241611] line-clamp-1">{item.name}</p>
                      <p className="text-[#6B5B52]">{item.selectedWeight} • Qty: {item.quantity}</p>
                      <p className="font-bold text-[#0D3522] mt-0.5">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#E7DED4] flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#6B5B52]">
                  Payment: <strong className="text-[#241611]">{order.paymentMethod}</strong> ({order.paymentStatus})
                </p>

                <div className="flex items-center space-x-3">
                  <Link
                    href={`/account/orders/${order.orderId}`}
                    className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>TRACK ORDER</span>
                  </Link>
                  <Link
                    href={`/account/orders/${order.orderId}`}
                    className="px-4 py-2 border border-[#E7DED4] hover:border-[#241611] text-[#241611] text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    VIEW ORDER
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
