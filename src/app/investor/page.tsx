'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/data/brandConfig';
import { batchRecords } from '@/data/batches';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShieldCheck,
  Download,
  ArrowUpRight,
  LogOut,
  Sparkles,
  BarChart3,
  Layers,
  MapPin,
} from 'lucide-react';

export default function InvestorDashboardPage() {
  const router = useRouter();
  const [investor, setInvestor] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dharvika_investor_session');
      if (!stored) {
        router.push('/investor/login');
        return;
      }
      try {
        setInvestor(JSON.parse(stored));
      } catch {
        router.push('/investor/login');
        return;
      } finally {
        setIsChecking(false);
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dharvika_investor_session');
    }
    router.push('/investor/login');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#091710] text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#A3B8AC] tracking-widest uppercase font-mono">
            Verifying Institutional Clearance...
          </p>
        </div>
      </div>
    );
  }

  // Unit Economics Model
  const unitEconomics = [
    {
      product: 'Ragi Flour (Finger Millet)',
      cluster: 'Ananthapuramu Collective',
      costPerKg: 42,
      pricePerKg: 120,
      marginPerKg: 78,
      marginPct: 65.0,
      volumeYtdKg: 5300,
    },
    {
      product: 'Foxtail Millet (Korralu)',
      cluster: 'Kurnool Millets FPO',
      costPerKg: 55,
      pricePerKg: 180,
      marginPerKg: 125,
      marginPct: 69.4,
      volumeYtdKg: 4900,
    },
    {
      product: 'Pure Turmeric Powder (Lakadong)',
      cluster: 'Jaintia Hills Organic Cluster',
      costPerKg: 145,
      pricePerKg: 320,
      marginPerKg: 175,
      marginPct: 54.7,
      volumeYtdKg: 2400,
    },
    {
      product: 'Kodo Millet (Arikelu)',
      cluster: 'Ananthapuramu Collective',
      costPerKg: 62,
      pricePerKg: 190,
      marginPerKg: 128,
      marginPct: 67.3,
      volumeYtdKg: 3200,
    },
    {
      product: 'Guntur Dryland Red Chilli',
      cluster: 'Guntur Producer Society',
      costPerKg: 180,
      pricePerKg: 360,
      marginPerKg: 180,
      marginPct: 50.0,
      volumeYtdKg: 1800,
    },
  ];

  const totalCostBasis = 1082000;
  const totalRetailValue = 2964000;
  const embeddedGrossProfit = totalRetailValue - totalCostBasis;

  return (
    <div className="min-h-screen bg-[#07130D] text-white">
      {/* Investor Top Navigation */}
      <header className="border-b border-[#1A3324] bg-[#0A1A12]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-full bg-[#0E2619] p-0.5 border border-[#C5A059] overflow-hidden">
              <Image
                src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                alt="Emblem"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block">
                Dharvika Grains
              </span>
              <span className="text-sm font-serif font-bold text-white tracking-wide">
                Institutional Investor Room
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 bg-[#10291C] border border-[#234A34] text-[#A6E8BA] rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#34A853]" />
              Verified Partner: {investor?.name || 'Investor'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 border border-[#315740] hover:border-[#B35638] text-[#D0DFD6] hover:text-[#FF8A65] transition-colors flex items-center space-x-1.5 text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0C2417] via-[#102C1D] to-[#0A1A12] border border-[#C5A059]/40 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-widest text-[#C5A059] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CONFIDENTIAL STAKEHOLDER MEMORANDUM • FY 2026-27</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Direct-from-Farm Premium Grain D2C Architecture
            </h1>
            <p className="text-xs sm:text-sm text-[#A8BEB1] max-w-3xl leading-relaxed">
              Dharvika Grains eliminates 4 layers of traditional APMC wholesale intermediaries. By procuring directly from dryland Farmer Producer Organizations (FPOs) and controlling processing, moisture grading, and FSSAI packaging in-house, the brand achieves top-tier gross margins while returning 25% higher payouts to rural farming clusters.
            </p>
          </div>
        </div>

        {/* 4 Core Financial Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#0B1E14] border border-[#1C3A29] p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8BA595]">
              <span>Annualized Run Rate (GMV)</span>
              <TrendingUp className="w-4 h-4 text-[#34A853]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
              ₹28,40,000
            </div>
            <div className="text-[11px] text-[#34A853] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>+38% quarter-over-quarter</span>
            </div>
          </div>

          <div className="bg-[#0B1E14] border border-[#1C3A29] p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8BA595]">
              <span>Blended Gross Margin</span>
              <BarChart3 className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C5A059]">
              64.5%
            </div>
            <div className="text-[11px] text-[#A8BEB1]">
              Industry Benchmark: 38–44%
            </div>
          </div>

          <div className="bg-[#0B1E14] border border-[#1C3A29] p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8BA595]">
              <span>Average Order Value (AOV)</span>
              <DollarSign className="w-4 h-4 text-[#34A853]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
              ₹540
            </div>
            <div className="text-[11px] text-[#A8BEB1]">
              Avg. 2.4 small-batch items per basket
            </div>
          </div>

          <div className="bg-[#0B1E14] border border-[#1C3A29] p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8BA595]">
              <span>45-Day Cohort Repeat Rate</span>
              <Users className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
              43.2%
            </div>
            <div className="text-[11px] text-[#34A853]">
              Daily kitchen consumption staple
            </div>
          </div>
        </div>

        {/* Section: Unit Economics Matrix */}
        <div className="bg-[#0B1E14] border border-[#1C3A29] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1A3827]">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-bold block font-mono">
                Category Unit Economics
              </span>
              <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                Farmgate Procurement vs Retail Gross Margins
              </h2>
            </div>
            <button
              type="button"
              onClick={() => alert('Unit Economics Audit Pack (CSV) dispatched to your registered investor email.')}
              className="px-3.5 py-2 bg-[#122C1E] hover:bg-[#183927] border border-[#274F37] text-xs font-semibold text-[#D0DFD6] flex items-center space-x-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Export Audit Data (CSV)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1C3A29] text-[11px] uppercase tracking-wider text-[#8BA595] font-mono">
                <tr>
                  <th className="py-3 pr-4">Product Variety</th>
                  <th className="py-3 px-3">Sourcing Cluster</th>
                  <th className="py-3 px-3 text-right">Farmgate Cost</th>
                  <th className="py-3 px-3 text-right">Retail Price</th>
                  <th className="py-3 px-3 text-right">Gross Spread</th>
                  <th className="py-3 px-3 text-right">Gross Margin</th>
                  <th className="py-3 pl-3 text-right">Volume Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#132A1D]">
                {unitEconomics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0E2619] transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-white">
                      {row.product}
                    </td>
                    <td className="py-3.5 px-3 text-[#A8BEB1]">
                      {row.cluster}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[#E0E9E3]">
                      ₹{row.costPerKg}/kg
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      ₹{row.pricePerKg}/kg
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[#34A853] font-semibold">
                      +₹{row.marginPerKg}/kg
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 bg-[#0A2616] border border-[#1E4E30] text-[#34A853] font-bold font-mono rounded-xs">
                        {row.marginPct}%
                      </span>
                    </td>
                    <td className="py-3.5 pl-3 text-right font-mono text-[#C5A059]">
                      {row.volumeYtdKg.toLocaleString()} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Warehouse Inventory Valuation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[#0B1E14] border border-[#1C3A29] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A3827]">
              <div>
                <span className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-bold block font-mono">
                  Asset Backing
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Warehouse Physical Inventory Valuation
                </h3>
              </div>
              <Layers className="w-5 h-5 text-[#C5A059]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#091710] border border-[#173022] space-y-1">
                <span className="text-[11px] text-[#8BA595]">Capital Deployed (Cost)</span>
                <p className="text-xl font-mono font-bold text-white">
                  ₹{(totalCostBasis / 100000).toFixed(2)} L
                </p>
                <span className="text-[10px] text-[#718B7A]">Farmgate procurement</span>
              </div>

              <div className="p-4 bg-[#091710] border border-[#173022] space-y-1">
                <span className="text-[11px] text-[#8BA595]">Retail Inventory Value</span>
                <p className="text-xl font-mono font-bold text-[#C5A059]">
                  ₹{(totalRetailValue / 100000).toFixed(2)} L
                </p>
                <span className="text-[10px] text-[#718B7A]">At current selling prices</span>
              </div>

              <div className="p-4 bg-[#091710] border border-[#173022] space-y-1">
                <span className="text-[11px] text-[#8BA595]">Embedded Gross Profit</span>
                <p className="text-xl font-mono font-bold text-[#34A853]">
                  ₹{(embeddedGrossProfit / 100000).toFixed(2)} L
                </p>
                <span className="text-[10px] text-[#34A853]">63.5% realization</span>
              </div>
            </div>

            <div className="text-xs text-[#8BA595] leading-relaxed pt-2">
              All grains are packed in high-barrier vacuum pouches with nitrogen flushing to maintain zero pest infestation and sub-11% moisture levels for up to 12 months without chemical fumigation.
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0B1E14] border border-[#1C3A29] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A3827]">
              <div>
                <span className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-bold block font-mono">
                  Origin Moat
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Farm Cluster Direct Sourcing
                </h3>
              </div>
              <MapPin className="w-5 h-5 text-[#34A853]" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#091710] border border-[#173022] space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>Ananthapuramu & Kurnool FPOs</span>
                  <span className="text-[#C5A059]">320+ Smallholder Farmers</span>
                </div>
                <p className="text-[11px] text-[#8BA595]">
                  Dryland rainfed finger millet (Ragi), foxtail millet, and kodo millet with 100% natural manure cultivation.
                </p>
              </div>

              <div className="p-3 bg-[#091710] border border-[#173022] space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>Jaintia Hills Organic Cluster, Meghalaya</span>
                  <span className="text-[#C5A059]">7.4% Curcumin Lakadong</span>
                </div>
                <p className="text-[11px] text-[#8BA595]">
                  High-altitude wild heirloom turmeric ground at low temperatures (&lt;40°C) to protect therapeutic volatile oils.
                </p>
              </div>

              <div className="p-3 bg-[#091710] border border-[#173022] space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>Guntur Dryland Farm Collective</span>
                  <span className="text-[#C5A059]">Pesticide-Free Red Chilli</span>
                </div>
                <p className="text-[11px] text-[#8BA595]">
                  Sun-dried, cold-stone pounded with zero added artificial coloring or capsaicin extract fortification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-[#1C3A29] flex flex-col sm:flex-row items-center justify-between text-xs text-[#718B7A] gap-4">
          <p>© 2026 Dharvika Grains Private Limited • Strictly Confidential Stakeholder Material</p>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-white transition-colors">
              Public Storefront
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin Operations
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
