import React from 'react';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import type { Metadata } from 'next';
import { Cookie, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | Data Transparency & Cookie Disclosures',
  description: `Cookie policy and tracker disclosure for ${brandConfig.brandName} under India's DPDP Act 2023.`,
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 text-xs sm:text-sm text-[#241611] leading-relaxed">
      {/* Header */}
      <div className="border-b border-[#E7DED4] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2EE] text-[11px] font-semibold text-[#1A382B] uppercase tracking-wider mb-2 font-data">
          <Cookie className="w-3.5 h-3.5" />
          <span>DPDP Act 2023 & E-Commerce Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#241611] mt-1">
          Cookie Policy & Transparency Notice
        </h1>
        <p className="text-xs text-[#8C7A70] mt-1">
          Last Updated & Formally Adopted: October 2026 · Operates under Indian Information Technology Act & DPDP Act 2023
        </p>
      </div>

      <div className="space-y-8 text-[#5A4D45]">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            1. What Are Cookies & Why Does Dharvika Grains Use Them?
          </h2>
          <p>
            Cookies are small cryptographic data files placed on your device (computer, smartphone, or tablet) when you browse websites. They are universally employed to make web applications function efficiently, preserve customer sessions across pages, and provide aggregated reporting.
          </p>
          <p>
            At <strong>{brandConfig.brandName}</strong>, we adhere strictly to the principle of <strong>Data Minimization</strong> under India&apos;s <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em>. We do <strong>not</strong> use invasive third-party cross-site behavioral tracking cookies, nor do we sell or broker your browsing data to ad syndicates.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            2. Detailed Inventory of Cookies Used on Our Platform
          </h2>
          <p>
            The table below enumerates all cookies and client-side storage technologies utilized across <code>dharvikagrains.in</code>:
          </p>

          <div className="overflow-x-auto border border-[#E2D9CE] rounded-[8px] bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E2D9CE] text-[#221814] font-semibold font-data">
                  <th className="p-3">Cookie Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Lifespan</th>
                  <th className="p-3">Specific Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9CE] font-data text-[11px] sm:text-xs">
                <tr>
                  <td className="p-3 font-mono font-semibold text-[#1A382B]">auth_token</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#EBF2EE] text-[#1A382B] font-semibold">Strictly Necessary</span>
                  </td>
                  <td className="p-3">Dharvika Grains (First-party)</td>
                  <td className="p-3">72 Hours (HTTP-only)</td>
                  <td className="p-3">Cryptographically signed HMAC-SHA256 session token ensuring your customer account and OTP login remain secure.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-[#1A382B]">dharvika_cart</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#EBF2EE] text-[#1A382B] font-semibold">Strictly Necessary</span>
                  </td>
                  <td className="p-3">Dharvika Grains (First-party)</td>
                  <td className="p-3">Persistent / Local</td>
                  <td className="p-3">Preserves your selected millet and spice pack sizes in your shopping cart during checkout.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-[#1A382B]">dharvika_cookie_consent</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#EBF2EE] text-[#1A382B] font-semibold">Strictly Necessary</span>
                  </td>
                  <td className="p-3">Dharvika Grains (First-party)</td>
                  <td className="p-3">1 Year</td>
                  <td className="p-3">Records your affirmative consent choices (Accept All or Essential Only) in compliance with the DPDP Act.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-[#9E462A]">_ga, _ga_*</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#FAF0ED] text-[#9E462A] font-semibold">Analytical (Optional)</span>
                  </td>
                  <td className="p-3">Google LLC (GA4)</td>
                  <td className="p-3">Up to 2 Years</td>
                  <td className="p-3">Measures aggregate website traffic, bounce rates, and popular recipes. <strong>Only activated if you click &ldquo;Accept All&rdquo;</strong>.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-semibold text-[#1A382B]">rzp_checkout_*</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#EBF2EE] text-[#1A382B] font-semibold">Strictly Necessary</span>
                  </td>
                  <td className="p-3">Razorpay Software Pvt Ltd</td>
                  <td className="p-3">Session</td>
                  <td className="p-3">Secures RBI-compliant PCI-DSS payment modal execution for UPI, Netbanking, and Card transactions.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            3. Legal Classifications: Essential vs. Non-Essential
          </h2>
          <div className="space-y-2">
            <h3 className="font-semibold text-[#221814]">A. Strictly Necessary (Essential) Cookies</h3>
            <p>
              These cookies are strictly required for the core operational functioning of our e-commerce platform. Under applicable Indian law, these cookies do not require prior affirmative consent because your shopping cart, payment security, and login authentication cannot function without them.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <h3 className="font-semibold text-[#221814]">B. Performance & Analytics Cookies</h3>
            <p>
              These cookies allow us to count customer visits and traffic sources so we can measure and improve the speed and usability of our platform. We operate IP anonymization and aggregated counters. <strong>These cookies are disabled by default</strong> and are only loaded if you grant consent via our Cookie Banner.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            4. How Can You Manage or Withdraw Your Cookie Consent?
          </h2>
          <p>
            You possess the statutory right to withdraw or modify your consent preferences at any time:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Through Our Platform:</strong> You can clear your browser storage or click the &ldquo;Reset Cookie Choices&rdquo; button below to re-open the Cookie Consent Banner.
            </li>
            <li>
              <strong>Through Your Browser Settings:</strong> You can configure your browser to reject all or certain cookies. Consult the official guidance for your browser:
              <span className="block mt-1 space-x-2 text-[#9E462A]">
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">Google Chrome <ExternalLink className="w-3 h-3" /></a> ·
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">Apple Safari <ExternalLink className="w-3 h-3" /></a> ·
                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">Mozilla Firefox <ExternalLink className="w-3 h-3" /></a>
              </span>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="p-5 rounded-[10px] bg-[#FAF7F2] border border-[#E2D9CE] space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#221814] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1A382B]" />
            <span>Questions or Grievances?</span>
          </h2>
          <p className="text-xs">
            For inquiries regarding our cookie disclosures or data handling, contact our designated Data Protection & Grievance Officer:
          </p>
          <div className="text-xs text-[#221814] font-data space-y-0.5 pt-1">
            <p><strong>Dharvika Grains Care & Grievance Desk</strong></p>
            <p>Email: <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#9E462A] underline">{brandConfig.supportEmail}</a></p>
            <p>Phone: {brandConfig.supportPhone}</p>
            <p>Office: {brandConfig.registeredOffice}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
