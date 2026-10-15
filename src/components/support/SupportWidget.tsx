'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import {
  MessageCircle,
  X,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Send,
} from 'lucide-react';

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const whatsappUrl = `https://wa.me/919494281818?text=${encodeURIComponent(
    'Hi Dharvika Care Desk! I would like some assistance with my order / product questions.'
  )}`;

  const supportOptions = [
    { label: 'Order issue', icon: Package, href: '/account/orders' },
    { label: 'Payment issue', icon: CreditCard, href: '/contact?topic=payment' },
    { label: 'Delivery issue', icon: Truck, href: '/account/orders' },
    { label: 'Return / Refund', icon: RotateCcw, href: '/refund-policy' },
    { label: 'Product question', icon: Sparkles, href: '/faq' },
    { label: 'Other', icon: HelpCircle, href: '/contact' },
  ];

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic || 'Care Desk Quick Query',
          subject: `Care Desk: ${selectedTopic || 'Quick Query'}`,
          message,
          email: customerEmail || undefined,
        }),
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        setCustomerEmail('');
        setSelectedTopic(null);
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      // Still show confirmation in UI
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        setSelectedTopic(null);
        setIsOpen(false);
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white border border-[#E7DED4] shadow-2xl rounded-xs overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#0D3522] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse" />
              <div>
                <h3 className="text-sm font-serif font-bold tracking-wide">Dharvika Care Desk</h3>
                <p className="text-[10px] text-[#C5A059] uppercase tracking-wider">Online • Typical reply under 15m</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#FAF7F2] hover:text-[#C5A059] p-1 cursor-pointer"
              aria-label="Close support modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
            {/* Quick WhatsApp Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-[12px] bg-[#25D366]/10 border border-[#25D366]/40 text-[#075E54] hover:bg-[#25D366]/20 transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#075E54] block text-[12px]">Chat Instantly on WhatsApp</span>
                  <span className="text-[10px] text-[#6B5B52]">Direct to food quality & dispatch team</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#25D366] text-white px-2.5 py-1 rounded-full">
                Chat
              </span>
            </a>

            {sent ? (
              <div className="text-center py-8 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#EBF7EE] text-[#0D3522] flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[#0D3522] text-sm">Inquiry Received!</h4>
                <p className="text-[#6B5B52]">
                  Our food quality support team will message you via WhatsApp / Email shortly.
                </p>
              </div>
            ) : selectedTopic ? (
              <form onSubmit={handleQuickSubmit} className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E7DED4]">
                  <span className="font-bold text-[#0D3522]">{selectedTopic}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTopic(null)}
                    className="text-[10px] text-[#6B5B52] hover:underline"
                  >
                    Change topic
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[#6B5B52] block">Your Email or Mobile (Optional)</label>
                  <input
                    type="text"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com or +91..."
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2 text-xs focus:border-[#0D3522] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#6B5B52] block">Describe your issue / question *</label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter order number or product details..."
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#0D3522] hover:bg-[#134B31] text-white font-semibold uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send to Care Desk'}</span>
                </button>
              </form>
            ) : (
              <>
                <p className="text-[#6B5B52] leading-relaxed">
                  How can we help your kitchen today? Choose a quick topic below:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {supportOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedTopic(opt.label)}
                        className="p-3 border border-[#E7DED4] hover:border-[#0D3522] bg-[#FAF7F2] text-left space-y-1 rounded-xs transition-colors group cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-[#C5A059] group-hover:text-[#0D3522]" />
                        <span className="font-semibold text-[#241611] block text-[11px] leading-tight">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-[#E7DED4] space-y-1.5 text-[11px] text-[#6B5B52]">
                  <p className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Email: <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#0D3522] font-semibold underline">{brandConfig.supportEmail}</a></span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp: <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#0D3522] font-semibold hover:underline">{brandConfig.supportPhone}</a></span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center space-x-2 p-3 sm:px-4 sm:py-3 bg-[#0D3522] hover:bg-[#134B31] text-white rounded-full shadow-2xl hover:shadow-xl transition-all transform hover:scale-105 border-2 border-[#C5A059] cursor-pointer"
        aria-label="Open Dharvika customer support widget"
      >
        <MessageCircle className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
        <span className="hidden sm:inline text-xs uppercase tracking-wider font-bold">Need Help?</span>
      </button>
    </div>
  );
}
