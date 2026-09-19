import React from 'react';
import { brandConfig } from '@/data/brandConfig';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Pan-India Logistics',
  description: `Shipping guidelines, dispatch timelines, and free shipping thresholds for ${brandConfig.brandName}.`,
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-xs sm:text-sm text-[#241611] leading-relaxed">
      <div className="border-b border-[#E7DED4] pb-6">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#241611] mt-1">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-[#8C7A70] mt-1">Last Updated: September 2026</p>
      </div>

      <div className="space-y-6 text-[#6B5B52]">
        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            1. Dispatch Timelines
          </h2>
          <p>
            All orders placed on our website are freshly packed and dispatched from our certified facility
            within 24 to 48 business hours of order confirmation. Orders placed on Sundays or public holidays
            are dispatched on the next operational business day.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            2. Delivery Schedule Across India
          </h2>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li><strong>South India (Metros & Major Towns):</strong> 2–3 business days</li>
            <li><strong>Rest of India (Tier 1 & Tier 2 Cities):</strong> 3–5 business days</li>
            <li><strong>Remote / Northeast / Island Locations:</strong> 5–7 business days</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            3. Shipping Charges & Free Delivery
          </h2>
          <p>
            We offer <strong className="text-[#274135]">Complimentary Free Shipping</strong> across India
            on all orders exceeding ₹{brandConfig.freeShippingThreshold}. For orders below ₹{brandConfig.freeShippingThreshold},
            a flat delivery fee of ₹{brandConfig.flatShippingRate} is charged to cover secure protective packaging and logistics costs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            4. Real-Time Tracking
          </h2>
          <p>
            Once your order is picked up by our courier partner, you will receive an automated SMS and email
            containing the live airway bill (AWB) tracking link.
          </p>
        </section>
      </div>
    </div>
  );
}
