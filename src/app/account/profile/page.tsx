'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, ShieldCheck, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function CustomerProfilePage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/account/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFullName(data.profile.fullName || '');
            setEmail(data.profile.email || '');
            setMobile(data.profile.mobile || '');
          }
        } else {
          // Fallback to local storage if running in client demo
          const stored = localStorage.getItem('dharvika_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            setFullName(parsed.name || 'Pavan Geesala');
            setEmail(parsed.email || 'pavangeesala81@gmail.com');
            setMobile(parsed.mobile || '9876543210');
          }
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, mobile }),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
        return;
      }

      if (data.requiresReverification) {
        setMessage({
          type: 'warning',
          text: data.message || 'Credential modified. Re-verification required.',
        });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }

      // Update local storage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('dharvika_user');
        const prev = stored ? JSON.parse(stored) : {};
        localStorage.setItem(
          'dharvika_user',
          JSON.stringify({ ...prev, name: fullName, email, mobile })
        );
      }
    } catch {
      setSaving(false);
      setMessage({ type: 'error', text: 'Network communication failure.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
        <Link href="/account" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Account Dashboard
        </Link>
      </div>

      <div className="border-b border-[#E7DED4] pb-5">
        <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block">
          Customer Profile
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#0D3522] mt-0.5">
          Personal Information
        </h1>
        <p className="text-xs text-[#6B5B52] mt-1">
          Manage your verified contact details and communication preferences
        </p>
      </div>

      {message && (
        <div
          className={`p-4 border text-xs flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-[#EBF7EE] border-[#0D3522]/30 text-[#0D3522]'
              : message.type === 'warning'
              ? 'bg-[#FDF7E7] border-[#C5A059]/40 text-[#8C6D23]'
              : 'bg-[#FAF0ED] border-[#B35638]/40 text-[#B35638]'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white border border-[#E7DED4] p-6 sm:p-8 space-y-6 shadow-xs">
        {loading ? (
          <div className="py-12 flex justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0D3522]" />
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#241611] block">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-3 focus:border-[#0D3522] focus:outline-none text-sm text-[#241611]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#241611] block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-3 focus:border-[#0D3522] focus:outline-none text-sm text-[#241611]"
                />
                <p className="text-[11px] text-[#8C7A70]">
                  Changing your email address will prompt re-verification on next login.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#241611] block">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 bg-[#FAF7F2] border border-r-0 border-[#E7DED4] text-xs font-semibold text-[#241611]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-3 focus:border-[#0D3522] focus:outline-none text-sm text-[#241611]"
                  />
                </div>
                <p className="text-[11px] text-[#8C7A70]">
                  Used for WhatsApp shipment tracking and OTP authentication.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7DED4] flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-[#8C7A70]">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Protected by AES-256 data isolation</span>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#0D3522] hover:bg-[#134B31] text-white font-semibold uppercase tracking-widest text-xs transition-colors flex items-center space-x-2 shadow-xs disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>SAVING...</span>
                  </>
                ) : (
                  <span>SAVE CHANGES</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
