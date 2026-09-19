'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { brandConfig } from '@/data/brandConfig';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Chiru Dhanyalu', href: '/millets' },
    { label: 'Pure Spices', href: '/spices' },
    { label: 'Our Story', href: '/about' },
    { label: 'Sourcing & Quality', href: '/sourcing' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'Journal', href: '/journal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DED4] transition-all">
      {/* Top utility ticker */}
      <div className="bg-[#0D3522] text-[#FAF7F2] text-[11px] tracking-widest uppercase font-medium py-1.5 px-4 text-center border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-block text-[#C5A059]">
            {brandConfig.mission} • {brandConfig.pillars?.join(' | ')}
          </span>
          <span className="mx-auto md:mx-0">
            Free Delivery on orders above ₹{brandConfig.freeShippingThreshold} • Direct from Farm Clusters
          </span>
          <span className="hidden md:inline-block text-[#E8DFD5]">
            100% Unpolished & Pure
          </span>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger menu */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#241611] hover:text-[#0D3522] transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Brand Logo with Luxury Embossed D Monogram */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center space-x-3 text-left">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-[#FAF7F2] p-0.5 border border-[#C5A059]/40 shadow-xs group-hover:border-[#C5A059] group-hover:shadow-md transition-all overflow-hidden flex items-center justify-center">
                <Image
                  src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                  alt="Dharvika Grains Luxury Embossed Emblem"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain filter drop-shadow-xs transform group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl sm:text-2xl font-serif tracking-[0.14em] uppercase font-bold text-[#0D3522] group-hover:text-[#C5A059] transition-colors leading-tight">
                    Dharvika
                  </span>
                  <span className="text-[9px] font-semibold text-[#C5A059] uppercase -translate-y-1">
                    TM
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 -mt-0.5">
                  <span className="w-2.5 h-px bg-[#C5A059]/70"></span>
                  <span className="text-[9px] tracking-[0.3em] text-[#C5A059] uppercase font-semibold leading-none">
                    G R A I N S
                  </span>
                  <span className="w-2.5 h-px bg-[#C5A059]/70"></span>
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
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-[#241611] hover:text-[#B35638] transition-colors rounded-full focus:outline-none"
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
              href="/account?tab=wishlist"
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
              className="relative p-2 text-[#241611] hover:text-[#B35638] transition-colors rounded-full focus:outline-none"
              aria-label={`Shopping cart containing ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#241611] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#241611]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF7F2] shadow-2xl p-6 flex flex-col justify-between z-10 border-r border-[#E7DED4]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E7DED4]">
                <div className="flex items-center space-x-3">
                  <div className="relative w-9 h-9 rounded-full bg-[#FAF7F2] p-0.5 border border-[#C5A059]/40 overflow-hidden flex-shrink-0">
                    <Image
                      src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                      alt="Dharvika Emblem"
                      width={36}
                      height={36}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-base font-serif font-bold tracking-[0.12em] text-[#0D3522] uppercase block leading-tight">
                      Dharvika Grains
                    </span>
                    <p className="text-[9px] tracking-widest text-[#C5A059] uppercase font-semibold">
                      {brandConfig.mission}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#241611] hover:text-[#B35638]"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 stroke-[1.5]" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="mt-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold tracking-wider text-[#241611] hover:text-[#B35638] py-1 border-b border-[#F0E8DF]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold tracking-wider text-[#241611] hover:text-[#B35638] py-1 border-b border-[#F0E8DF]"
                >
                  My Account & Orders
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold tracking-wider text-[#241611] hover:text-[#B35638] py-1"
                >
                  Frequently Asked Questions
                </Link>
              </nav>
            </div>

            {/* Bottom Contact / Brand snippet */}
            <div className="pt-6 border-t border-[#E7DED4] text-xs text-[#6B5B52] space-y-2">
              <p className="font-medium text-[#241611]">Customer Support:</p>
              <p>{brandConfig.supportEmail}</p>
              <p>{brandConfig.supportHours}</p>
              <div className="pt-2">
                <a
                  href={brandConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B35638] font-semibold hover:underline"
                >
                  Follow {brandConfig.instagramHandle}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
