'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { ArrowLeft, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [authType, setAuthType] = useState<'mobile' | 'email'>('mobile');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [storedEmail, setStoredEmail] = useState('');
  const [storedMobile, setStoredMobile] = useState('');

  const redirectParam = searchParams.get('redirect') || searchParams.get('from') || (typeof window !== 'undefined' ? sessionStorage.getItem('auth_redirect') : null);

  useEffect(() => {
    // Read target from query or session
    const paramTarget = searchParams.get('target');
    const paramType = (searchParams.get('type') as 'mobile' | 'email') || 'mobile';

    if (paramTarget) {
      setIdentifier(paramTarget);
      setAuthType(paramType);
    }
    
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('auth_identifier');
      const storedType = sessionStorage.getItem('auth_type') as 'mobile' | 'email';
      const storedName = sessionStorage.getItem('auth_name');
      const emailVal = sessionStorage.getItem('auth_email');
      const mobileVal = sessionStorage.getItem('auth_mobile');

      if (emailVal) setStoredEmail(emailVal);
      if (mobileVal) setStoredMobile(mobileVal);

      if (!paramTarget && stored) {
        setIdentifier(stored);
        if (storedType) setAuthType(storedType);
        if (storedName) setFullName(storedName);
      } else if (!paramTarget && !stored) {
        router.push('/signin');
      }
    }
  }, [searchParams, router]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length > 1) {
      // Pasted full code
      const chars = clean.slice(0, 6).split('');
      const newOtp = [...otp];
      chars.forEach((c, i) => {
        if (i < 6) newOtp[i] = c;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(chars.length, 5);
      document.getElementById(`otp-input-${nextIdx}`)?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    // Auto-focus next input
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter complete 6-digit verification code');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setIsVerifying(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          code: enteredCode,
          fullName: fullName || undefined,
          email: authType === 'email' ? identifier : storedEmail || undefined,
          mobile: authType === 'mobile' ? identifier : storedMobile || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Verification failed. Please check the code and try again.');
        setIsVerifying(false);
        return;
      }

      setSuccessMsg(
        redirectParam?.startsWith('/checkout')
          ? 'Verification successful! Returning to your checkout...'
          : 'Verification successful! Accessing your account...'
      );

      // Save customer session info for UI state
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'dharvika_user',
          JSON.stringify({
            name: data.user.fullName,
            email: data.user.email,
            mobile: data.user.mobile,
            role: data.user.role,
          })
        );
        // Clean up temporary signup credentials from sessionStorage
        sessionStorage.removeItem('auth_identifier');
        sessionStorage.removeItem('auth_type');
        sessionStorage.removeItem('auth_name');
        sessionStorage.removeItem('auth_email');
        sessionStorage.removeItem('auth_mobile');
        sessionStorage.removeItem('auth_redirect');
      }

      setTimeout(() => {
        if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'ADMIN') {
          router.push(redirectParam?.startsWith('/admin') ? redirectParam : '/admin');
        } else if (redirectParam) {
          router.push(redirectParam);
        } else {
          router.push('/account');
        }
      }, 500);
    } catch {
      setError('Network communication failure. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();
      setIsResending(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to resend code.');
        return;
      }

      setTimer(60);
      setSuccessMsg('A new verification code has been dispatched.');
    } catch {
      setIsResending(false);
      setError('Unable to resend code right now.');
    }
  };

  // Mask display
  const displayIdentifier =
    authType === 'mobile'
      ? `+91 ${identifier.replace(/(\d{2})(\d{4})(\d{4})/, '$1 **** $3')}`
      : identifier.replace(/(.{2})(.*)(@.*)/, '$1***$3');

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
            {authType === 'mobile' ? 'Verify Mobile Number' : 'Verify Email Address'}
          </h1>
          <p className="text-xs text-[#6B5B52]">
            OTP sent to: <strong className="text-[#241611]">{displayIdentifier}</strong>
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs text-center leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#EBF7EE] border border-[#0D3522]/30 text-[#0D3522] text-xs text-center flex items-center justify-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2 sm:gap-2.5">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-input-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold border border-[#E7DED4] focus:border-[#0D3522] focus:bg-white focus:outline-none bg-[#FAF7F2] text-[#0D3522] transition-colors"
                autoFocus={i === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-60"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>VERIFYING...</span>
              </>
            ) : (
              <span>VERIFY & CONTINUE</span>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <Link
              href={redirectParam ? `/signin?redirect=${encodeURIComponent(redirectParam)}` : '/signin'}
              className="text-[#6B5B52] hover:text-[#241611] flex items-center space-x-1 underline"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Change {authType === 'mobile' ? 'mobile' : 'email'}</span>
            </Link>

            {timer > 0 ? (
              <span className="text-[#8C7A70] font-mono">Resend in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#0D3522] font-bold hover:underline disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </form>

        <div className="pt-4 border-t border-[#E7DED4] text-center text-[11px] text-[#8C7A70] flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Encrypted one-time passcode with 5-minute expiry</span>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2]">
          <div className="w-8 h-8 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
