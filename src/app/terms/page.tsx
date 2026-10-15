import React from 'react';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import type { Metadata } from 'next';
import { FileText, Scale, ShieldAlert, Award, Truck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Packaged Food D2C E-Commerce Terms',
  description: `Official terms of service governing purchases, deliveries, and consumer protection rights for ${brandConfig.brandName}.`,
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 text-xs sm:text-sm text-[#241611] leading-relaxed">
      {/* Header */}
      <div className="border-b border-[#E7DED4] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2EE] text-[11px] font-semibold text-[#1A382B] uppercase tracking-wider mb-2 font-data">
          <Scale className="w-3.5 h-3.5" />
          <span>Consumer Protection & E-Commerce Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#241611] mt-1">
          Terms of Service & Commercial Conditions
        </h1>
        <p className="text-xs text-[#8C7A70] mt-1 font-data">
          Enacted under the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> & <strong>Indian Contract Act, 1872</strong> · Last Updated: October 2026
        </p>
      </div>

      <div className="space-y-8 text-[#5A4D45]">
        {/* Section 1: Business Identity */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            1. Business Entity Details & E-Commerce Disclosures
          </h2>
          <p>
            This website <code>dharvikagrains.in</code> (&ldquo;Platform&rdquo;) is owned, operated, and managed by <strong>{brandConfig.brandName}</strong>. In accordance with Rule 4 of the <em>Consumer Protection (E-Commerce) Rules, 2020</em>, our commercial and regulatory credentials are disclosed below:
          </p>
          <div className="p-4 rounded-[8px] bg-[#FAF7F2] border border-[#E2D9CE] font-data text-xs space-y-1">
            <p><strong>Legal Entity Name:</strong> Dharvika Grains</p>
            <p><strong>Registered Facility & Office:</strong> {brandConfig.registeredOffice}</p>
            <p><strong>FSSAI Registration / Central Licence:</strong> {brandConfig.fssaiNumber}</p>
            <p><strong>Customer Care Email:</strong> <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#9E462A] underline">{brandConfig.supportEmail}</a></p>
            <p><strong>Customer Care Phone & WhatsApp:</strong> {brandConfig.supportPhone}</p>
            <p><strong>Customer Support Hours:</strong> {brandConfig.supportHours}</p>
          </div>
        </section>

        {/* Section 2: Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            2. Agreement to Terms & Eligibility
          </h2>
          <p>
            By accessing this Platform, browsing the agricultural catalogue, registering an account, or placing an order, you confirm that you are at least eighteen (18) years of age, competent to contract under the <em>Indian Contract Act, 1872</em>, and agree to be unconditionally bound by these Terms of Service, our <Link href="/privacy-policy" className="text-[#9E462A] underline font-medium">Privacy Policy</Link>, and our <Link href="/refund-policy" className="text-[#9E462A] underline font-medium">Refund Policy</Link>.
          </p>
        </section>

        {/* Section 3: Legal Metrology & Product Declarations */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            3. Legal Metrology (Packaged Commodities) & Pricing Disclosures
          </h2>
          <p>
            In strict compliance with the <em>Legal Metrology (Packaged Commodities) Rules, 2011</em>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Country of Origin:</strong> 100% grown, harvested, and packaged in <strong>India</strong>.</li>
            <li><strong>Unit Sale Price & Net Weight:</strong> Product pages explicitly state net weight (e.g., 500g, 1kg, 5kg) and Maximum Retail Price (MRP).</li>
            <li><strong>Price Transparency:</strong> All displayed prices are quoted in Indian Rupees (INR) and are inclusive of all applicable Goods and Services Tax (GST).</li>
            <li><strong>Natural Agricultural Variations:</strong> Our Chiru Dhanyalu (millets) and cold-ground spices are 100% unpolished whole grains direct from farm clusters without synthetic polishing agents. Minor natural variations in grain grain size, husk shade, or seasonal aroma are natural characteristics of chemical-free agriculture.</li>
          </ul>
        </section>

        {/* Section 4: Strict Disclaimer on Medical Claims */}
        <section className="p-5 rounded-[10px] bg-[#FAF0ED] border border-[#B35638]/40 space-y-2">
          <div className="flex items-center gap-2 text-[#B35638]">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-serif font-bold text-[#B35638]">
              4. Strict Disclaimer on Medical & Health Statements (FSSAI Compliance)
            </h2>
          </div>
          <p className="text-xs text-[#241611] leading-relaxed">
            In compliance with the <em>Food Safety and Standards (Advertising and Claims) Regulations, 2018</em>:
          </p>
          <p className="text-xs text-[#685950] leading-relaxed">
            Our products are unadulterated whole agricultural food grains and pure culinary spices. <strong>No statement, recipe note, nutritional matrix, or article published on this Platform has been evaluated as pharmaceutical medicine</strong>. None of our products are designed, intended, or sold to diagnose, treat, cure, mitigate, or prevent any chronic disease, diabetes, hypertension, cardiovascular illness, or oncological condition.
          </p>
          <p className="text-xs text-[#685950] leading-relaxed">
            Nutritional information provided represents standardized USDA/ICMR agricultural food values. Always consult a qualified registered medical practitioner or dietitian regarding specific medical conditions or dietary requirements.
          </p>
        </section>

        {/* Section 5: Order Acceptance & Cancellation */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            5. Order Placement, Invoicing & Delivery
          </h2>
          <p>
            When you complete an order on our platform:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>An automated order confirmation receipt with a unique Order Number (e.g., <code>DG-2026-XXXX</code>) is dispatched to your registered email and mobile number.</li>
            <li>We reserve the right to cancel or hold orders in events of unforeseen crop inventory stock-outs, erroneous product pricing caused by technical glitch, or logistical delivery embargoes to specific non-serviceable pincodes. In any such cancellation, <strong>100% of your paid amount will be immediately refunded</strong> to your original payment method.</li>
            <li>Pan-India delivery is coordinated through certified logistics couriers. Estimated delivery timelines range from 2 to 5 business days for southern states and 4 to 8 business days for northern and eastern destinations.</li>
          </ul>
        </section>

        {/* Section 6: Payment Gateway Security */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            6. Payment Security & RBI Compliance
          </h2>
          <p>
            Online payments (UPI, Credit Cards, Debit Cards, Netbanking) are processed exclusively through Reserve Bank of India (RBI) authorized payment aggregators (Razorpay). Transactions utilize 256-bit TLS encryption with two-factor authentication (OTP/PIN). Cash on Delivery (COD) is offered on select pin codes subject to phone verification.
          </p>
        </section>

        {/* Section 7: Authentic Reviews & Dark Patterns */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            7. Zero-Fake Reviews Policy & Prohibition of Dark Patterns
          </h2>
          <p>
            In strict compliance with the <em>Guidelines for Prevention and Regulation of Dark Patterns, 2023</em> and the <em>Bureau of Indian Standards (IS 19000:2022 Online Consumer Reviews)</em>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>We do not fabricate, purchase, incentivize, or post fictitious customer reviews.</li>
            <li>Reviews published on product detail pages originate solely from verified purchasers who completed genuine deliveries.</li>
            <li>We do not employ deceptive social proof countdown timers, fake inventory scarcity warnings, or concealed surcharge checkout carts.</li>
          </ul>
        </section>

        {/* Section 8: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by Indian law, {brandConfig.brandName}, its founders, directors, and agricultural partners shall not be liable for any indirect, incidental, or consequential damages resulting from the use of, or inability to use, our platform or delivery services. In any event, our total cumulative liability shall strictly not exceed the invoice amount actually paid by you for the specific order giving rise to the claim.
          </p>
        </section>

        {/* Section 9: Governing Law & Jurisdiction */}
        <section className="p-4 rounded-[8px] bg-white border border-[#E2D9CE] space-y-2">
          <h2 className="text-base font-serif font-semibold text-[#221814] flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#1A382B]" />
            <span>9. Governing Law & Dispute Resolution</span>
          </h2>
          <p className="text-xs text-[#5A4D45]">
            These Terms of Service, all commercial transactions, and any legal disputes arising out of your relationship with {brandConfig.brandName} shall be governed exclusively by the laws of the Republic of India. The competent civil courts situated in <strong>Hyderabad, Telangana, India</strong> shall have exclusive territorial jurisdiction over any legal proceedings.
          </p>
        </section>
      </div>
    </div>
  );
}
