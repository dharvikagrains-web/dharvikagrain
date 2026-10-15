import React from 'react';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation, Return & Refund Policy | Dharvika Grains',
  description: `Official return, cancellation, and refund policy for Dharvika Grains in accordance with Consumer Protection (E-Commerce) Rules 2020.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-xs sm:text-sm text-[#241611] leading-relaxed">
      <div className="border-b border-[#E7DED4] pb-6">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          Customer Care & Statutory Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#241611] mt-1">
          Cancellation, Return &amp; Refund Policy
        </h1>
        <p className="text-xs text-[#8C7A70] mt-1">
          Last Updated: October 2026 | Compliant with Consumer Protection (E-Commerce) Rules, 2020
        </p>
      </div>

      <div className="space-y-6 text-[#6B5B52]">
        <div className="p-4 rounded-xl bg-[#FBF8F5] border border-[#E7DED4] space-y-2">
          <p className="font-semibold text-[#241611]">Summary of Key Terms:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#52443C]">
            <li><strong>Perishable Consumables:</strong> For hygiene and food safety reasons under FSSAI regulations, unopened or opened grains/spices cannot be returned for buyer&apos;s remorse.</li>
            <li><strong>Transit Damage &amp; Defects:</strong> Reported within 48 hours with photo proof &rarr; Immediate replacement or 100% refund.</li>
            <li><strong>Refund Timeline:</strong> Credited to original payment method within 5–7 banking days via Razorpay.</li>
            <li><strong>Pre-Shipment Cancellation:</strong> 100% full refund if cancelled before dispatch.</li>
          </ul>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            1. Nature of Goods &amp; Non-Returnable Category
          </h2>
          <p>
            Dharvika Grains produces and delivers packaged, consumable agricultural products (millets, whole grains, cold-pressed flours, and pure spices). 
            Under the <em>Consumer Protection (E-Commerce) Rules, 2020</em> and Food Safety and Standards Authority of India (FSSAI) food hygiene regulations, 
            food items are strictly classified as non-returnable once custody is transferred, because returning food items creates severe cross-contamination, adulteration, and microbiological spoilage hazards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            2. Cancellation Policy
          </h2>
          <div className="space-y-2">
            <h3 className="font-semibold text-[#241611]">2.1 Cancellation Prior to Dispatch</h3>
            <p>
              You may cancel any order free of charge at any time prior to handing over the package to our logistics partners (typically within 4 to 12 hours of placing the order). 
              To cancel, email us at <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#B35638] underline font-semibold">{brandConfig.supportEmail}</a> or WhatsApp our care desk at {brandConfig.supportPhone} with your Order ID.
              Upon cancellation, 100% of the invoiced amount will be immediately reversed.
            </p>
            <h3 className="font-semibold text-[#241611]">2.2 Cancellation After Dispatch</h3>
            <p>
              Once an order has been manifested and dispatched with the courier service, it cannot be cancelled in transit. If you refuse delivery at the doorstep without cause, return shipping charges and logistics costs will be deducted from any store credit or refund.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            3. Eligibility for Replacement or 100% Refund
          </h2>
          <p>
            We guarantee zero-defect delivery. You are entitled to a full replacement or complete monetary refund under any of the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Physical Transit Damage:</strong> Outer cardboard carton is severely crushed, soaked, or torn, resulting in compromised internal food pouches.</li>
            <li><strong>Seal Rupture / Packaging Defect:</strong> The hermetic food-grade pouch seal is broken, pierced, or ruptured upon initial delivery.</li>
            <li><strong>Incorrect Item Received:</strong> The product received differs in variety, grind, or net quantity from what was invoiced.</li>
            <li><strong>Quality Anomaly:</strong> Any foreign material or packaging defect verified by our quality control lab.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            4. Claims Procedure &amp; 48-Hour Notice Window
          </h2>
          <p>
            To lodge an eligible claim:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Notify us within <strong>48 hours</strong> of package delivery as recorded by courier delivery confirmation.</li>
            <li>Send an email to <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#B35638] underline font-semibold">{brandConfig.supportEmail}</a> containing:
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                <li>Your Order ID and registered mobile number.</li>
                <li>Clear photographs/video showing the outer shipping label, damaged carton, and compromised food pouch.</li>
                <li>A brief description of the issue.</li>
              </ul>
            </li>
            <li>Our Customer Care Team will review and respond within 24 operational hours.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            5. Mode and Timeline of Refund
          </h2>
          <p>
            In compliance with the <em>Guidelines for Prevention and Regulation of Dark Patterns, 2023</em>, Dharvika Grains does <strong>not</strong> force unwanted store credits, coupons, or platform wallets. 
            All approved refunds are directly reversed to your original source payment instrument:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>UPI &amp; Net Banking:</strong> 2 to 4 banking business days.</li>
            <li><strong>Credit &amp; Debit Cards:</strong> 5 to 7 banking business days, depending on your issuing bank&apos;s settlement schedule.</li>
            <li><strong>No Deduction:</strong> If the claim is verified under Section 3, no restocking fee, processing penalty, or cancellation levy will be charged.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            6. Stock Unavailability
          </h2>
          <p>
            If a seasonal harvest product or spice becomes out of stock after order placement due to agricultural supply fluctuations or harvest delay, we will notify you within 24 hours. You may opt for an alternative batch or receive an immediate 100% refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#241611]">
            7. Grievance Officer &amp; Dispute Resolution
          </h2>
          <p>
            For unresolved refund escalations, contact our designated Grievance Officer under the Consumer Protection (E-Commerce) Rules, 2020:
          </p>
          <div className="p-3 bg-white rounded-lg border border-[#E7DED4] text-xs space-y-0.5">
            <p><strong>Officer:</strong> Pavan Geesala</p>
            <p><strong>Designation:</strong> Head of Operations &amp; Grievance Redressal</p>
            <p><strong>Address:</strong> Dharvika Grains, Plot 42, Silicon Valley, Madhapur, Hyderabad, Telangana 500081, India</p>
            <p><strong>Email:</strong> <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#B35638] underline">{brandConfig.supportEmail}</a></p>
            <p><strong>Phone:</strong> {brandConfig.supportPhone}</p>
          </div>
          <p className="text-xs pt-1">
            Read our accompanying <Link href="/privacy-policy" className="text-[#B35638] underline">Privacy Policy</Link>, <Link href="/terms" className="text-[#B35638] underline">Terms and Conditions</Link>, and <Link href="/cookie-policy" className="text-[#B35638] underline">Cookie Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
