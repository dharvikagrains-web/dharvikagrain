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
    <footer className="bg-[#18120E] text-[#E8DFD5] border-t border-[#2E2019] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#2E2019]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#86EFAC] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-semibold text-white tracking-wide">100% Unpolished & Pure</h4>
              <p className="text-[12px] text-[#A8988E] mt-0.5 leading-relaxed">
                Zero chemical polishes, artificial dyes, or fumigants.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#86EFAC] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-semibold text-white tracking-wide">Free Shipping &gt; ₹500</h4>
              <p className="text-[12px] text-[#A8988E] mt-0.5 leading-relaxed">
                Pan-India prompt dispatch in fresh moisture-barrier packs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#86EFAC] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-semibold text-white tracking-wide">Cold-Ground Milling</h4>
              <p className="text-[12px] text-[#A8988E] mt-0.5 leading-relaxed">
                Low-temperature grinding retains volatile essential oils.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-[#86EFAC] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-semibold text-white tracking-wide">Traceable Batches</h4>
              <p className="text-[12px] text-[#A8988E] mt-0.5 leading-relaxed">
                Every pack carries crop harvest and milling batch data.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-[8px] bg-white p-1 border border-[#3E2C22] shadow-sm overflow-hidden flex-shrink-0">
                <Image
                  src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                  alt="Dharvika Emblem"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-serif tracking-[0.08em] uppercase font-semibold text-white block leading-tight">
                  Dharvika Grains
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#9E462A] uppercase font-semibold font-data">
                  {brandConfig.mission}
                </span>
              </div>
            </div>

            <p className="text-[13px] tracking-wide text-[#E8DFD3] italic font-serif">
              &ldquo;{brandConfig.tagline}&rdquo;
            </p>

            <p className="text-[13px] leading-relaxed text-[#B8A89E] max-w-sm">
              Rooted in the agricultural heritage of the Deccan plateau. We bridge authentic rain-fed millets and unadulterated spices with the convenience of modern Indian kitchens.
            </p>
            <div className="pt-2 text-[12px] text-[#8C7A70] space-y-1 font-data">
              <p>FSSAI Registration: <span className="text-[#B8A89E]">{brandConfig.fssaiNumber}</span></p>
              <p>Registered Facility: <span className="text-[#B8A89E]">{brandConfig.registeredOffice}</span></p>
            </div>
          </div>

          {/* Column 2: Catalogue */}
          <div>
            <h3 className="text-[12px] font-semibold tracking-wider uppercase text-white mb-4 font-data">
              Store Catalogue
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#B8A89E]">
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
                <Link href="/shop?category=oils" className="hover:text-white transition-colors">
                  Cold-Pressed Oils
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sourcing & Culture */}
          <div>
            <h3 className="text-[12px] font-semibold tracking-wider uppercase text-white mb-4 font-data">
              Our Journey
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#B8A89E]">
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

          {/* Column 4: Newsletter & Support */}
          <div>
            <h3 className="text-[12px] font-semibold tracking-wider uppercase text-white mb-4 font-data">
              Join Our Kitchen
            </h3>
            <p className="text-[12px] text-[#B8A89E] mb-3 leading-relaxed">
              Harvest updates, regional millet recipes, and honest notes on traditional grain culture.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[#86EFAC] text-[12px] py-2">
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
                    className="w-full bg-[#241B16] border border-[#3E2C22] rounded-[6px] py-2 px-3 text-[13px] text-white placeholder-[#8C7A70] focus:outline-none focus:border-[#86EFAC]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#1A382B] hover:bg-[#132B21] text-white text-[12px] font-semibold rounded-[4px] transition-colors flex items-center justify-center"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-[#2E2019] text-[12px]">
              <p className="text-white font-medium mb-1">Customer Care</p>
              <p className="text-[#8C7A70]">{brandConfig.supportEmail}</p>
              <p className="text-[#8C7A70]">{brandConfig.supportHours}</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimers & Copyright */}
        <div className="pt-8 border-t border-[#2E2019] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#8C7A70] gap-4 font-data">
          <div>
            © {new Date().getFullYear()} {brandConfig.brandName}. All rights reserved. Packaged in verified food-grade facilities in India.
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
