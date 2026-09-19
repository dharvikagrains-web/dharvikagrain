'use client';

import React from 'react';
import Link from 'next/link';
import { adminMetrics, adminInventoryItems } from '@/data/admin';
import { mockOrdersList } from '@/data/orders';
import { activeBatches } from '@/data/batches';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  Wheat,
  Plus,
  FileText,
  DollarSign,
  Download,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const lowStockItems = adminInventoryItems.filter((i) => i.stock <= i.threshold);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#8C7A70] uppercase tracking-wider">
            Operational Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E293B]">
            Dharvika Command Hub
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time D2C commerce, inventory thresholds, and batch quality tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Fulfill Orders ({adminMetrics.pendingOrders})</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Provision</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Sales</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              ₹{adminMetrics.todaySales.toLocaleString('en-IN')}
            </h2>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Orders</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {adminMetrics.todayOrders}
            </h2>
            <p className="text-[11px] text-gray-500 mt-1">
              <strong className="text-amber-600">{adminMetrics.pendingOrders} pending</strong> for packaging
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              ₹{adminMetrics.aov}
            </h2>
            <p className="text-[11px] text-gray-500 mt-1">
              Repeat purchase rate: <strong className="text-emerald-700">{adminMetrics.repeatRate}%</strong>
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Provisions</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {adminMetrics.activeProducts} SKUs
            </h2>
            <p className="text-[11px] text-gray-500 mt-1">
              {lowStockItems.length > 0 ? (
                <span className="text-amber-600 font-semibold">{lowStockItems.length} Low stock alerts</span>
              ) : (
                <span className="text-emerald-600">All stock optimal</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Recent Orders & Alerts/Traceability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-gray-200 shadow-xs">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-gray-900">
                Recent Orders Queue
              </h2>
              <p className="text-xs text-gray-500">Real-time incoming customer provisions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#0D3522] hover:text-[#B35638] flex items-center space-x-1"
            >
              <span>View All ({mockOrdersList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockOrdersList.map((order) => {
                  const id = order.orderId || order.id || 'DG10248';
                  const customerName = order.shippingAddress.fullName || order.shippingAddress.name || order.customerName;
                  return (
                    <tr key={id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-[#0D3522]">
                        #{id}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-gray-900">{customerName}</p>
                        <p className="text-[10px] text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-4 py-3.5 font-bold text-gray-900">
                        ₹{order.total}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-semibold border ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.status === 'Shipped' || order.status === 'Packed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/account/orders/${id}`}
                          target="_blank"
                          className="text-[#0D3522] hover:text-[#B35638] font-semibold text-xs inline-flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Inventory Alerts & Batch Quality */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Warning Box */}
          <div className="bg-white border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-amber-600 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Threshold Alerts ({lowStockItems.length})</span>
              </div>
              <Link href="/admin/inventory" className="text-[11px] font-semibold text-[#0D3522] hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xs flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {item.variant} · SKU: {item.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-700 block">{item.stock} left</span>
                    <span className="text-[10px] text-gray-400">Min: {item.threshold}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farm-to-Home Traceability & Quality Status */}
          <div className="bg-white border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-[#0D3522] font-semibold text-xs">
                <Wheat className="w-4 h-4" />
                <span>Verifiable Batches</span>
              </div>
              <Link href="/admin/batches" className="text-[11px] font-semibold text-[#0D3522] hover:underline">
                All Lots
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {activeBatches.slice(0, 3).map((b) => (
                <div key={b.batchId} className="p-3 bg-gray-50 border border-gray-200/80 rounded-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#0D3522]">{b.batchId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-semibold">
                      {b.qualityPassed ? '✓ Lab Passed' : 'Testing'}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800">{b.cropName}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                    <span>{b.farmerCluster}</span>
                    <span>Moisture: {b.moisturePercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
