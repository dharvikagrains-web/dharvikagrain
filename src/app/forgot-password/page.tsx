'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brandConfig } from '@/data/brandConfig';
import { ArrowRight, RefreshCw, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : 'http://localhost:3000/reset-password';

      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: redirectUrl,
        }
      );

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset email. Please try again.');
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
            Reset Password
          </h1>
          <p className="text-xs text-[#6B5B52]">
            Enter your email and we will send you instructions to reset your password
          </p>
        </div>

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-[#EDF6F1] border border-[#23583C]/30 text-[#1B4D33] text-xs leading-relaxed rounded-xs flex flex-col items-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#23583C]" />
              <p className="font-semibold text-sm">Check your inbox</p>
              <p className="text-[#3A5445] text-xs">
                We sent a password reset link to <strong className="font-semibold">{email}</strong>. Please follow the instructions in the email to set a new password.
              </p>
            </div>

            <Link
              href="/signin"
              className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md block"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#241611] block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522]"
                    autoFocus
                    required
                  />
                  <Mail className="w-4 h-4 text-[#8C7A70] absolute right-3 top-3 pointer-events-none" />
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
                    <span>SENDING RESET LINK...</span>
                  </>
                ) : (
                  <>
                    <span>SEND RESET LINK</span>
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

            <div className="pt-4 border-t border-[#E7DED4] text-center text-xs text-[#6B5B52]">
              Remember your password?{' '}
              <Link
                href="/signin"
                className="text-[#0D3522] font-bold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2]">
          <div className="w-8 h-8 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
