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
    <footer className="bg-[#1A281B] text-[#E7E2D6] border-t border-[#2A3B2B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#2A3B2B]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#E7D8B8] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-semibold text-white tracking-wide">100% Unpolished &amp; Pure</h4>
              <p className="text-[12px] text-[#A6A295] mt-0.5 leading-relaxed">
                Zero chemical polishes, artificial dyes, or toxic fumigants.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#E7D8B8] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-semibold text-white tracking-wide">Complimentary Shipping &gt; ₹500</h4>
              <p className="text-[12px] text-[#A6A295] mt-0.5 leading-relaxed">
                Pan-India prompt dispatch in fresh moisture-barrier packs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#E7D8B8] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-semibold text-white tracking-wide">Cold-Ground Milling</h4>
              <p className="text-[12px] text-[#A6A295] mt-0.5 leading-relaxed">
                Low-temperature grinding retains volatile essential oils.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-[#E7D8B8] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-semibold text-white tracking-wide">Traceable Batches</h4>
              <p className="text-[12px] text-[#A6A295] mt-0.5 leading-relaxed">
                Every pack carries crop harvest district and milling lot data.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-[6px] bg-white p-1 border border-[#3A4E3B] shadow-sm overflow-hidden flex-shrink-0">
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
                <span className="text-[10px] tracking-[0.22em] text-[#C47B4B] uppercase font-semibold font-data">
                  {brandConfig.mission}
                </span>
              </div>
            </div>

            <p className="text-[13px] tracking-wide text-[#E7D8B8] italic font-serif">
              &ldquo;{brandConfig.tagline}&rdquo;
            </p>

            <p className="text-[13px] leading-relaxed text-[#B7B2A4] max-w-sm">
              Rooted in the agrarian heritage of the Deccan plateau. We bridge authentic rain-fed millets and unadulterated spices with the convenience of contemporary Indian kitchens.
            </p>
            <div className="pt-2 text-[12px] text-[#8E8A7D] space-y-1 font-data">
              <p>FSSAI Registration: <span className="text-[#E7D8B8]">{brandConfig.fssaiNumber}</span></p>
              <p>Registered Packaging Facility: <span className="text-[#B7B2A4]">{brandConfig.registeredOffice}</span></p>
            </div>
          </div>

          {/* Column 2: Catalogue */}
          <div>
            <h3 className="text-[12px] font-semibold tracking-wider uppercase text-white mb-4 font-data">
              Store Catalogue
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#B7B2A4]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop All Staples
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
                  Wood-Pressed Oils
                </Link>
              </li>
              <li>
                <Link href="/shop?category=combos" className="hover:text-white transition-colors">
                  Curated Pantry Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sourcing & Culture */}
          <div>
            <h3 className="text-[12px] font-semibold tracking-wider uppercase text-white mb-4 font-data">
              Our Journey
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#B7B2A4]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Why We Started
                </Link>
              </li>
              <li>
                <Link href="/sourcing" className="hover:text-white transition-colors">
                  Farmgate Sourcing
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-white transition-colors">
                  Quality &amp; Purity Protocols
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
                  Preparation &amp; Cooking FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Support */}
          <div>
            <h3 className="text-[12px] font-semibold tracking-wider uppercase text-white mb-4 font-data">
              Kitchen Dispatch
            </h3>
            <p className="text-[12px] text-[#B7B2A4] mb-3 leading-relaxed">
              Harvest updates, regional millet recipes, and thoughtful notes on traditional grain culture.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[#E7D8B8] text-[12px] py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for joining our culinary journey.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email address for harvest newsletter
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#243725] border border-[#3A4E3B] rounded-[5px] py-2 px-3 text-[13px] text-white placeholder-[#8E8A7D] focus:outline-none focus:border-[#E7D8B8] focus:ring-1 focus:ring-[#E7D8B8]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#354C36] hover:bg-[#2A3E2B] text-white text-[12px] font-semibold rounded-[4px] transition-colors flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7D8B8]"
                    aria-label="Subscribe to harvest newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#8E8A7D] leading-tight">
                  By subscribing, you agree to receive harvest updates. Unsubscribe anytime per our Privacy Policy.
                </p>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-[#2A3B2B] text-[12px]">
              <p className="text-white font-medium mb-1">Customer Care Desk</p>
              <p className="text-[#8E8A7D]">{brandConfig.supportEmail}</p>
              <p className="text-[#8E8A7D]">{brandConfig.supportHours}</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimers & Copyright */}
        <div className="pt-8 border-t border-[#2A3B2B] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#8E8A7D] gap-4 font-data">
          <div>
            © {new Date().getFullYear()} {brandConfig.brandName}. All rights reserved. Packaged in verified food-grade facilities in India.
          </div>
          <div className="flex flex-wrap items-center gap-3.5 text-[#B7B2A4]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund &amp; Return Policy
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
