'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Award,
  Download,
} from 'lucide-react';

const mockCustomers = [
  {
    id: 'cust-01',
    name: 'Pavan Geesala',
    phone: '+91 98765 43210',
    email: 'pavan@dharvikagrains.in',
    city: 'Hyderabad, Telangana',
    ordersCount: 6,
    totalSpent: 4850,
    segment: 'Loyal Pantry Cook',
    lastOrder: '18 Sep 2026',
  },
  {
    id: 'cust-02',
    name: 'Saritha Reddy',
    phone: '+91 94401 23456',
    email: 'saritha.reddy@gmail.com',
    city: 'Hyderabad, Telangana',
    ordersCount: 4,
    totalSpent: 3220,
    segment: 'Repeat Cook',
    lastOrder: '16 Sep 2026',
  },
  {
    id: 'cust-03',
    name: 'Dr. Ramesh Rao',
    phone: '+91 98220 98765',
    email: 'dr.ramesh@apollo.org',
    city: 'Bengaluru, Karnataka',
    ordersCount: 5,
    totalSpent: 4120,
    segment: 'Loyal Pantry Cook',
    lastOrder: '12 Sep 2026',
  },
  {
    id: 'cust-04',
    name: 'Deepa Krishnan',
    phone: '+91 97909 54321',
    email: 'deepa.krishnan@outlook.com',
    city: 'Chennai, Tamil Nadu',
    ordersCount: 3,
    totalSpent: 2450,
    segment: 'Repeat Cook',
    lastOrder: '08 Sep 2026',
  },
  {
    id: 'cust-05',
    name: 'Ananya Sharma',
    phone: '+91 99100 88221',
    email: 'ananya.sharma@gmail.com',
    city: 'Mumbai, Maharashtra',
    ordersCount: 2,
    totalSpent: 1690,
    segment: 'New Customer',
    lastOrder: '17 Sep 2026',
  },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = mockCustomers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Customer Relationship Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Customer Directory ({mockCustomers.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Profiles, purchasing frequency, lifetime spend, and regional cohorts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Customer cohort data exported to CSV.')}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Customer CRM (CSV)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact Details</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Total Orders</th>
                <th className="px-4 py-3">Lifetime Value</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3 text-right">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">{cust.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{cust.id}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-gray-800 font-medium">{cust.phone}</p>
                    <p className="text-[11px] text-gray-500">{cust.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700">
                    {cust.city}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">
                    {cust.ordersCount} orders
                  </td>
                  <td className="px-4 py-3.5 font-bold text-gray-900">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold border ${
                        cust.segment === 'Loyal Pantry Cook'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : cust.segment === 'Repeat Cook'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {cust.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-500">
                    {cust.lastOrder}
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
