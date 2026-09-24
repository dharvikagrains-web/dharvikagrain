'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          if (mounted) {
            setHasSession(false);
            router.push('/login?redirect=/account');
          }
        } else {
          if (mounted) {
            setHasSession(true);
          }
        }
      } catch {
        if (mounted) {
          setHasSession(false);
          router.push('/login?redirect=/account');
        }
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && mounted) {
        setHasSession(false);
        router.push('/login?redirect=/account');
      } else if (session && mounted) {
        setHasSession(true);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  if (hasSession === null) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-8 h-8 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasSession) {
    return null;
  }

  return <>{children}</>;
}
