'use client';

import React from 'react';
import { adminMetrics } from '@/data/admin';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  ShoppingBag,
  DollarSign,
  Users,
  Percent,
  Download,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const monthlyRevenue = [
    { month: 'Apr', revenue: '₹3.4L', height: '40%' },
    { month: 'May', revenue: '₹4.1L', height: '50%' },
    { month: 'Jun', revenue: '₹5.2L', height: '62%' },
    { month: 'Jul', revenue: '₹6.5L', height: '75%' },
    { month: 'Aug', revenue: '₹7.8L', height: '88%' },
    { month: 'Sep (MTD)', revenue: '₹8.4L', height: '100%', current: true },
  ];

  const categoryShare = [
    { name: 'Chiru Dhanyalu (Millets)', share: 58, color: 'bg-[#0D3522]' },
    { name: 'Pure Spices', share: 28, color: 'bg-[#B35638]' },
    { name: 'Signature Masalas', share: 9, color: 'bg-[#C5A059]' },
    { name: 'Curated Combos & Boxes', share: 5, color: 'bg-[#5C4D44]' },
  ];

  const topSellingSKUs = [
    { name: 'Korralu (Foxtail Millet) 1kg', units: 642, revenue: '₹1,12,350' },
    { name: 'Pure Turmeric Powder (Lakadong) 250g', units: 580, revenue: '₹95,700' },
    { name: 'Arikelu (Kodo Millet) 1kg', units: 490, revenue: '₹93,100' },
    { name: 'Ancient Grain Trio Combo Box', units: 140, revenue: '₹68,600' },
    { name: 'Ragi (Finger Millet) 1kg', units: 420, revenue: '₹48,300' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Executive Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Performance & Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Key metrics tracking customer acquisition, cohort retention, and harvest volume.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Q3 2026 Executive Performance Report downloaded (PDF).')}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Financial Report (PDF)</span>
        </button>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Merchandise Value</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-2">
            ₹{adminMetrics.revenueLakhs} Lakhs
          </h2>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            +32% QoQ Growth
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Store Conversion Rate</span>
            <Percent className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-2">
            {adminMetrics.conversionRate}%
          </h2>
          <span className="text-[11px] text-gray-500 block mt-1">
            Industry benchmark for food D2C: 2.2%
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Repeat Customer Rate</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-2">
            {adminMetrics.repeatRate}%
          </h2>
          <span className="text-[11px] text-purple-600 font-semibold block mt-1">
            High loyalty on 1kg staple grains
          </span>
        </div>

        <div className="bg-white border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Lifetime Dispatched Orders</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-2">
            {adminMetrics.totalLifetimeOrders.toLocaleString('en-IN')}
          </h2>
          <span className="text-[11px] text-gray-500 block mt-1">
            Across 22 Indian States
          </span>
        </div>
      </div>

      {/* Revenue Growth Bar Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Bar Chart Visual */}
        <div className="lg:col-span-7 bg-white border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900">
                Monthly GMV Trajectory (2026)
              </h3>
              <p className="text-xs text-gray-500">Consecutive month-on-month sales volume</p>
            </div>
            <span className="text-xs font-bold text-[#0D3522] bg-emerald-50 px-2.5 py-1 border border-emerald-200">
              Profitable Unit Economics
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-8 px-4">
            {monthlyRevenue.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.revenue}
                </span>
                <div
                  style={{ height: item.height }}
                  className={`w-full max-w-[48px] rounded-t-xs transition-all ${
                    item.current ? 'bg-[#0D3522]' : 'bg-[#E7DED4] group-hover:bg-[#C5A059]'
                  }`}
                />
                <span className="text-xs font-medium text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="lg:col-span-5 bg-white border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <h3 className="font-serif font-bold text-base text-gray-900">
              Revenue by Category
            </h3>
            <p className="text-xs text-gray-500">Contribution to gross monthly volume</p>
          </div>

          <div className="space-y-4">
            {categoryShare.map((cat) => (
              <div key={cat.name} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <span className="font-bold text-gray-900">{cat.share}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className={`h-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing SKUs Table */}
      <div className="bg-white border border-gray-200 shadow-xs">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-serif font-bold text-base text-gray-900">
            Top Performing Provisions by Volume
          </h3>
          <p className="text-xs text-gray-500">Best-selling harvest products driving recurring basket additions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Provision Name</th>
                <th className="px-4 py-3">Units Sold</th>
                <th className="px-4 py-3">Total Value</th>
                <th className="px-4 py-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topSellingSKUs.map((sku, index) => (
                <tr key={sku.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-gray-400">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">
                    {sku.name}
                  </td>
                  <td className="px-4 py-3.5 text-gray-700">
                    {sku.units} bags
                  </td>
                  <td className="px-4 py-3.5 font-bold text-gray-900">
                    {sku.revenue}
                  </td>
                  <td className="px-4 py-3.5 text-right text-emerald-600 font-semibold">
                    ↑ High Velocity
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
