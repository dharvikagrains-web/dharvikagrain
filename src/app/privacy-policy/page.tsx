import React from 'react';
import { brandConfig } from '@/data/brandConfig';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Packaged Food D2C Disclosures',
  description: `Privacy policy and data governance practices of ${brandConfig.brandName}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-xs sm:text-sm text-[#241611] leading-relaxed">
      <div className="border-b border-[#E7DED4] pb-6">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#241611] mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#8C7A70] mt-1">Last Updated: September 2026</p>
      </div>

      <div className="space-y-6 text-[#6B5B52]">
        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            1. Information We Collect
          </h2>
          <p>
            When you purchase from {brandConfig.brandName}, we collect essential contact and delivery details
            including your full name, shipping address, 10-digit mobile number, and email address. This information
            is strictly used to fulfill shipments, send consignment dispatch notices, and provide customer support.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            2. Payment Security
          </h2>
          <p>
            We do not store your credit card, debit card, or UPI PIN numbers on our servers. All transactions
            are processed through certified PCI-DSS compliant Indian payment gateways (such as Razorpay / Cashfree).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            3. Non-Disclosure of Customer Data
          </h2>
          <p>
            We do not sell, rent, or trade your personal information with third-party advertising brokers.
            Data is shared solely with verified logistics partners (e.g. Blue Dart, Delhivery) for last-mile delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            4. Grievance Officer & Contact
          </h2>
          <p>
            For privacy inquiries or deletion requests, contact our designated Grievance Officer at{' '}
            <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#B35638] underline">
              {brandConfig.supportEmail}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
