'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('dharvika_cookie_consent');
    if (!consent) {
      // Small delay for smooth entry after page load
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    } else if (consent === 'granted') {
      enableAnalytics();
    }
  }, []);

  const enableAnalytics = () => {
    if (typeof window !== 'undefined') {
      (window as any)['dharvika_analytics_enabled'] = true;
      // Dispatch custom event so gtag script can initialize if present
      window.dispatchEvent(new Event('dharvika_consent_granted'));
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem('dharvika_cookie_consent', 'granted');
    enableAnalytics();
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('dharvika_cookie_consent', 'essential');
    if (typeof window !== 'undefined') {
      (window as any)['dharvika_analytics_enabled'] = false;
    }
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent Notice"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2D9CE] shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Content */}
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="w-8 h-8 rounded-full bg-[#EBF2EE] text-[#1A382B] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Cookie className="w-4 h-4" />
          </div>
          <div className="text-xs text-[#5A4D45] leading-relaxed">
            <p className="font-semibold text-[#221814] text-[13px] mb-0.5 flex items-center gap-1.5">
              <span>Your Privacy & Cookie Choices</span>
              <span className="text-[10px] text-[#1A382B] bg-[#EBF2EE] px-1.5 py-0.2 rounded font-data">
                DPDP Act 2023 Compliant
              </span>
            </p>
            <p>
              We use strictly necessary cookies to power your cart and secure session tokens. With your consent, we also use aggregated analytical cookies to understand how you explore our harvest catalogue. We never sell your personal data. Read our{' '}
              <Link href="/cookie-policy" className="text-[#9E462A] underline font-medium hover:text-[#1A382B]">
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-[#9E462A] underline font-medium hover:text-[#1A382B]">
                Privacy Notice
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-shrink-0">
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="flex-1 sm:flex-initial px-4 py-2 border border-[#E2D9CE] hover:border-[#221814] bg-white text-[#5A4D45] hover:text-[#221814] text-xs font-semibold rounded-[6px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A382B] cursor-pointer"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-initial px-5 py-2 bg-[#1A382B] hover:bg-[#132B21] text-white text-xs font-semibold rounded-[6px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A382B] shadow-xs cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
