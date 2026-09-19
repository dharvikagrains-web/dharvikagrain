import React from 'react';
import { brandConfig } from '@/data/brandConfig';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Return Policy | Perishable Food Safety',
  description: `Replacement and refund policies for damaged or defective items purchased from ${brandConfig.brandName}.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-xs sm:text-sm text-[#241611] leading-relaxed">
      <div className="border-b border-[#E7DED4] pb-6">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#241611] mt-1">
          Refund & Return Policy
        </h1>
        <p className="text-xs text-[#8C7A70] mt-1">Last Updated: September 2026</p>
      </div>

      <div className="space-y-6 text-[#6B5B52]">
        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            1. Perishable Food Produce Policy
          </h2>
          <p>
            Due to strict food safety, hygiene, and FSSAI sanitary standards, unsealed or consumable food products
            (grains, flours, and spices) cannot be returned once delivered, unless the package arrives damaged,
            compromised, or defective during transit.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            2. Damaged or Compromised Shipments
          </h2>
          <p>
            If your package shows signs of severe transit damage, seal breakage, or moisture ingress:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>Take 2–3 clear photographs of the outer carton and damaged inner pouch.</li>
            <li>Email our care desk at <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#B35638] underline">{brandConfig.supportEmail}</a> within 48 hours of delivery.</li>
            <li>Our team will immediately initiate a complimentary zero-cost replacement dispatch or 100% refund.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            3. Refund Processing
          </h2>
          <p>
            Approved refunds are credited directly back to the original source payment instrument (UPI / Card / Netbanking)
            within 5 to 7 operational banking days.
          </p>
        </section>
      </div>
    </div>
  );
}
