'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brandConfig } from '@/data/brandConfig';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#150F0B] text-[#E8DFD5] border-t border-[#38241C] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#38241C]/80">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#C4924A] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Unpolished & Pure</h4>
              <p className="text-xs text-[#A8988E] mt-0.5 leading-relaxed">
                Zero chemical polishes, artificial dyes, or fumigants.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Truck className="w-6 h-6 text-[#C4924A] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Free Shipping &gt; ₹500</h4>
              <p className="text-xs text-[#A8988E] mt-0.5 leading-relaxed">
                Pan-India prompt dispatch in fresh moisture-barrier packs.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-[#C4924A] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Cold-Ground Milling</h4>
              <p className="text-xs text-[#A8988E] mt-0.5 leading-relaxed">
                Low-temperature grinding retains volatile essential oils.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RefreshCw className="w-6 h-6 text-[#C4924A] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Traceable Batches</h4>
              <p className="text-xs text-[#A8988E] mt-0.5 leading-relaxed">
                Every pack carries crop harvest and milling batch data.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full bg-[#FAF7F2] p-0.5 border border-[#C5A059]/60 shadow-md overflow-hidden flex-shrink-0">
                <Image
                  src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                  alt="Dharvika Emblem"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-serif tracking-[0.12em] uppercase font-bold text-white block leading-tight">
                  Dharvika Grains
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-semibold">
                  {brandConfig.mission}
                </span>
              </div>
            </div>

            {/* Brand Pillars */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-semibold">
              <span>Tradition</span>
              <span>•</span>
              <span>Purity</span>
              <span>•</span>
              <span>People</span>
              <span>•</span>
              <span>Planet</span>
            </div>

            <p className="text-xs tracking-wider text-[#E8DFD5] italic font-serif">
              &ldquo;{brandConfig.tagline}&rdquo;
            </p>

            <p className="text-xs leading-relaxed text-[#B8A89E] max-w-sm">
              Rooted in the agricultural wisdom of the Deccan plateau. We bridge authentic rain-fed millets
              and unadulterated spices with the convenience of modern Indian kitchens.
            </p>
            <div className="pt-2 text-xs text-[#8C7A70] space-y-1">
              <p>FSSAI Registration: <span className="text-[#B8A89E]">{brandConfig.fssaiNumber}</span></p>
              <p>Registered Facility: <span className="text-[#B8A89E]">{brandConfig.registeredOffice}</span></p>
            </div>
          </div>

          {/* Column 2: The Catalogue */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
              Catalogue
            </h3>
            <ul className="space-y-2.5 text-xs text-[#B8A89E]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/millets" className="hover:text-white transition-colors">
                  Chiru Dhanyalu (Millets)
                </Link>
              </li>
              <li>
                <Link href="/spices" className="hover:text-white transition-colors">
                  Single-Origin Spices
                </Link>
              </li>
              <li>
                <Link href="/products/signature-regional-spice-blend" className="hover:text-white transition-colors">
                  Signature Spice Blend
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=bestsellers" className="hover:text-white transition-colors">
                  Bestselling Grains
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sourcing & Culture */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
              Our Journey
            </h3>
            <ul className="space-y-2.5 text-xs text-[#B8A89E]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Why We Started
                </Link>
              </li>
              <li>
                <Link href="/sourcing" className="hover:text-white transition-colors">
                  Farm-to-Home Sourcing
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-white transition-colors">
                  Quality & Purity Standards
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-white transition-colors">
                  Traditional Recipes
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white transition-colors">
                  The Kitchen Journal
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ & Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Community */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
              Join Our Kitchen
            </h3>
            <p className="text-xs text-[#B8A89E] mb-3 leading-relaxed">
              Harvest updates, regional recipes, and honest notes on traditional food culture.
            </p>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-[#C4924A] text-xs py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for joining our journey.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#2A1A13] border border-[#4A342B] rounded-none py-2.5 px-3 text-xs text-white placeholder-[#8C7A70] focus:outline-none focus:border-[#C4924A]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-[#B35638] hover:bg-[#C96645] text-white text-xs font-medium transition-colors flex items-center justify-center"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-[#38241C] text-xs">
              <p className="text-white font-medium mb-1">Customer Care</p>
              <p className="text-[#8C7A70]">{brandConfig.supportEmail}</p>
              <p className="text-[#8C7A70]">{brandConfig.supportHours}</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimers & Copyright */}
        <div className="pt-8 border-t border-[#38241C] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#8C7A70] gap-4">
          <div>
            © {new Date().getFullYear()} {brandConfig.brandName}. All rights reserved. Packaged in certified food-grade facilities in India.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[#A8988E]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund & Return Policy
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
