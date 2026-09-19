'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SupportWidget } from '@/components/support/SupportWidget';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <CartProvider>
      <WishlistProvider>
        {isAdminRoute ? (
          <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans antialiased">
            {children}
          </div>
        ) : (
          <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#241611]">
            <Header onOpenSearch={() => setIsSearchOpen(true)} />
            <main className="flex-1">{children}</main>
            <Footer />
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <CartDrawer />
            <SupportWidget />
          </div>
        )}
      </WishlistProvider>
    </CartProvider>
  );
}
