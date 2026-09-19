'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { brandConfig } from '@/data/brandConfig';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>('orders');
  const { wishlist } = useWishlist();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Mock past orders
  const mockOrders = [
    {
      id: 'ORD-IN-729104',
      date: '14 Sep 2026',
      status: 'Delivered',
      total: 360,
      items: 'Korralu (Foxtail Millet) 1kg, Pure Turmeric Powder 250g',
    },
    {
      id: 'ORD-IN-619280',
      date: '28 Aug 2026',
      status: 'Delivered',
      total: 515,
      items: 'Signature Regional Spice Blend 200g, Arikelu 1kg, Ragi 1kg',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-[#E7DED4] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
            Customer Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-[#241611]">
            My Account & Orders
          </h1>
        </div>
        <div className="text-xs text-[#6B5B52]">
          Logged in as: <strong className="text-[#241611]">Customer / Guest Session</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white border border-[#E7DED4] p-4 divide-y divide-[#F0E8DF]">
          <nav className="space-y-1 pb-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#241611] text-white'
                  : 'text-[#6B5B52] hover:bg-[#FAF7F2] hover:text-[#241611]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Past Orders ({mockOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === 'wishlist'
                  ? 'bg-[#241611] text-white'
                  : 'text-[#6B5B52] hover:bg-[#FAF7F2] hover:text-[#241611]'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>My Wishlist ({wishlistProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-[#241611] text-white'
                  : 'text-[#6B5B52] hover:bg-[#FAF7F2] hover:text-[#241611]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-[#241611] text-white'
                  : 'text-[#6B5B52] hover:bg-[#FAF7F2] hover:text-[#241611]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
          </nav>
        </div>

        {/* Tab Content Panes */}
        <div className="lg:col-span-9 bg-white border border-[#E7DED4] p-6 sm:p-8">
          {/* Orders Pane */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-semibold text-[#241611] pb-3 border-b border-[#E7DED4]">
                Order History
              </h2>

              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 bg-[#FAF7F2] border border-[#E7DED4] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#241611]">{order.id}</span>
                        <span className="bg-[#274135] text-white text-[10px] px-2 py-0.5 font-bold uppercase">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[#6B5B52]">Placed on {order.date}</p>
                      <p className="text-[#241611] font-medium">{order.items}</p>
                    </div>

                    <div className="text-right sm:border-l sm:border-[#E7DED4] sm:pl-6 text-xs">
                      <span className="text-[#6B5B52] block">Total Amount</span>
                      <strong className="text-[#241611] text-sm">₹{order.total}</strong>
                      <div className="mt-2">
                        <Link
                          href={`/order-success?orderId=${order.id}`}
                          className="text-[#B35638] hover:underline font-semibold text-xs"
                        >
                          View Receipt →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist Pane */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-semibold text-[#241611] pb-3 border-b border-[#E7DED4]">
                Saved Wishlist Items ({wishlistProducts.length})
              </h2>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-10 h-10 text-[#9E8E84] mx-auto stroke-[1.2]" />
                  <p className="text-base font-serif text-[#241611]">Your wishlist is empty</p>
                  <p className="text-xs text-[#6B5B52]">
                    Explore our grains and spices and click the heart icon on any card to save it here.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block mt-2 px-6 py-2.5 bg-[#241611] text-white text-xs uppercase tracking-wider font-semibold"
                  >
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Pane */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-semibold text-[#241611] pb-3 border-b border-[#E7DED4]">
                Saved Delivery Addresses
              </h2>
              <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4] text-xs space-y-2 max-w-md">
                <div className="flex justify-between items-center">
                  <strong className="text-[#241611]">Primary Home Address</strong>
                  <span className="text-[10px] bg-[#241611] text-white px-2 py-0.5 uppercase font-semibold">
                    Default
                  </span>
                </div>
                <p className="text-[#6B5B52]">
                  [ADD SAVED ADDRESS — Will automatically populate from checkout]
                </p>
                <p className="text-[#8C7A70] text-[11px]">Hyderabad, Telangana — 500081</p>
              </div>
            </div>
          )}

          {/* Profile Pane */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-md">
              <h2 className="text-lg font-serif font-semibold text-[#241611] pb-3 border-b border-[#E7DED4]">
                Customer Profile
              </h2>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[#6B5B52] block">Contact Mobile Number</label>
                  <input
                    type="text"
                    disabled
                    value="+91 [VERIFIED ON CHECKOUT]"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#6B5B52] block">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={brandConfig.supportEmail}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
