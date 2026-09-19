'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { ArrowRight, ShieldCheck, Phone, CheckCircle2, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(24);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setStep('otp');
    setTimer(24);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length !== 6) {
      setError('Please enter complete 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Mock session login
      if (typeof window !== 'undefined') {
        localStorage.setItem('dharvika_user', JSON.stringify({ name: 'Pavan Geesala', mobile }));
      }
      router.push('/account');
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dharvika_user', JSON.stringify({ name: 'Pavan Geesala', email: 'pavan@example.com' }));
      }
      router.push('/account');
    }, 600);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
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
            {step === 'phone' ? 'Welcome to DHARVIKA GRAINS' : 'Enter Verification Code'}
          </h1>
          <p className="text-xs text-[#6B5B52]">
            {step === 'phone'
              ? 'Access your orders, saved addresses, and wishlist'
              : `OTP sent to +91 ${mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}`}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs text-center">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#241611] block">
                Continue with Mobile
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
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md"
            >
              <span>SEND OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E7DED4]" />
              </div>
              <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-[#8C7A70]">
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 border border-[#E7DED4] hover:border-[#241611] text-[#241611] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
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
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-11 h-13 text-center text-lg font-bold border border-[#E7DED4] focus:border-[#0D3522] focus:outline-none bg-[#FAF7F2]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
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

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-[#6B5B52] hover:text-[#241611] underline"
              >
                Change mobile
              </button>

              {timer > 0 ? (
                <span className="text-[#8C7A70]">Resend OTP in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(24)}
                  className="text-[#0D3522] font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-[#E7DED4] text-center text-xs text-[#6B5B52]">
          New to DHARVIKA?{' '}
          <Link href="/signup" className="text-[#0D3522] font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
