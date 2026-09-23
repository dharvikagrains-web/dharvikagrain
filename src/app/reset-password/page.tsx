'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { ArrowRight, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import { supabase } from '@/supabaseClient';

function ResetPasswordContent() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push('/signin');
      }, 2500);
    } catch (err: any) {
      setError(err?.message || 'Failed to update password. Please try again.');
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
            Set New Password
          </h1>
          <p className="text-xs text-[#6B5B52]">
            Create a secure password for your Dharvika account
          </p>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-[#EDF6F1] border border-[#23583C]/30 text-[#1B4D33] text-xs leading-relaxed rounded-xs flex flex-col items-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#23583C]" />
              <p className="font-semibold text-sm">Password Updated Successfully!</p>
              <p className="text-[#3A5445] text-xs">
                Redirecting you to sign in with your new credentials...
              </p>
            </div>
            <Link
              href="/signin"
              className="text-xs font-semibold text-[#0D3522] hover:underline block"
            >
              Click here if you are not redirected automatically
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#241611] block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
                    autoFocus
                    required
                  />
                  <Lock className="w-4 h-4 text-[#8C7A70] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#241611] block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
                    required
                  />
                  <Lock className="w-4 h-4 text-[#8C7A70] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>UPDATING PASSWORD...</span>
                  </>
                ) : (
                  <>
                    <span>UPDATE PASSWORD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Error message under the form */}
            {error && (
              <div className="p-3 bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs text-center leading-relaxed">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2]">
          <div className="w-8 h-8 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
