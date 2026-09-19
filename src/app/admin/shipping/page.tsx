'use client';

import React, { useState } from 'react';
import { adminShipments } from '@/data/admin';
import { ShipmentRecord } from '@/types';
import {
  Truck,
  Package,
  Printer,
  Calendar,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';

export default function AdminShippingPage() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>(adminShipments);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredShipments = shipments.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const awb = (s.awbNumber || s.trackingId || '').toLowerCase();
      const customer = (s.customerName || '').toLowerCase();
      return (
        s.orderId.toLowerCase().includes(q) ||
        awb.includes(q) ||
        customer.includes(q) ||
        s.courierPartner.toLowerCase().includes(q)
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
            Logistics & Transport
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Dispatch & Courier Operations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Integrated with Delhivery and Blue Dart Air Express for pan-India delivery.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => alert('Today pickup scheduled with Delhivery Logistics (4:00 PM).')}
            className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Schedule Courier Pickup</span>
          </button>
        </div>
      </div>

      {/* Courier Integration Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Primary Partner</span>
            <h4 className="text-sm font-bold text-gray-900 mt-0.5">Delhivery Express</h4>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>API Live · Auto-manifesting</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
            DLV
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Air Express Partner</span>
            <h4 className="text-sm font-bold text-gray-900 mt-0.5">Blue Dart Apex</h4>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Metro 48-Hour Delivery</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            BD
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Dispatch Window</span>
            <h4 className="text-sm font-bold text-gray-900 mt-0.5">Same-Day Pick & Pack</h4>
            <span className="text-[11px] text-gray-500 mt-1 block">
              Orders before 2:00 PM dispatched daily
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, AWB, or recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
          />
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Customer & Destination</th>
                <th className="px-4 py-3">Courier Partner</th>
                <th className="px-4 py-3">AWB Tracking Number</th>
                <th className="px-4 py-3">Dispatch Date</th>
                <th className="px-4 py-3">Delivery Status</th>
                <th className="px-4 py-3 text-right">Shipping Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-[#0D3522]">
                    #{shipment.orderId}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">{shipment.customerName}</p>
                    <p className="text-[10px] text-gray-500">Destination Hub</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800">
                    {shipment.courierPartner}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-gray-700">
                    {shipment.awbNumber}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {shipment.dispatchDate}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold border ${
                        shipment.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Thermal shipping label downloaded for AWB: ${shipment.awbNumber}`)}
                      className="px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-[10px] font-semibold inline-flex items-center space-x-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Label</span>
                    </button>
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
