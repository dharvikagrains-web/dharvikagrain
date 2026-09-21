'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { ArrowRight, RefreshCw, ShieldCheck, Mail, Phone } from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || searchParams.get('from') || '';
  const isCheckoutRedirect = redirectParam === '/checkout' || redirectParam.startsWith('/checkout');

  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const identifier = authMethod === 'mobile' ? mobile.replace(/\D/g, '') : email.trim().toLowerCase();

    if (authMethod === 'mobile' && identifier.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (authMethod === 'email' && !identifier.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch verification code. Please try again.');
        setLoading(false);
        return;
      }

      // Store destination in sessionStorage and navigate to /verify-otp
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth_identifier', identifier);
        sessionStorage.setItem('auth_type', authMethod);
        if (redirectParam) {
          sessionStorage.setItem('auth_redirect', redirectParam);
        }
      }

      const redirectQuery = redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : '';
      router.push(`/verify-otp?target=${encodeURIComponent(identifier)}&type=${authMethod}${redirectQuery}`);
    } catch (err) {
      setError('Network communication error. Please check your internet connection.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Demo Google SSO provider endpoint handler
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const destination = redirectParam || '/account';
      router.push(destination);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-white border border-[#E7DED4] p-8 sm:p-10 shadow-lg space-y-6">
        {/* Brand Header */}
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
            {isCheckoutRedirect ? 'Sign In to Place Order' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-[#6B5B52]">
            {isCheckoutRedirect
              ? 'Please sign in or register to complete your order and track delivery'
              : 'Sign in to access your orders, saved addresses, and wishlist'}
          </p>
        </div>

        {isCheckoutRedirect && (
          <div className="p-3.5 bg-[#FAF3E8] border border-[#C5A059] text-[#785416] text-xs leading-relaxed flex items-start space-x-2.5 rounded-xs">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#241611]">Account Required to Checkout</p>
              <p className="text-[11px] text-[#6B5B52] mt-0.5">
                We track every order, batch certificate, and delivery updates against your verified account. Your cart will be ready when you return.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs text-center leading-relaxed">
            {error}
          </div>
        )}

        {/* Method Switcher: Mobile vs Email */}
        <div className="flex border border-[#E7DED4] p-0.5 bg-[#FAF7F2] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('mobile');
              setError(null);
            }}
            className={`w-1/2 py-2 flex items-center justify-center space-x-1.5 transition-colors ${
              authMethod === 'mobile'
                ? 'bg-white text-[#0D3522] shadow-xs border border-[#E7DED4]'
                : 'text-[#6B5B52] hover:text-[#241611]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setError(null);
            }}
            className={`w-1/2 py-2 flex items-center justify-center space-x-1.5 transition-colors ${
              authMethod === 'email'
                ? 'bg-white text-[#0D3522] shadow-xs border border-[#E7DED4]'
                : 'text-[#6B5B52] hover:text-[#241611]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email OTP</span>
          </button>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          {authMethod === 'mobile' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#241611] block">
                Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 bg-[#FAF7F2] border border-r-0 border-[#E7DED4] text-xs font-semibold text-[#241611]">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile"
                  className="w-full bg-white border border-[#E7DED4] px-3.5 py-3 text-sm focus:outline-none focus:border-[#0D3522]"
                  autoFocus
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#241611] block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-[#E7DED4] px-3.5 py-3 text-sm focus:outline-none focus:border-[#0D3522]"
                autoFocus
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>SENDING VERIFICATION CODE...</span>
              </>
            ) : (
              <>
                <span>SEND OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E7DED4]" />
            </div>
            <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-[#8C7A70]">
              OR
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 border border-[#E7DED4] hover:border-[#241611] text-[#241611] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 bg-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#E7DED4] text-center text-xs text-[#6B5B52]">
          New to DHARVIKA GRAINS?{' '}
          <Link
            href={redirectParam ? `/signup?redirect=${encodeURIComponent(redirectParam)}` : '/signup'}
            className="text-[#0D3522] font-bold hover:underline"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2]">
          <div className="w-8 h-8 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
