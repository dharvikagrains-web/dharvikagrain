import React from 'react';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import type { Metadata } from 'next';
import { ShieldCheck, Lock, FileText, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | DPDP Act 2023 & Packaged Food Data Governance',
  description: `Official Privacy Notice and data protection disclosures for ${brandConfig.brandName} under the Digital Personal Data Protection Act, 2023.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 text-xs sm:text-sm text-[#241611] leading-relaxed">
      {/* Header */}
      <div className="border-b border-[#E7DED4] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2EE] text-[11px] font-semibold text-[#1A382B] uppercase tracking-wider mb-2 font-data">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Statutory Compliance Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#241611] mt-1">
          Privacy Policy & Data Protection Charter
        </h1>
        <p className="text-xs text-[#8C7A70] mt-1 font-data">
          Formally Compliant with India&apos;s <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> & <strong>IT Rules, 2011</strong> · Last Updated: October 2026
        </p>
      </div>

      <div className="space-y-8 text-[#5A4D45]">
        {/* Preamble */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            1. Preamble & Identity of the Data Fiduciary
          </h2>
          <p>
            This Privacy Notice governs the collection, storage, processing, and protection of digital personal data by <strong>{brandConfig.brandName}</strong> (&ldquo;We&rdquo;, &ldquo;Our&rdquo;, or &ldquo;Us&rdquo;), acting as a <strong>Data Fiduciary</strong> under Section 2(i) of the <em>Digital Personal Data Protection Act, 2023 (DPDP Act, Act No. 22 of 2023)</em>.
          </p>
          <div className="p-4 rounded-[8px] bg-[#FAF7F2] border border-[#E2D9CE] font-data text-xs space-y-1">
            <p><strong>Registered Facility & Office:</strong> {brandConfig.registeredOffice}</p>
            <p><strong>FSSAI Central / State Licence:</strong> {brandConfig.fssaiNumber}</p>
            <p><strong>Authorized Care Desk:</strong> {brandConfig.supportEmail} | {brandConfig.supportPhone}</p>
          </div>
        </section>

        {/* Data Minimization */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            2. The Principle of Data Minimization (What We Collect & Why)
          </h2>
          <p>
            In strict compliance with Section 6(1) of the DPDP Act, we only collect digital personal data that is <strong>strictly necessary</strong> for fulfilling your food orders, delivering shipments, generating statutory GST invoices, and providing customer support:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-[8px] border border-[#E2D9CE] bg-white space-y-2">
              <h3 className="font-semibold text-[#221814] text-xs uppercase tracking-wide font-data flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1A382B]" />
                Personal Data We Collect
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li><strong>Full Name:</strong> For package addressing and legal invoicing.</li>
                <li><strong>Delivery Address & Pincode:</strong> For logistics routing and physical delivery.</li>
                <li><strong>Mobile Phone Number:</strong> For dispatch SMS updates, delivery agent doorstep calls, and secure OTP login.</li>
                <li><strong>Email Address:</strong> For digital GST tax invoices and customer service communications.</li>
              </ul>
            </div>

            <div className="p-4 rounded-[8px] border border-[#E2D9CE] bg-[#FAF7F2] space-y-2">
              <h3 className="font-semibold text-[#9E462A] text-xs uppercase tracking-wide font-data flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#9E462A]" />
                Sensitive Data We NEVER Store
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li><strong>Payment Credentials:</strong> We never capture, view, or store credit card numbers, CVVs, debit card PINs, or UPI PINs. All payments are securely tokenized through RBI-authorized payment aggregators (Razorpay).</li>
                <li><strong>Biometric Data:</strong> Zero biometric identifiers are processed.</li>
                <li><strong>Religious or Health Profiling:</strong> We do not profile or sell personal health records.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Lawful Grounds for Processing */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            3. Lawful Grounds & Purpose of Processing
          </h2>
          <p>
            We process your personal data solely under the following lawful bases recognized by the DPDP Act 2023:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Consent (Section 6):</strong> When you register an account, submit an inquiry via our contact form, or opt-in to our harvest newsletter.</li>
            <li><strong>Certain Legitimate Uses / Contractual Fulfillment (Section 7):</strong> Fulfilling an order placed by you, coordinating pan-India courier delivery, and executing payment transactions requested by you.</li>
            <li><strong>Legal & Regulatory Obligations:</strong> Compliance with the Food Safety and Standards Act (FSSAI mandatory batch traceability for food safety audits) and the Central Goods and Services Tax Act, 2017 (mandatory 6-year retention of sales invoices).</li>
          </ul>
        </section>

        {/* Third-Party Data Processors */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            4. Third-Party Data Processors & Confidentiality Safeguards
          </h2>
          <p>
            We do <strong>not</strong> sell, rent, trade, or monetize your personal data. We share necessary data only with certified, contract-bound technical processors:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Payment Aggregators (Razorpay):</strong> PCI-DSS Level 1 certified Indian payment gateway for processing UPI, Netbanking, and Card orders.</li>
            <li><strong>Logistics & Courier Partners (Delhivery / Blue Dart / Shiprocket):</strong> Last-mile dispatch containing recipient name, shipping address, and phone number for delivery coordination.</li>
            <li><strong>SMS & Email Communication Gateways (MSG91 & Resend):</strong> Telecommunications gateways operating under Telecom Regulatory Authority of India (TRAI) DLT commercial communication regulations.</li>
            <li><strong>Hosting & Database Infrastructure (Supabase & Next.js):</strong> SOC-2 compliant encrypted cloud database infrastructure with Row Level Security (RLS) and TLS 1.3 encryption in transit.</li>
          </ul>
        </section>

        {/* Rights of the Data Principal */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            5. Your Statutory Rights as a Data Principal (DPDP Act, 2023)
          </h2>
          <p>
            Under Sections 11 through 14 of the Digital Personal Data Protection Act, 2023, you enjoy statutory rights regarding your digital personal data:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-[8px] bg-white border border-[#E2D9CE]">
              <strong className="text-[#221814] block mb-0.5">A. Right to Access Information (Section 11)</strong>
              <p className="text-xs">You have the right to request a summary of the personal data processed by us and the identities of all third-party processors with whom it was shared.</p>
            </div>

            <div className="p-3.5 rounded-[8px] bg-white border border-[#E2D9CE]">
              <strong className="text-[#221814] block mb-0.5">B. Right to Correction and Erasure (Section 12)</strong>
              <p className="text-xs">You have the right to correct inaccurate data, complete incomplete details, or request total erasure of personal data that is no longer required for statutory tax or food safety records.</p>
            </div>

            <div className="p-3.5 rounded-[8px] bg-white border border-[#E2D9CE]">
              <strong className="text-[#221814] block mb-0.5">C. Right of Grievance Redressal (Section 13)</strong>
              <p className="text-xs">You have the right to readily accessible grievance redressal provided by our designated Grievance Officer, with response within 7 business days and resolution within 30 days.</p>
            </div>

            <div className="p-3.5 rounded-[8px] bg-white border border-[#E2D9CE]">
              <strong className="text-[#221814] block mb-0.5">D. Right to Nominate (Section 14)</strong>
              <p className="text-xs">You have the right to nominate another individual who, in the event of your death or incapacity, shall exercise your data protection rights.</p>
            </div>

            <div className="p-3.5 rounded-[8px] bg-white border border-[#E2D9CE]">
              <strong className="text-[#221814] block mb-0.5">E. Right to Withdraw Consent</strong>
              <p className="text-xs">Where processing is based on consent, you may withdraw your consent at any time without retroactive impact on prior lawful processing.</p>
            </div>
          </div>
        </section>

        {/* Protection of Children's Data */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            6. Protection of Children&apos;s Personal Data (Section 9)
          </h2>
          <p>
            Our e-commerce store is intended solely for adult consumers (aged 18 and older). In compliance with Section 9 of the DPDP Act, we do not knowingly process personal data of children, undertake behavioral tracking or targeted advertising directed at minors, or process data likely to cause harm to a child.
          </p>
        </section>

        {/* Data Security & Retention */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-semibold text-[#221814]">
            7. Reasonable Security Safeguards & Data Retention
          </h2>
          <p>
            We implement comprehensive technical and organizational measures under Section 8(5) of the DPDP Act, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>HTTPS with HSTS (Strict-Transport-Security: max-age=63072000) enforcing encrypted data transmission across all public and checkout sessions.</li>
            <li>HMAC-SHA256 authenticated session cookies with <code>HttpOnly</code> and <code>SameSite=Lax</code> security flags.</li>
            <li>Database isolation with PostgreSQL Row-Level Security (RLS) preventing unauthorized cross-customer data leakage.</li>
          </ul>
        </section>

        {/* Grievance Officer */}
        <section className="p-6 rounded-[12px] bg-[#FAF7F2] border-2 border-[#1A382B]/20 space-y-4">
          <div className="flex items-center gap-2 text-[#1A382B]">
            <UserCheck className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-base font-serif font-bold text-[#1A382B]">
              8. Designated Grievance Officer & Data Protection Desk
            </h2>
          </div>
          <p className="text-xs">
            In compliance with Section 13(1) of the Digital Personal Data Protection Act, 2023, and Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the designated Grievance Officer for Dharvika Grains is:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-[8px] border border-[#E2D9CE] font-data text-xs">
            <div>
              <p className="text-[#8C7A70] text-[11px]">Officer Name</p>
              <p className="font-semibold text-[#221814]">Pavan Geesala</p>
            </div>
            <div>
              <p className="text-[#8C7A70] text-[11px]">Designation</p>
              <p className="font-semibold text-[#221814]">Data Protection & Grievance Officer</p>
            </div>
            <div>
              <p className="text-[#8C7A70] text-[11px]">Official Email</p>
              <a href={`mailto:${brandConfig.supportEmail}`} className="font-semibold text-[#9E462A] underline">
                {brandConfig.supportEmail}
              </a>
            </div>
            <div>
              <p className="text-[#8C7A70] text-[11px]">Telephone Hotline</p>
              <p className="font-semibold text-[#221814]">{brandConfig.supportPhone}</p>
            </div>
            <div className="sm:col-span-2 pt-1 border-t border-[#F0EAE1]">
              <p className="text-[#8C7A70] text-[11px]">Postal Address for Legal Notice</p>
              <p className="font-semibold text-[#221814]">{brandConfig.registeredOffice}</p>
            </div>
          </div>
          <p className="text-[11px] text-[#8C7A70] italic">
            *Statutory SLA: All inquiries and grievance submissions are acknowledged within 48 business hours and formally resolved within thirty (30) calendar days.
          </p>
        </section>
      </div>
    </div>
  );
}
