import React from 'react';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import { ShieldCheck, FileText, CheckCircle2, Clock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quality & Purity Protocols | Verification Without Compromise',
  description:
    'Our comprehensive quality assurance process: multi-stage cleaning, optical sorting, low-temperature cold milling, moisture calibration, and batch lab verification.',
};

export default function QualityPage() {
  const qualityPillars = [
    {
      title: 'Aspiration & Winnowing',
      step: 'Step 1',
      desc: 'High-volume airflow separators eliminate all dry husks, light chaff, and dust particles from newly harvested grain batches.',
    },
    {
      title: 'Vibrating Sieve Grading',
      step: 'Step 2',
      desc: 'Multi-deck calibrated vibrating sieves sort grains by exact dimension and density, discarding broken or shriveled kernels.',
    },
    {
      title: 'Magnetic & Optical Destoning',
      step: 'Step 3',
      desc: 'Rare-earth magnetic drums remove trace ferrous matter, followed by optical color-sorters that identify and eject minute stones.',
    },
    {
      title: 'Moisture Calibration',
      step: 'Step 4',
      desc: 'Moisture is strictly checked to remain below 12% for millets and 8% for whole spices, preventing fungal growth and insect spoilage naturally without toxic fumigants.',
    },
    {
      title: 'Cold-Grinding & De-Husking',
      step: 'Step 5',
      desc: 'Spices are cold-milled below 40°C to safeguard heat-sensitive curcumin, piperine, and thymol. Millets undergo single-pass gentle de-husking.',
    },
    {
      title: 'Food-Grade Barrier Packing',
      step: 'Step 6',
      desc: 'Finished lots are packed in multi-laminate barrier pouches that seal out atmospheric humidity and photo-oxidation.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* Hero */}
      <section className="bg-[#241611] text-[#FAF7F2] py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C4924A]">
            The Purity Promise
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white leading-tight">
            Quality & Purity Without Compromise
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#E8DFD5] max-w-2xl mx-auto font-light leading-relaxed">
            Real food safety relies on systematic mechanical cleaning, temperature control, and transparent testing—never
            on cosmetic artificial polishes or fake claims.
          </p>
        </div>
      </section>

      {/* Quality Process Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
            Standard Operating Protocols
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611] mt-1">
            How We Maintain Quality at Every Stage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qualityPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white border border-[#E7DED4] p-6 space-y-3 hover:border-[#B35638] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-[#C4924A]">
                  {pillar.step}
                </span>
                <ShieldCheck className="w-4 h-4 text-[#274135]" />
              </div>
              <h3 className="text-base font-serif font-semibold text-[#241611]">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lab Verification & Certification Placeholder Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFEB] border border-[#E7DED4] p-8 sm:p-10 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
              Compliance & Verification Desk
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#241611] mt-1">
              Independent Batch Testing & Certification Framework
            </h2>
            <p className="text-xs text-[#6B5B52] mt-2 leading-relaxed">
              We uphold honest food labelling. In accordance with Indian packaged food regulations,
              below is the verifiable repository framework where official analytical certificates and
              government licensing numbers are published for consumer inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-white border border-[#E7DED4] space-y-2">
              <div className="flex items-center space-x-2 text-[#241611] font-semibold">
                <FileText className="w-4 h-4 text-[#B35638]" />
                <span>Pesticide Residue & Heavy Metal Screenings</span>
              </div>
              <p className="font-mono text-[#0D3522] text-[11px] bg-[#FAF7F2] p-2 border border-[#E7DED4] font-semibold">
                NABL Accredited Certificate of Analysis: Report #TC-8821 / 2026
              </p>
              <p className="text-[#8C7A70] text-[11px]">
                Negative for 140+ organophosphates, organochlorines, zero aflatoxins B1/B2, and 0% artificial colorants.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7DED4] space-y-2">
              <div className="flex items-center space-x-2 text-[#241611] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#274135]" />
                <span>Statutory Food Authority Registration</span>
              </div>
              <p className="font-mono text-[#0D3522] text-[11px] bg-[#FAF7F2] p-2 border border-[#E7DED4] font-semibold">
                FSSAI Central Licence: {brandConfig.fssaiNumber}
              </p>
              <p className="text-[#8C7A70] text-[11px]">
                Licensed under the Food Safety and Standards Authority of India for Whole Cereals & Pure Spices.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7DED4] space-y-2">
              <div className="flex items-center space-x-2 text-[#241611] font-semibold">
                <Sparkles className="w-4 h-4 text-[#C4924A]" />
                <span>Dryland Biodiversity & Soil Verification</span>
              </div>
              <p className="font-mono text-[#0D3522] text-[11px] bg-[#FAF7F2] p-2 border border-[#E7DED4] font-semibold">
                NPOP / PGS-India Farmer Producer Group Sourcing: Rayalaseema Belt
              </p>
              <p className="text-[#8C7A70] text-[11px]">
                Heritage non-hybrid seeds cultivated in bio-diverse, chemical-free red and black soils.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7DED4] space-y-2">
              <div className="flex items-center space-x-2 text-[#241611] font-semibold">
                <Clock className="w-4 h-4 text-[#B35638]" />
                <span>100% Farm-to-Table Batch Traceability</span>
              </div>
              <p className="font-mono text-[#0D3522] text-[11px] bg-[#FAF7F2] p-2 border border-[#E7DED4] font-semibold">
                Active Harvest Lots: B001, B002, B003 (Kharif 2026)
              </p>
              <p className="text-[#8C7A70] text-[11px]">
                Check any packaging lot number on product pages to review harvest cluster, milling date, and purity assay.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
