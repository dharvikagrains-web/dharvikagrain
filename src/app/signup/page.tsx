'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || searchParams.get('from') || '';
  const isCheckoutRedirect = redirectParam === '/checkout' || redirectParam.startsWith('/checkout');

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanMobile }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch verification code. Please try again.');
        return;
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth_identifier', cleanMobile);
        sessionStorage.setItem('auth_type', 'mobile');
        sessionStorage.setItem('auth_name', fullName.trim());
        sessionStorage.setItem('auth_email', email.trim().toLowerCase());
        sessionStorage.setItem('auth_mobile', cleanMobile);
        if (redirectParam) {
          sessionStorage.setItem('auth_redirect', redirectParam);
        }
      }

      const redirectQuery = redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : '';
      router.push(`/verify-otp?target=${encodeURIComponent(cleanMobile)}&type=mobile${redirectQuery}`);
    } catch {
      setIsLoading(false);
      setError('Network communication error. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-white border border-[#E7DED4] p-8 sm:p-10 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto rounded-full bg-[#FAF7F2] p-0.5 border border-[#C5A059] shadow-xs overflow-hidden">
            <Image
              src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
              alt="Dharvika Emblem"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block">
            Dharvika Grains
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#0D3522]">
            {isCheckoutRedirect ? 'Register to Checkout' : 'Create Your Account'}
          </h1>
          <p className="text-xs text-[#6B5B52]">
            {isCheckoutRedirect
              ? 'Enter your verified details to place your order with live courier tracking'
              : 'Join our community for fresh harvests, exclusive releases, and farm-to-table traceability'}
          </p>
        </div>

        {isCheckoutRedirect && (
          <div className="p-3.5 bg-[#FAF3E8] border border-[#C5A059] text-[#785416] text-xs leading-relaxed flex items-start space-x-2.5 rounded-xs">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#241611]">Verified Customer Account Required</p>
              <p className="text-[11px] text-[#6B5B52] mt-0.5">
                Every grain harvest is tracked directly to your phone and email. Your cart is preserved and you will return directly to checkout.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#241611] block">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Pavan Geesala"
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#241611] block">
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-[#FAF7F2] border border-r-0 border-[#E7DED4] text-xs font-semibold text-[#241611]">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile"
                className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#241611] block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>DISPATCHING OTP...</span>
                </>
              ) : (
                <>
                  <span>CREATE ACCOUNT & SEND OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-[#E7DED4] text-center text-xs text-[#6B5B52]">
          Already have an account?{' '}
          <Link
            href={redirectParam ? `/signin?redirect=${encodeURIComponent(redirectParam)}` : '/signin'}
            className="text-[#0D3522] font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2]">
          <div className="w-8 h-8 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
