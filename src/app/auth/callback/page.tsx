'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/supabaseClient';
import { brandConfig } from '@/data/brandConfig';
import { RefreshCw } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Verifying your credentials...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const rawRedirect =
      searchParams.get('redirect') || searchParams.get('next') || '/account';
    const targetRedirect =
      rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
        ? rawRedirect
        : '/account';

    async function processAuth() {
      try {
        const code = searchParams.get('code');

        // 1. If PKCE code is present in query parameters, exchange it
        if (code) {
          setStatusMessage('Completing authentication...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('[CALLBACK] Code exchange error:', error);
          } else if (data?.session && isMounted) {
            await syncAndRedirect(data.session.user, targetRedirect);
            return;
          }
        }

        // 2. Check if Supabase client already parsed hash session or active session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && isMounted) {
          await syncAndRedirect(session.user, targetRedirect);
          return;
        }

        // 3. Fallback: Parse access_token directly from window hash if present
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken) {
            setStatusMessage('Establishing secure session...');
            const { data: setSessionData, error: setSessionErr } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });

            if (!setSessionErr && setSessionData?.session && isMounted) {
              await syncAndRedirect(setSessionData.session.user, targetRedirect);
              return;
            }
          }
        }

        // 4. Listen for auth state change (in case Supabase is still parsing)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session && isMounted) {
            subscription.unsubscribe();
            await syncAndRedirect(session.user, targetRedirect);
          }
        });

        // 5. Safety timeout: if no session detected after 4 seconds
        const timeout = setTimeout(() => {
          if (isMounted) {
            subscription.unsubscribe();
            router.replace(
              `/login?error=${encodeURIComponent(
                'Google authentication could not be completed. Please try again.'
              )}&redirect=${encodeURIComponent(targetRedirect)}`
            );
          }
        }, 4000);

        return () => {
          clearTimeout(timeout);
          subscription.unsubscribe();
        };
      } catch (err: unknown) {
        console.error('[CALLBACK] Authentication failed:', err);
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : 'Google authentication could not be completed.';
          setErrorMessage(msg);
          setTimeout(() => {
            router.replace(
              `/login?error=${encodeURIComponent(msg)}&redirect=${encodeURIComponent(targetRedirect)}`
            );
          }, 1500);
        }
      }
    }

    async function syncAndRedirect(user: any, destination: string) {
      setStatusMessage('Finalizing sign in...');
      try {
        await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, destination }),
        });
      } catch (e) {
        console.warn('[CALLBACK] Server sync warning:', e);
      }

      router.replace(destination);
    }

    processAuth();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-white border border-[#E7DED4] p-8 sm:p-10 shadow-lg text-center space-y-5">
        <div className="relative w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] p-1 border border-[#C5A059] shadow-xs overflow-hidden flex items-center justify-center">
          <Image
            src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
            alt="Dharvika Emblem"
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block">
            Dharvika Grains
          </span>
          <h1 className="text-xl font-serif font-bold text-[#0D3522]">
            Authenticating with Google
          </h1>
          <p className="text-xs text-[#6B5B52]">
            {errorMessage || statusMessage}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <RefreshCw className="w-6 h-6 text-[#C5A059] animate-spin" />
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2]">
          <div className="w-8 h-8 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
