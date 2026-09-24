'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { mockOrdersList } from '@/data/orders';
import { useWishlist } from '@/context/WishlistContext';
import {
  Package,
  Heart,
  MapPin,
  Tag,
  Star,
  User,
  LogOut,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

import { supabase } from '@/lib/supabase/client';

export default function AccountHubPage() {
  const router = useRouter();
  const { wishlist } = useWishlist();
  const [userName, setUserName] = useState('Member');
  const [fullName, setFullName] = useState('Dharvika Member');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [email, setEmail] = useState('');
  const [dietary, setDietary] = useState('Gluten-Free & High Fiber');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      // 1. Check Supabase session first
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const displayName = userMeta.full_name || session.user.email?.split('@')[0] || 'Member';
          setUserName(displayName.split(' ')[0]);
          setFullName(displayName);
          setEmail(session.user.email || '');
          if (userMeta.mobile) setMobile(userMeta.mobile);
          return;
        }
      } catch (err) {
        console.error(err);
      }

      // 2. Check server session cookie API
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUserName(data.user.fullName.split(' ')[0]);
            setFullName(data.user.fullName);
            setEmail(data.user.email);
            setMobile(data.user.mobile || '+91 98765 43210');
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }

      // 3. Check client storage fallback
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('dharvika_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.name) {
              setUserName(parsed.name.split(' ')[0]);
              setFullName(parsed.name);
            }
            if (parsed.email) setEmail(parsed.email);
            if (parsed.mobile) setMobile(parsed.mobile);
          } catch {}
        }
      }
    }

    checkAuth();
  }, []);

  const activeOrder = mockOrdersList[0];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}

    if (typeof window !== 'undefined') {
      localStorage.removeItem('dharvika_user');
      sessionStorage.removeItem('auth_identifier');
    }
    router.push('/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const navMenuItems = [
    {
      title: 'My Orders',
      icon: Package,
      href: '/account/orders',
      desc: 'Track live orders, view past receipts',
      badge: `${mockOrdersList.length} Orders`,
    },
    {
      title: 'Wishlist',
      icon: Heart,
      href: '/wishlist',
      desc: 'Products saved for later harvests',
      badge: `${wishlist.length} Items`,
    },
    {
      title: 'Saved Addresses',
      icon: MapPin,
      href: '/account/addresses',
      desc: 'Manage Home & Work delivery addresses',
      badge: '2 Saved',
    },
    {
      title: 'Coupons',
      icon: Tag,
      href: '/account/coupons',
      desc: 'Exclusive discounts & free shipping codes',
      badge: '4 Active',
    },
    {
      title: 'My Reviews',
      icon: Star,
      href: '/account/reviews',
      desc: 'Verified purchase ratings and feedback',
      badge: '3 Published',
    },
    {
      title: 'Profile Settings',
      icon: User,
      href: '/account/profile',
      desc: 'Update full name, verified email & phone',
      badge: 'Verified',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#E7DED4] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full bg-[#FAF7F2] p-1 border-2 border-[#C5A059] flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
              alt="Dharvika Emblem"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block">
              Customer Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3522]">
              Hello, {userName} 👋
            </h1>
            <p className="text-xs text-[#6B5B52] mt-0.5">
              Welcome back to your DHARVIKA GRAINS personal pantry portal.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/shop"
            className="px-5 py-2.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs"
          >
            Shop Catalogue
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 border border-[#E7DED4] hover:border-[#B35638] text-[#6B5B52] hover:text-[#B35638] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Active Order Spotlight Banner */}
      {activeOrder && (
        <div className="bg-[#FAF7F2] border border-[#C5A059]/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-[#0D3522] text-[#C5A059] rounded-full mt-0.5 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D3522]">
                  Active Order #{activeOrder.orderId}
                </span>
                <span className="px-2 py-0.5 bg-[#FDF7E7] text-[#C5A059] text-[10px] font-bold uppercase rounded-xs">
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-xs text-[#6B5B52] mt-1">
                Estimated arrival: <strong className="text-[#241611]">{activeOrder.estimatedDelivery}</strong> via {activeOrder.courierPartner}
              </p>
            </div>
          </div>

          <Link
            href={`/account/orders/${activeOrder.orderId}`}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border border-[#C5A059] text-[#0D3522] hover:bg-[#0D3522] hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs flex-shrink-0"
          >
            <span>Track Shipment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Account Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white border border-[#E7DED4] p-6 hover:border-[#C5A059] transition-all group shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E7DED4] flex items-center justify-center text-[#0D3522] group-hover:bg-[#0D3522] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 bg-[#FAF7F2] text-[#0D3522] border border-[#E7DED4] rounded-xs">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-[#241611] group-hover:text-[#0D3522] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B5B52] mt-0.5">{item.desc}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7DED4] mt-4 flex items-center justify-between text-xs font-semibold text-[#C5A059] group-hover:text-[#0D3522]">
                <span>Manage</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Profile Summary Card */}
      <div className="bg-white border border-[#E7DED4] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DED4]">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-lg font-serif font-bold text-[#0D3522] uppercase tracking-wider">
              Personal Information & Preferences
            </h2>
          </div>
          <Link
            href="/account/profile"
            className="text-xs text-[#0D3522] font-semibold hover:underline flex items-center space-x-1"
          >
            <span>Edit Full Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-[#EBF7EE] border border-[#0D3522]/30 text-[#0D3522] text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[#241611]">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[#241611]">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[#241611]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[#241611]">Dietary Preference</label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
            >
              <option value="Gluten-Free & High Fiber">Gluten-Free & High Fiber</option>
              <option value="Diabetic & Low GI">Diabetic & Low GI</option>
              <option value="Traditional Indian Culinary">Traditional Indian Culinary</option>
              <option value="All Grains">All Grains</option>
            </select>
          </div>

          <div className="md:col-span-2 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0D3522] hover:bg-[#134B31] text-white font-semibold uppercase tracking-wider text-xs shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
