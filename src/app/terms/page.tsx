import React from 'react';
import { brandConfig } from '@/data/brandConfig';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Packaged Food D2C Terms',
  description: `Terms and conditions governing orders, delivery, and services provided by ${brandConfig.brandName}.`,
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-xs sm:text-sm text-[#241611] leading-relaxed">
      <div className="border-b border-[#E7DED4] pb-6">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#241611] mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#8C7A70] mt-1">Last Updated: September 2026</p>
      </div>

      <div className="space-y-6 text-[#6B5B52]">
        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            1. Operational Scope
          </h2>
          <p>
            This website is owned and operated by {brandConfig.brandName}. By accessing or purchasing from our platform,
            you agree to be bound by these Terms of Service in compliance with Indian consumer protection and e-commerce rules.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            2. Product Information & Pricing
          </h2>
          <p>
            All products sold on this website represent agricultural food produce (millets and single-origin spices).
            Prices are listed in Indian Rupees (INR) inclusive of all applicable statutory taxes. We reserve the right to
            adjust product pricing based on agricultural harvest variations without prior notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            3. Disclaimer on Health Statements
          </h2>
          <p>
            Our products are natural, traditional whole foods. Content provided on this website—including recipes,
            journal essays, and grain matrices—is intended solely for culinary and educational purposes and does not
            constitute medical diagnosis, disease treatment, or certified healthcare advice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            4. Jurisdiction
          </h2>
          <p>
            Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </section>
      </div>
    </div>
  );
}
