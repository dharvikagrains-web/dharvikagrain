import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import { Compass, CheckCircle2, ShieldCheck, RefreshCw, Truck, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Farm-to-Home Sourcing Journey | Transparent Indian Agriculture',
  description:
    'Discover how our Chiru Dhanyalu and pure spices journey from traditional dryland farms, through precision mechanical cleaning and cold-milling, straight to your doorstep.',
};

export default function SourcingPage() {
  const steps = [
    {
      num: '01',
      title: 'Direct Source Selection',
      subtitle: 'Dryland farmer clusters in the Deccan plateau',
      description:
        'We work directly with rain-fed farmer clusters across Rayalaseema, North Karnataka, and Telangana. These regions receive low rainfall, forcing millets to develop dense root systems that pull rich minerals from the deep red and black soils without synthetic chemical fertilizers.',
      image: '/images/products/jowar-sorghum.jpg',
    },
    {
      num: '02',
      title: 'Pre-Processing Quality Verification',
      subtitle: 'Moisture calibration & foreign matter screening',
      description:
        'Before any harvest enters our facility, samples undergo moisture testing (<12% for millets, <8% for whole spices) and preliminary residue screenings. Any lot that shows artificial fumigation or high moisture is immediately turned away.',
      image: '/images/products/arikelu-kodo-millet.jpg',
    },
    {
      num: '03',
      title: 'Gentle Mechanical Processing',
      subtitle: 'Unpolished de-husking & low-heat cold milling',
      description:
        'For our millets, we use gentle abrasive rubber-roller dehullers that remove only the outer woody hull while leaving the edible bran and germ completely intact. For spices, we grind at temperatures strictly below 40°C in slow hammer mills, preventing thermal breakdown of volatile aroma oils.',
      image: '/images/products/pure-coriander-powder.jpg',
    },
    {
      num: '04',
      title: 'Multi-Barrier Packaging',
      subtitle: 'Certified food-grade nitrogen flushed pouches',
      description:
        'To prevent oxidation and preserve shelf life without chemical preservatives, our products are packed in high-barrier multi-layer pouches that block moisture, oxygen, and UV light. Each batch is stamped with its crop harvest season and packaging date.',
      image: '/images/products/pure-red-chilli-powder.jpg',
    },
    {
      num: '05',
      title: 'Direct to Your Kitchen',
      subtitle: 'Prompt dispatch with verified traceability',
      description:
        'Orders are packed fresh and dispatched directly to your home across India within 24 to 48 hours. By avoiding prolonged retail shelf storage, you receive grains and spices that retain their maximum natural aroma and freshness.',
      image: '/images/products/korralu-foxtail-millet.jpg',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* Hero */}
      <section className="bg-[#241611] text-[#FAF7F2] py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C4924A]">
            Complete Agricultural Transparency
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white leading-tight">
            The Farm-to-Home Sourcing Journey
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#E8DFD5] max-w-2xl mx-auto font-light leading-relaxed">
            Traceability isn&rsquo;t a marketing catchphrase—it is our operating principle. Here is the exact
            journey every grain and spice undertakes before arriving in your kitchen.
          </p>
        </div>
      </section>

      {/* Sourcing Steps Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
              idx % 2 === 1 ? 'md:grid-flow-dense' : ''
            }`}
          >
            <div
              className={`md:col-span-6 space-y-3 ${
                idx % 2 === 1 ? 'md:col-start-7' : ''
              }`}
            >
              <span className="text-3xl font-serif font-bold text-[#C4924A]">{step.num}</span>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#241611]">
                {step.title}
              </h2>
              <p className="text-xs font-semibold text-[#B35638] uppercase tracking-wider">
                {step.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                {step.description}
              </p>
            </div>

            <div
              className={`md:col-span-6 relative aspect-16/10 bg-[#F5EFEB] border border-[#E7DED4] overflow-hidden ${
                idx % 2 === 1 ? 'md:col-start-1' : ''
              }`}
            >
              <Image src={step.image} alt={step.title} fill className="object-cover" />
            </div>
          </div>
        ))}
      </section>

      {/* Sourcing Location Placeholder Map / Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFEB] border border-[#E7DED4] p-8 sm:p-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
            Farmer Cluster Coordinates
          </span>
          <h3 className="text-xl font-serif font-semibold text-[#241611]">
            Transparent Regional Origins
          </h3>
          <p className="text-xs text-[#6B5B52] max-w-xl mx-auto leading-relaxed">
            We source our grains and spices from defined agro-climatic clusters:
            Korralu & Arikelu from the red-loam belts of Ananthapuramu and Kurnool (AP);
            Samalu from Nalgonda (Telangana); Turmeric from Lakadong & Duggirala; Red Chilli from Guntur;
            and Malabar Peppercorns from Wayanad.
          </p>
          <div className="pt-2">
            <Link
              href="/quality"
              className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-[#241611] hover:text-[#B35638]"
            >
              <span>View Quality & Testing Standards</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
