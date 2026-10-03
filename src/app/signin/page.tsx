'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/supabaseClient';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignupSuccess = searchParams.get('signup') === 'success';
  const emailQuery = searchParams.get('email') || '';
  const redirectParam = searchParams.get('redirect') || searchParams.get('next') || '/account';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState(emailQuery);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError || null);

  // Sync email from query parameter if it changes or loads asynchronously
  useEffect(() => {
    if (emailQuery) {
      setEmail(emailQuery);
    }
  }, [emailQuery]);

  useEffect(() => {
    if (urlError) {
      // If hash contains an access token, ignore urlError because auth actually succeeded
      const hasHashToken =
        typeof window !== 'undefined' && window.location.hash.includes('access_token');
      if (!hasHashToken) {
        setError(urlError);
      }
    }
  }, [urlError]);

  // Handle OAuth hash token resolution and auto-redirect
  useEffect(() => {
    let isMounted = true;
    const hasHashToken =
      typeof window !== 'undefined' && window.location.hash.includes('access_token');

    async function checkOAuthSession() {
      try {
        if (hasHashToken) {
          setError(null);
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && isMounted) {
          setError(null);
          try {
            await fetch('/api/auth/sync-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user: session.user }),
            });
          } catch {}
          router.replace(redirectParam);
        }
      } catch {}
    }

    checkOAuthSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session && isMounted) {
        setError(null);
        try {
          await fetch('/api/auth/sync-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: session.user }),
          });
        } catch {}
        router.replace(redirectParam);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [redirectParam, router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const targetRedirect = redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(targetRedirect)}`,
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Only redirect when a real session exists after login
      if (data?.session) {
        router.push(redirectParam);
      } else {
        setError('Check your email and confirm your account before logging in.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
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
            Welcome Back
          </h1>
          <p className="text-xs text-[#6B5B52]">
            Sign in to access your orders, saved addresses, and wishlist
          </p>
        </div>

        {/* Success message above the form when arriving from signup */}
        {isSignupSuccess && (
          <div className="p-3.5 bg-[#EDF6F1] border border-[#23583C]/30 text-[#1B4D33] text-xs leading-relaxed rounded-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#23583C] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1B4D33]">Account Created Successfully</p>
              <p className="text-[11px] text-[#3A5445] mt-0.5">
                Your account has been created. Please check your email and verify your address before logging in.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#241611] block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
              autoFocus={!isSignupSuccess}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#241611] block">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#0D3522] hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
              autoFocus={isSignupSuccess}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>SIGNING IN...</span>
              </>
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-[#E7DED4] w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-[#8C7A70] tracking-wider uppercase shrink-0">
            or
          </span>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full py-3 px-4 border rounded-none font-medium text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-white hover:bg-[#FAF7F2] text-[#241611] border-[#D5C9BE] hover:border-[#0D3522] shadow-xs active:bg-[#F3ECE1]"
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

        {/* Error message under the form */}
        {error && (
          <div className="p-3 bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs text-center leading-relaxed">
            {error}
          </div>
        )}

        <div className="pt-4 border-t border-[#E7DED4] text-center text-xs text-[#6B5B52]">
          New to DHARVIKA GRAINS?{' '}
          <Link
            href="/signup"
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
