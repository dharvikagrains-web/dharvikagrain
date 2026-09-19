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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          Customer Support & Partnerships
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#241611]">
          Contact Our Kitchen Team
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
          Whether you have a question about millet cooking ratios, your batch order status, or wholesale partnerships,
          we are here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Channels */}
        <div className="lg:col-span-5 bg-white border border-[#E7DED4] p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-serif font-semibold text-[#241611] pb-3 border-b border-[#E7DED4]">
            Direct Channels
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-[#B35638] mt-0.5" />
              <div>
                <strong className="text-[#241611] block">Customer Care Email</strong>
                <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#6B5B52] hover:underline">
                  {brandConfig.supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-[#B35638] mt-0.5" />
              <div>
                <strong className="text-[#241611] block">Telephone & WhatsApp</strong>
                <p className="text-[#6B5B52]">{brandConfig.supportPhone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-[#B35638] mt-0.5" />
              <div>
                <strong className="text-[#241611] block">Support Hours</strong>
                <p className="text-[#6B5B52]">{brandConfig.supportHours}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-[#B35638] mt-0.5" />
              <div>
                <strong className="text-[#241611] block">Registered Office & Packing Unit</strong>
                <p className="text-[#6B5B52] font-mono text-[11px]">{brandConfig.registeredOffice}</p>
                <p className="text-[#8C7A70] text-[10px] mt-0.5">FSSAI Licence: {brandConfig.fssaiNumber}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4] text-xs text-[#6B5B52] space-y-1">
            <strong className="text-[#241611] block">Wholesale & Institutional Orders</strong>
            <p>
              For bulk supplies to restaurants, wellness centers, or organic stores, please select
              &ldquo;Wholesale / Bulk Inquiry&rdquo; in the form.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7 bg-white border border-[#E7DED4] p-6 sm:p-8">
          <h2 className="text-lg font-serif font-semibold text-[#241611] pb-3 border-b border-[#E7DED4] mb-6">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#274135] mx-auto" />
              <h3 className="text-lg font-serif text-[#241611]">Message Received</h3>
              <p className="text-xs text-[#6B5B52] max-w-sm mx-auto">
                Thank you for reaching out. A customer representative from our kitchen team will reply to{' '}
                <strong className="text-[#241611]">{form.email}</strong> within 24 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs uppercase tracking-wider font-semibold text-[#B35638] hover:underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ananya Rao"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">Topic *</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  >
                    <option value="General Question">General Product Question</option>
                    <option value="Order Tracking">Order & Shipping Status</option>
                    <option value="Millet Preparation">Cooking & Recipe Guidance</option>
                    <option value="Wholesale">Wholesale / Bulk Inquiry</option>
                    <option value="Feedback">Feedback on a Harvest Batch</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#241611]">Your Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help your kitchen today?"
                  className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#B35638] hover:bg-[#9E462A] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2"
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
