'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Boxes,
  Wheat,
  Truck,
  RotateCcw,
  TicketPercent,
  Star,
  BarChart3,
  Users,
  Settings,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '18' },
  { name: 'Products', href: '/admin/products', icon: Tag },
  { name: 'Inventory', href: '/admin/inventory', icon: Boxes, alert: true },
  { name: 'Batches (Traceability)', href: '/admin/batches', icon: Wheat },
  { name: 'Shipping', href: '/admin/shipping', icon: Truck },
  { name: 'Returns & Refunds', href: '/admin/returns', icon: RotateCcw, badge: '2' },
  { name: 'Coupons & Discounts', href: '/admin/coupons', icon: TicketPercent },
  { name: 'Reviews Moderation', href: '/admin/reviews', icon: Star },
  { name: 'Analytics & Reports', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Store Settings', href: '/admin/settings', icon: Settings },
];
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  const isAdminLogin = pathname === '/admin/login';

  React.useEffect(() => {
    if (isAdminLogin) {
      setHasSession(true);
      return;
    }

    let mounted = true;

    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          if (mounted) {
            setHasSession(false);
            router.push('/login');
          }
        } else {
          if (mounted) {
            setHasSession(true);
          }
        }
      } catch {
        if (mounted) {
          setHasSession(false);
          router.push('/login');
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [isAdminLogin, router]);

  if (isAdminLogin) {
    return <>{children}</>;
  }

  if (hasSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161B18]">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1E293B] flex">
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#1A120E] text-white z-50 flex flex-col justify-between transition-transform duration-300 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-full bg-[#FAF7F2] p-0.5 border border-[#C5A059] flex items-center justify-center">
                <Image
                  src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                  alt="Dharvika Emblem"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-xs tracking-wider text-[#FAF7F2] block">
                  DHARVIKA GRAINS
                </span>
                <span className="text-[10px] text-[#C5A059] tracking-widest uppercase font-semibold">
                  Admin Command
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors ${
                    isActive
                      ? 'bg-[#0D3522] text-[#FAF7F2] font-semibold shadow-xs'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-white/50'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#B35638] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Storefront Switcher & Profile Footer */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#130D0A]">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-[11px] rounded-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center space-x-2.5 pt-1">
            <div className="w-7 h-7 rounded-full bg-[#0D3522] text-white flex items-center justify-center text-xs font-bold font-mono">
              AD
            </div>
            <div className="text-[11px] min-w-0">
              <p className="font-semibold text-white truncate">Administrator</p>
              <p className="text-[10px] text-white/50 truncate">ops@dharvikagrains.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 border border-gray-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers, batches..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xs focus:outline-none focus:border-[#0D3522] text-gray-800"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-[#EBF7EE] text-[#0D3522] text-[11px] font-semibold border border-[#0D3522]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FSSAI Certified Operations</span>
            </div>

            <button
              type="button"
              className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B35638]" />
            </button>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center space-x-1 text-xs text-[#0D3522] hover:text-[#B35638] font-semibold"
            >
              <span>View Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
