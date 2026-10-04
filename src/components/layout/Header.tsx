'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { brandConfig } from '@/data/brandConfig';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Package,
  ChevronRight,
  Mail,
  Phone,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Clean navigation links per user specification
  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Millets', href: '/millets' },
    { label: 'Spices', href: '/spices' },
    { label: 'Our Story', href: '/about' },
    { label: 'Recipes', href: '/recipes' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E2D9CE] transition-all">
      {/* Top Utility Ticker */}
      <div className="bg-[#1A382B] text-[#FAF7F2] text-[11px] font-data tracking-wider uppercase font-medium py-1.5 px-4 text-center border-b border-[#132B21]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-block text-[#A3C7B5]">
            Single-Origin Andhra & Telangana Grains
          </span>
          <span className="mx-auto md:mx-0 truncate">
            Free Delivery on orders above ₹{brandConfig.freeShippingThreshold} · Direct from Farm Clusters
          </span>
          <span className="hidden md:inline-block text-[#D4E3DB]">
            100% Unpolished & Pure
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Hamburger Menu */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#221814] hover:text-[#1A382B] transition-colors rounded-[6px]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>

          {/* Brand Logo & Wordmark */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 rounded-[8px] bg-white p-1 border border-[#E2D9CE] group-hover:border-[#1A382B] transition-all overflow-hidden flex items-center justify-center">
                <Image
                  src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                  alt="Dharvika Grains Emblem"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain filter drop-shadow-2xs"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-serif tracking-[0.08em] uppercase font-semibold text-[#1A382B] group-hover:text-[#9E462A] transition-colors leading-none">
                    Dharvika
                  </span>
                  <span className="text-[9px] font-data font-semibold text-[#9E462A] uppercase">
                    TM
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-3 h-px bg-[#E2D9CE]"></span>
                  <span className="text-[9px] tracking-[0.22em] text-[#685950] uppercase font-medium leading-none font-data">
                    G R A I N S
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Center Navigation (14–15px DM Sans Medium) */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-dmsans text-[14px] font-medium tracking-wide transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#1A382B] font-semibold'
                      : 'text-[#5A4D45] hover:text-[#1A382B]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A382B]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Commerce Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="hidden md:flex items-center gap-2 bg-white hover:bg-[#FAF7F2] border border-[#E2D9CE] rounded-[6px] px-3.5 py-2 text-[13px] text-[#685950] transition-all shadow-2xs group focus:outline-none focus:ring-1 focus:ring-[#1A382B]"
              aria-label="Search catalogue, millets, spices, recipes"
            >
              <Search className="w-3.5 h-3.5 text-[#685950] group-hover:text-[#1A382B] transition-colors" />
              <span className="font-dmsans text-[13px]">Search Grains & Spices...</span>
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="md:hidden p-2 text-[#221814] hover:text-[#1A382B] transition-colors rounded-[6px]"
              aria-label="Open search modal"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Account Icon */}
            <Link
              href="/account"
              className="hidden sm:inline-flex p-2 text-[#221814] hover:text-[#1A382B] transition-colors rounded-[6px]"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="hidden sm:inline-flex relative p-2 text-[#221814] hover:text-[#9E462A] transition-colors rounded-[6px]"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#9E462A] text-white text-[10px] font-data font-semibold w-4 h-4 rounded-[4px] flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-[#221814] hover:text-[#1A382B] transition-colors rounded-[6px] focus:outline-none"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#1A382B] text-white text-[10px] font-data font-semibold w-4 h-4 rounded-[4px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Mobile Drawer Menu (Portal to document.body)
          ========================================================================= */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 lg:hidden" style={{ zIndex: 99999 }}>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#140E0A]/60 backdrop-blur-xs transition-opacity duration-300"
              style={{ zIndex: 99998 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <div
              className="fixed inset-y-0 left-0 w-[84vw] max-w-sm h-full shadow-xl flex flex-col justify-between border-r border-[#E2D9CE] overflow-y-auto"
              style={{ backgroundColor: '#FAF7F2', zIndex: 99999 }}
            >
              <div>
                {/* Drawer Header */}
                <div className="p-4 border-b border-[#E2D9CE] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-[6px] bg-[#FAF7F2] p-1 border border-[#E2D9CE] flex-shrink-0">
                      <Image
                        src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                        alt="Dharvika Emblem"
                        width={36}
                        height={36}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[17px] font-serif font-semibold tracking-wide text-[#1A382B] block leading-none">
                        Dharvika Grains
                      </span>
                      <p className="text-[10px] tracking-widest text-[#9E462A] uppercase font-data mt-0.5">
                        Pure Chiru Dhanyalu
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#685950] hover:text-[#9E462A] rounded-[6px]"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 stroke-[1.8]" />
                  </button>
                </div>

                {/* Sub-banner */}
                <div className="bg-[#1A382B] text-[#FAF7F2] px-4 py-2 text-[11px] font-data tracking-wider uppercase font-medium flex items-center justify-between">
                  <span>Farm to Home</span>
                  <span>100% Unpolished</span>
                </div>

                {/* Nav Links */}
                <nav className="p-4 space-y-1">
                  <span className="px-3 pt-2 pb-1 text-[11px] uppercase font-semibold tracking-wider text-[#8C7A70] block font-data">
                    Store Catalog
                  </span>

                  {[
                    { label: 'Shop All Staples', telugu: 'అన్ని ధాన్యాలు', href: '/shop' },
                    { label: 'Chiru Dhanyalu (Millets)', telugu: 'సిరి ధాన్యాలు', href: '/millets' },
                    { label: 'Pure Spices', telugu: 'స్వచ్ఛమైన మసాలాలు', href: '/spices' },
                    { label: 'Our Story & Heritage', telugu: 'రైతు కథనం', href: '/about' },
                    { label: 'Traditional Recipes', telugu: 'వంటకాలు', href: '/recipes' },
                    { label: 'Batch Traceability & Quality', telugu: 'నాణ్యత ప్రమాణాలు', href: '/quality' },
                  ].map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-[6px] transition-colors ${
                          isActive
                            ? 'bg-[#EBF2EE] text-[#1A382B] font-semibold'
                            : 'text-[#221814] hover:bg-[#F4EFEA]'
                        }`}
                      >
                        <div>
                          <span className="text-[14px] font-dmsans block">{link.label}</span>
                          <span className="text-[11px] font-telugu text-[#9E462A]">{link.telugu}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8C7A70]" />
                      </Link>
                    );
                  })}
                </nav>

                {/* Account & Orders */}
                <div className="px-4 py-3 border-t border-[#E2D9CE] space-y-2">
                  <span className="px-3 text-[11px] uppercase font-semibold tracking-wider text-[#8C7A70] block font-data">
                    Customer Account
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-white border border-[#E2D9CE] rounded-[6px] flex items-center gap-2 text-[13px] font-medium text-[#221814]"
                    >
                      <User className="w-4 h-4 text-[#1A382B]" />
                      <span>Account</span>
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-white border border-[#E2D9CE] rounded-[6px] flex items-center gap-2 text-[13px] font-medium text-[#221814]"
                    >
                      <Package className="w-4 h-4 text-[#1A382B]" />
                      <span>Orders</span>
                    </Link>
                  </div>

                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full p-2.5 bg-white border border-[#E2D9CE] rounded-[6px] flex items-center justify-between text-[13px] font-medium text-[#221814]"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#9E462A]" />
                      <span>Saved Items</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 bg-[#9E462A] text-white text-[11px] font-semibold rounded-[4px]">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Bottom Support Desk */}
              <div className="p-4 border-t border-[#E2D9CE] bg-[#F4EFEA] space-y-2 text-[12px] text-[#685950]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#221814]">Customer Support</span>
                  <span className="text-[#1A382B] font-data">10 AM – 6 PM IST</span>
                </div>
                <div className="space-y-1 text-[12px]">
                  <a
                    href="mailto:care@dharvikagrains.in"
                    className="flex items-center gap-2 text-[#221814] hover:text-[#1A382B]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#1A382B]" />
                    <span>care@dharvikagrains.in</span>
                  </a>
                  <p className="flex items-center gap-2 text-[#221814]">
                    <Phone className="w-3.5 h-3.5 text-[#1A382B]" />
                    <span>WhatsApp: +91 98765 43210</span>
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
