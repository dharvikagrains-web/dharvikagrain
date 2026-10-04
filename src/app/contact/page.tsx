'use client';

import React, { useState } from 'react';
import { brandConfig } from '@/data/brandConfig';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
      {/* Curved Linen Hero Banner */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 sm:p-12 md:p-14 overflow-hidden shadow-xs text-center">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#D5CDBD] text-[11px] font-semibold text-[#0D3522] uppercase tracking-wider mb-2">
            <span>✦ Customer Care & Partnerships</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241611] leading-tight">
            Contact Our Kitchen Team
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed max-w-xl mx-auto">
            Whether you have a question about millet cooking ratios, your batch order status, or wholesale partnerships,
            we are here to assist you with warmth and transparency.
          </p>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#E2DACB]/60 blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Contact Channels */}
        <div className="lg:col-span-5 rounded-[28px] bg-[#EDE9E1] border border-[#D5CDBD] p-6 sm:p-8 space-y-6 shadow-xs self-start">
          <h2 className="text-xl font-serif font-bold text-[#241611] pb-3 border-b border-[#D5CDBD]">
            Direct Channels
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3.5 p-3 rounded-[18px] bg-white/80 border border-[#D5CDBD]/60">
              <div className="w-8 h-8 rounded-full bg-[#EDE9E1] flex items-center justify-center flex-shrink-0 text-[#0D3522]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#241611] block font-serif">Customer Care Email</strong>
                <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#0D3522] hover:underline font-medium">
                  {brandConfig.supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3 rounded-[18px] bg-white/80 border border-[#D5CDBD]/60">
              <div className="w-8 h-8 rounded-full bg-[#EDE9E1] flex items-center justify-center flex-shrink-0 text-[#0D3522]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#241611] block font-serif">Telephone & WhatsApp</strong>
                <p className="text-[#6B5B52] font-mono">{brandConfig.supportPhone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3 rounded-[18px] bg-white/80 border border-[#D5CDBD]/60">
              <div className="w-8 h-8 rounded-full bg-[#EDE9E1] flex items-center justify-center flex-shrink-0 text-[#0D3522]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#241611] block font-serif">Support Hours</strong>
                <p className="text-[#6B5B52]">{brandConfig.supportHours}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3 rounded-[18px] bg-white/80 border border-[#D5CDBD]/60">
              <div className="w-8 h-8 rounded-full bg-[#EDE9E1] flex items-center justify-center flex-shrink-0 text-[#0D3522]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#241611] block font-serif">Registered Office & Unit</strong>
                <p className="text-[#6B5B52] text-[11px] leading-relaxed">{brandConfig.registeredOffice}</p>
                <p className="text-[#8C7A70] text-[10px] mt-1">FSSAI Licence: {brandConfig.fssaiNumber}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-white/90 border border-[#D5CDBD] text-xs text-[#6B5B52] space-y-1">
            <strong className="text-[#0D3522] block font-serif">✦ Wholesale & Institutional Orders</strong>
            <p className="leading-relaxed">
              For bulk supplies to restaurants, wellness centers, or organic stores, please select
              &ldquo;Wholesale / Bulk Inquiry&rdquo; in the form.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7 rounded-[28px] bg-white border border-[#D5CDBD] p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-serif font-bold text-[#241611] pb-3 border-b border-[#D5CDBD] mb-6">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF7EE] border border-[#0D3522]/20 flex items-center justify-center text-[#0D3522]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#241611]">Message Received</h3>
              <p className="text-xs text-[#6B5B52] max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. A customer representative from our kitchen team will reply to{' '}
                <strong className="text-[#0D3522]">{form.email}</strong> within 24 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#EDE9E1] border border-[#D5CDBD] text-xs uppercase tracking-wider font-semibold text-[#0D3522] hover:bg-[#0D3522] hover:text-white transition-all shadow-2xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#241611]">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ananya Rao"
                    className="w-full bg-[#FAF7F2] rounded-full border border-[#D5CDBD] px-4 py-3 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522] shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#241611]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF7F2] rounded-full border border-[#D5CDBD] px-4 py-3 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522] shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#241611]">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF7F2] rounded-full border border-[#D5CDBD] px-4 py-3 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522] shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#241611]">Topic *</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#FAF7F2] rounded-full border border-[#D5CDBD] px-4 py-3 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522] font-medium shadow-2xs cursor-pointer"
                  >
                    <option value="General Question">General Product Question</option>
                    <option value="Order Tracking">Order & Shipping Status</option>
                    <option value="Millet Preparation">Cooking & Recipe Guidance</option>
                    <option value="Wholesale">Wholesale / Bulk Inquiry</option>
                    <option value="Feedback">Feedback on a Harvest Batch</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#241611]">Your Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help your kitchen today?"
                  className="w-full bg-[#FAF7F2] rounded-[20px] border border-[#D5CDBD] p-4 text-xs text-[#241611] focus:outline-none focus:border-[#0D3522] shadow-2xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
