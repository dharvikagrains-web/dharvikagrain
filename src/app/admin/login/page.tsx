'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { supabase } from '@/supabaseClient';
import { ShieldAlert, ArrowRight, ShieldCheck, RefreshCw, Key, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function checkCurrentAdminSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const role = data.user?.role;
          if (data.authenticated && ['ADMIN', 'SUPER_ADMIN', 'OWNER', 'OPERATIONS'].includes(role)) {
            if (mounted) router.replace('/admin');
          }
        }
      } catch {}
    }
    checkCurrentAdminSession();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?redirect=/admin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Please provide a valid administrator email');
      return;
    }
    if (!password) {
      setError('Please provide administrative master passcode');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate via server-side admin login API
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid administrator credentials. Access restricted.');
        setLoading(false);
        return;
      }

      // 2. Best-effort Supabase client session sync
      try {
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
      } catch {
        // Fallback: server session cookie is authoritative
      }

      // 3. Redirect to Admin Command Center
      router.push('/admin');
    } catch {
      setError('Network communication error.');
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('dharvikagrains@gmail.com');
    setPassword('DharvikaAdmin2026!');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#161B18] text-white">
      <div className="w-full max-w-md bg-[#0F1411] border border-[#C5A059]/40 p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto rounded-full bg-[#161B18] p-0.5 border border-[#C5A059] shadow-md overflow-hidden">
            <Image
              src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
              alt="Dharvika Emblem"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block">
            Dharvika Grains Internal
          </span>
          <h1 className="text-2xl font-serif font-bold text-white">
            Admin Operations Login
          </h1>
          <p className="text-xs text-[#8E9B93]">
            Access order fulfillment, batch inventory, customer analytics, and courier manifests
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#3A140F] border border-[#B35638] text-[#F3C5B6] text-xs text-center leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D0DFD6] block">
              Admin Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dharvikagrains.in"
              className="w-full bg-[#161B18] border border-[#27352B] px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#D0DFD6] block">
                Master Passcode
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#C5A059] hover:underline"
              >
                Forgot Passcode?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#161B18] border border-[#27352B] px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0D3522] hover:bg-[#15462E] border border-[#C5A059]/50 text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>VALIDATING CLEARANCE...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>SIGN IN TO COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-[#27352B] w-full" />
          <span className="bg-[#0F1411] px-3 text-[10px] font-semibold text-[#78887F] tracking-wider uppercase shrink-0">
            or
          </span>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full py-3 px-4 border rounded-none font-medium text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-[#161B18] hover:bg-[#1E2622] text-[#E0E7E3] border-[#27352B] hover:border-[#C5A059]/60 shadow-md active:bg-[#121614]"
        >
          {googleLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-[#C5A059]" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span className="font-semibold tracking-wide">
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </span>
        </button>

        {/* Demo Fast Fill Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="w-full py-2 bg-[#1C2520] hover:bg-[#233029] border border-[#2F4036] text-[#C5A059] text-[11px] font-semibold tracking-wider uppercase transition-colors flex items-center justify-center space-x-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Use Demo Admin Key (Fast-Fill)</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#202923] flex items-center justify-between text-[11px] text-[#78887F]">
          <Link href="/signin" className="hover:text-white transition-colors">
            ← Customer Sign In
          </Link>
          <Link href="/investor/login" className="hover:text-white transition-colors">
            Investor Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
