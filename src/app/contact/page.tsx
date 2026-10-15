'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageCircle, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      setErrorMessage('Please check the consent box to proceed in compliance with data privacy regulations.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consent: true }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      setErrorMessage('Network error communicating with customer care desk. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/919494281818?text=${encodeURIComponent(
    'Hi Dharvika Grains! I would like to inquire about your farm-direct millets and spices.'
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
      {/* Curved Linen Hero Banner */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 sm:p-12 md:p-14 overflow-hidden shadow-xs text-center">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#D5CDBD] text-[11px] font-semibold text-[#0D3522] uppercase tracking-wider mb-2">
            <span>✦ Customer Care &amp; Statutory Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241611] leading-tight">
            Contact Our Kitchen Team
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed max-w-xl mx-auto">
            Whether you have a question about millet cooking ratios, your batch order status, or grievance escalation,
            we are here to assist you with warmth and transparency.
          </p>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#E2DACB]/60 blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Statutory Business Details & Channels */}
        <div className="lg:col-span-5 rounded-[28px] bg-[#EDE9E1] border border-[#D5CDBD] p-6 sm:p-8 space-y-6 shadow-xs self-start">
          <h2 className="text-xl font-serif font-bold text-[#241611] pb-3 border-b border-[#D5CDBD]">
            Business Information
          </h2>

          {/* Quick WhatsApp Banner CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-[20px] bg-[#25D366]/10 border border-[#25D366]/40 text-[#075E54] hover:bg-[#25D366]/20 transition-all group focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            aria-label="Chat with customer support on WhatsApp"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-semibold text-[#075E54]">Chat on WhatsApp</strong>
                <span className="text-[11px] text-[#241611]/70">Fast response · Mon–Sat</span>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-[#25D366] text-white px-3 py-1.5 rounded-full">
              Open Chat
            </span>
          </a>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3.5 p-3 rounded-[18px] bg-white/80 border border-[#D5CDBD]/60">
              <div className="w-8 h-8 rounded-full bg-[#EDE9E1] flex items-center justify-center flex-shrink-0 text-[#0D3522]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#241611] block font-serif">Customer Care &amp; Grievance Email</strong>
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
                <strong className="text-[#241611] block font-serif">Telephone &amp; WhatsApp</strong>
                <div className="flex items-center gap-3 mt-0.5">
                  <a
                    href="tel:+919494281818"
                    className="text-[#0D3522] font-mono hover:underline font-semibold"
                  >
                    {brandConfig.supportPhone}
                  </a>
                  <span className="text-[#D5CDBD]">·</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-semibold hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3 rounded-[18px] bg-white/80 border border-[#D5CDBD]/60">
              <div className="w-8 h-8 rounded-full bg-[#EDE9E1] flex items-center justify-center flex-shrink-0 text-[#0D3522]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#241611] block font-serif">Operational Hours</strong>
                <p className="text-[#6B5B52]">{brandConfig.supportHours}</p>
                <p className="text-[10px] text-[#8C7A70] mt-0.5">Statutory Grievance Acknowledgment: &le; 48 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3 rounded-[18px] bg-white/80 border border-[#D5CDBD]/60">
              <div className="w-8 h-8 rounded-full bg-[#EDE9E1] flex items-center justify-center flex-shrink-0 text-[#0D3522]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#241611] block font-serif">Registered Office &amp; Packaging Facility</strong>
                <p className="text-[#6B5B52] text-[11px] leading-relaxed">{brandConfig.registeredOffice}</p>
                <div className="mt-1 pt-1 border-t border-[#D5CDBD]/40 space-y-0.5 text-[10px] text-[#8C7A70]">
                  <p><strong>FSSAI License:</strong> {brandConfig.fssaiNumber}</p>
                  <p><strong>Grievance Officer:</strong> Pavan Geesala (Head of Operations)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-white/90 border border-[#D5CDBD] text-xs text-[#6B5B52] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#0D3522] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-serif">Data Minimization Charter</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Under India&apos;s <em>Digital Personal Data Protection Act, 2023</em>, we only collect information necessary to answer your inquiry or fulfill your order. We never sell or share contact details with unsolicited third-party advertisers.
            </p>
          </div>
        </div>

        {/* Right Column: Accessible Form with Consent Checkbox */}
        <div className="lg:col-span-7 rounded-[28px] bg-white border border-[#D5CDBD] p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-serif font-bold text-[#241611] pb-3 border-b border-[#D5CDBD] mb-6">
            Send Us an Inquiry
          </h2>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 p-3.5 rounded-[12px] bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-12 space-y-3" role="status">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF7EE] border border-[#0D3522]/20 flex items-center justify-center text-[#0D3522]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#241611]">Inquiry Acknowledged</h3>
              <p className="text-xs text-[#6B5B52] max-w-sm mx-auto leading-relaxed">
                Thank you for contacting Dharvika Grains. A representative from our care desk will respond to{' '}
                <strong className="text-[#0D3522]">{form.email || 'your email'}</strong> within 24–48 business hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setConsentChecked(false);
                  setForm({ name: '', email: '', phone: '', subject: 'General Question', message: '' });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#EDE9E1] border border-[#D5CDBD] text-xs uppercase tracking-wider font-semibold text-[#0D3522] hover:bg-[#0D3522] hover:text-white transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0D3522]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="font-semibold text-[#241611]">
                    Your Full Name <span className="text-[#9E462A]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    aria-required="true"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ananya Rao"
                    className="w-full bg-[#FAF7F2] rounded-full border border-[#D5CDBD] px-4 py-3 text-xs text-[#241611] focus:outline-none focus:ring-2 focus:ring-[#0D3522] focus:border-transparent shadow-2xs transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="font-semibold text-[#241611]">
                    Email Address <span className="text-[#9E462A]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    aria-required="true"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF7F2] rounded-full border border-[#D5CDBD] px-4 py-3 text-xs text-[#241611] focus:outline-none focus:ring-2 focus:ring-[#0D3522] focus:border-transparent shadow-2xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="font-semibold text-[#241611]">
                    Phone Number <span className="text-[#8C7A70] font-normal">(Optional, for WhatsApp reply)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 94942 81818"
                    className="w-full bg-[#FAF7F2] rounded-full border border-[#D5CDBD] px-4 py-3 text-xs text-[#241611] focus:outline-none focus:ring-2 focus:ring-[#0D3522] focus:border-transparent shadow-2xs transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="font-semibold text-[#241611]">
                    Topic / Category <span className="text-[#9E462A]" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#FAF7F2] rounded-full border border-[#D5CDBD] px-4 py-3 text-xs text-[#241611] focus:outline-none focus:ring-2 focus:ring-[#0D3522] focus:border-transparent font-medium shadow-2xs cursor-pointer transition-all"
                  >
                    <option value="General Question">General Product Question</option>
                    <option value="Order Tracking">Order &amp; Shipping Status</option>
                    <option value="Millet Preparation">Cooking &amp; Recipe Guidance</option>
                    <option value="Wholesale">Wholesale / Bulk Supply</option>
                    <option value="Grievance">Grievance Escalation / Refund Request</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="font-semibold text-[#241611]">
                  Your Message <span className="text-[#9E462A]" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  aria-required="true"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Please describe your question or order details..."
                  className="w-full bg-[#FAF7F2] rounded-[20px] border border-[#D5CDBD] p-4 text-xs text-[#241611] focus:outline-none focus:ring-2 focus:ring-[#0D3522] focus:border-transparent shadow-2xs transition-all resize-y"
                />
              </div>

              {/* DPDP Act 2023 Explicit Consent Checkbox */}
              <div className="pt-2">
                <label
                  htmlFor="contact-consent"
                  className="flex items-start gap-2.5 p-3 rounded-[12px] bg-[#FAF7F2] border border-[#D5CDBD] cursor-pointer hover:bg-[#F3EFE8] transition-colors"
                >
                  <input
                    id="contact-consent"
                    type="checkbox"
                    required
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#0D3522] border-[#D5CDBD] focus:ring-2 focus:ring-[#0D3522] cursor-pointer"
                  />
                  <span className="text-[11px] text-[#52443C] leading-relaxed">
                    I consent to Dharvika Grains processing my submitted details solely for addressing this inquiry, in accordance with the{' '}
                    <Link href="/privacy-policy" className="text-[#9E462A] underline font-semibold hover:text-[#0D3522]">
                      Privacy Policy
                    </Link>{' '}
                    and India&apos;s Digital Personal Data Protection Act, 2023.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !consentChecked}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D3522] focus:ring-offset-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
