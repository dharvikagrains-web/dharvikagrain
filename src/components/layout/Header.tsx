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
  Sparkles,
  HelpCircle,
  Phone,
  Mail,
  ChevronRight,
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

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Millets', href: '/millets' },
    { label: 'Spices', href: '/spices' },
    { label: 'Combos', href: '/shop?category=combos' },
    { label: 'Our Story', href: '/about' },
    { label: 'Recipes', href: '/recipes' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DED4] transition-all">
      {/* Top utility ticker */}
      <div className="bg-[#0D3522] text-[#FAF7F2] text-[10px] sm:text-[11px] tracking-widest uppercase font-medium py-1.5 px-3 sm:px-4 text-center border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-block text-[#C5A059]">
            {brandConfig.mission} • {brandConfig.pillars?.join(' | ')}
          </span>
          <span className="mx-auto md:mx-0 truncate">
            Free Delivery on orders above ₹{brandConfig.freeShippingThreshold} • Direct from Farm Clusters
          </span>
          <span className="hidden md:inline-block text-[#E8DFD5]">
            100% Unpolished & Pure
          </span>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile hamburger menu */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 text-[#241611] hover:text-[#0D3522] transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>

          {/* Brand Logo with Luxury Embossed D Monogram */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center space-x-2 sm:space-x-3 text-left">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 rounded-full bg-[#FAF7F2] p-0.5 border border-[#C5A059]/50 shadow-xs group-hover:border-[#C5A059] group-hover:shadow-md transition-all overflow-hidden flex items-center justify-center">
                <Image
                  src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                  alt="Dharvika Grains Luxury Embossed Emblem"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain filter drop-shadow-xs transform group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg sm:text-2xl font-serif tracking-[0.14em] uppercase font-bold text-[#0D3522] group-hover:text-[#C5A059] transition-colors leading-tight">
                    Dharvika
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-semibold text-[#C5A059] uppercase -translate-y-1">
                    TM
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-1.5 -mt-0.5">
                  <span className="w-2 sm:w-2.5 h-px bg-[#C5A059]/70"></span>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.28em] text-[#C5A059] uppercase font-semibold leading-none">
                    G R A I N S
                  </span>
                  <span className="w-2 sm:w-2.5 h-px bg-[#C5A059]/70"></span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Center Navigation */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest font-semibold transition-colors py-1 relative ${
                    isActive ? 'text-[#B35638]' : 'text-[#241611]/80 hover:text-[#B35638]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B35638]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 text-[#241611] hover:text-[#B35638] transition-colors rounded-full focus:outline-none"
              aria-label="Search catalogue, recipes, and journal"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="hidden sm:inline-flex p-2 text-[#241611] hover:text-[#B35638] transition-colors rounded-full"
              aria-label="My Account"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="hidden sm:inline-flex relative p-2 text-[#241611] hover:text-[#B35638] transition-colors rounded-full"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#B35638] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-1.5 sm:p-2 text-[#241611] hover:text-[#B35638] transition-colors rounded-full focus:outline-none"
              aria-label={`Shopping cart containing ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#0D3522] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Mobile Drawer Menu (Portal to document.body to avoid backdrop-blur trap)
          ========================================================================= */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 lg:hidden" style={{ zIndex: 99999 }}>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#241611]/70 backdrop-blur-xs transition-opacity duration-300"
              style={{ zIndex: 99998 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <div
              className="fixed inset-y-0 left-0 w-[86vw] max-w-sm h-full shadow-2xl flex flex-col justify-between border-r border-[#E7DED4] overflow-y-auto animate-in slide-in-from-left duration-300"
              style={{ backgroundColor: '#FAF7F2', zIndex: 99999 }}
            >
              {/* Drawer Top / Header */}
              <div>
                <div className="p-5 border-b border-[#E7DED4] bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="relative w-10 h-10 rounded-full bg-[#FAF7F2] p-0.5 border border-[#C5A059] overflow-hidden flex-shrink-0">
                      <Image
                        src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                        alt="Dharvika Emblem"
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-base font-serif font-bold tracking-[0.1em] text-[#0D3522] uppercase block leading-tight">
                        Dharvika Grains
                      </span>
                      <p className="text-[9px] tracking-widest text-[#C5A059] uppercase font-bold">
                        Nourishing a Better Tomorrow
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-[#6B5B52] hover:text-[#B35638] rounded-full transition-colors"
                    aria-label="Close mobile menu"
                  >
                    <X className="w-6 h-6 stroke-[1.8]" />
                  </button>
                </div>

                {/* Sub-banner */}
                <div className="bg-[#0D3522] text-[#FAF7F2] px-5 py-2 text-[10px] tracking-wider uppercase font-semibold flex items-center justify-between border-b border-[#C5A059]/40">
                  <span className="text-[#C5A059]">Farm to Home</span>
                  <span>100% Unpolished & Pure</span>
                </div>

                {/* Navigation Category Links */}
                <nav className="p-4 space-y-1">
                  <span className="px-3 pt-2 pb-1 text-[10px] uppercase font-bold tracking-widest text-[#8C7A70] block">
                    Menu & Catalog
                  </span>

                  {[
                    { label: 'Shop All Products', href: '/shop' },
                    { label: 'Chiru Dhanyalu (Millets)', href: '/millets' },
                    { label: 'Pure Spices', href: '/spices' },
                    { label: 'Signature Masalas', href: '/shop?category=masalas' },
                    { label: 'Farm Combos & Kits', href: '/shop?category=combos' },
                    { label: 'Our Story & Sourcing', href: '/about' },
                    { label: 'Traditional Recipes', href: '/recipes' },
                    { label: 'Batch Traceability & Quality', href: '/quality' },
                  ].map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold tracking-wider rounded-xs transition-colors ${
                          isActive
                            ? 'bg-[#EBF7EE] text-[#0D3522] font-bold'
                            : 'text-[#241611] hover:bg-[#F5EFEB] hover:text-[#0D3522]'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8C7A70]" />
                      </Link>
                    );
                  })}
                </nav>

                {/* Account & Orders Shortcut Cards */}
                <div className="px-4 py-2 border-t border-[#E7DED4] space-y-2">
                  <span className="px-3 pt-1 text-[10px] uppercase font-bold tracking-widest text-[#8C7A70] block">
                    My Account
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-white border border-[#E7DED4] hover:border-[#0D3522] rounded-xs flex items-center space-x-2 text-xs font-semibold text-[#241611] transition-colors shadow-xs"
                    >
                      <User className="w-4 h-4 text-[#C5A059]" />
                      <span>Account</span>
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-white border border-[#E7DED4] hover:border-[#0D3522] rounded-xs flex items-center space-x-2 text-xs font-semibold text-[#241611] transition-colors shadow-xs"
                    >
                      <Package className="w-4 h-4 text-[#C5A059]" />
                      <span>Orders</span>
                    </Link>
                  </div>

                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full p-2.5 bg-white border border-[#E7DED4] hover:border-[#0D3522] rounded-xs flex items-center justify-between text-xs font-semibold text-[#241611] transition-colors shadow-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-[#B35638]" />
                      <span>Saved Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 bg-[#B35638] text-white text-[10px] font-bold rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Bottom Support & Help Snippet */}
              <div className="p-5 border-t border-[#E7DED4] bg-[#F5EFEB] space-y-2.5 text-xs text-[#6B5B52]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#241611]">Customer Care Desk</span>
                  <span className="text-[#0D3522] font-semibold">10 AM - 6 PM IST</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <a
                    href="mailto:care@dharvikagrains.in"
                    className="flex items-center space-x-1.5 text-[#241611] hover:text-[#0D3522]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>care@dharvikagrains.in</span>
                  </a>
                  <p className="flex items-center space-x-1.5 text-[#241611]">
                    <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>WhatsApp: +91 98765 43210</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E7DED4] flex items-center justify-between text-[11px]">
                  <Link
                    href="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#0D3522] font-semibold hover:underline"
                  >
                    Help & FAQs
                  </Link>
                  <a
                    href={brandConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B35638] font-semibold hover:underline"
                  >
                    {brandConfig.instagramHandle}
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
