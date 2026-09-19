'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (mobile.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError(null);
    setStep('otp');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dharvika_user', JSON.stringify({ name: fullName, mobile, email }));
      }
      router.push('/account');
    }, 700);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
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
            {step === 'form' ? 'Create Your Account' : 'Verify Mobile Number'}
          </h1>
          <p className="text-xs text-[#6B5B52]">
            {step === 'form'
              ? 'Join our community for fresh harvests and farm-to-table traceability'
              : `Enter 6-digit OTP sent to +91 ${mobile}`}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs text-center">
            {error}
          </div>
        )}

        {step === 'form' ? (
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
                className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md"
              >
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`reg-otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[i] = e.target.value;
                    setOtp(newOtp);
                    if (e.target.value && i < 5) {
                      document.getElementById(`reg-otp-${i + 1}`)?.focus();
                    }
                  }}
                  className="w-11 h-13 text-center text-lg font-bold border border-[#E7DED4] focus:border-[#0D3522] focus:outline-none bg-[#FAF7F2]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>CREATING ACCOUNT...</span>
                </>
              ) : (
                <span>VERIFY & COMPLETE REGISTRATION</span>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#E7DED4] text-center text-xs text-[#6B5B52]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0D3522] font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
