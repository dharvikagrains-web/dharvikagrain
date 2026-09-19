'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockOrdersList } from '@/data/orders';
import { OrderDetails } from '@/types';
import {
  Search,
  Download,
  Eye,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDetails[]>(mockOrdersList);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterStatuses = ['All', 'Processing', 'Packed', 'Shipped', 'Delivered'];

  const filteredOrders = orders.filter((order) => {
    const oId = (order.orderId || order.id || '');
    const cName = (order.shippingAddress.fullName || order.shippingAddress.name || order.customerName || '');
    const cCity = (order.shippingAddress.city || '');
    const cPhone = (order.mobile || '');

    if (statusFilter !== 'All') {
      if (statusFilter === 'Processing' && order.status !== 'Processing' && order.status !== 'Order Processing') {
        return false;
      } else if (statusFilter !== 'Processing' && order.status !== statusFilter) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        oId.toLowerCase().includes(q) ||
        cName.toLowerCase().includes(q) ||
        cCity.toLowerCase().includes(q) ||
        cPhone.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderDetails['status']) => {
    setOrders((prev) =>
      prev.map((o) => ((o.orderId === orderId || o.id === orderId) ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Order Fulfillment Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Process, dispatch, and track customer shipments across India.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Bulk packing slips downloaded for pending orders.')}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Manifest (CSV)</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filterStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === status
                    ? 'bg-[#0D3522] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Customer & Destination</th>
                <th className="px-4 py-3">Provisions</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Fulfillment Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No orders matching criteria
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const id = order.orderId || order.id || 'DG10248';
                  const customerName = order.shippingAddress.fullName || order.shippingAddress.name || order.customerName;
                  const isProcessing = order.status === 'Processing' || order.status === 'Order Processing';
                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-[#0D3522]">
                        #{id}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-gray-900">{customerName}</p>
                        <p className="text-[10px] text-gray-500">{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        <span className="font-medium">{order.items.length} items</span>
                        <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
                          {order.items.map((i) => i.name).join(', ')}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-gray-900 block">₹{order.total}</span>
                        <span className="text-[10px] text-gray-500">{order.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold border ${
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
                      <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap">
                        {isProcessing && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(id, 'Packed')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-semibold transition-colors"
                          >
                            Mark Packed
                          </button>
                        )}
                        {order.status === 'Packed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(id, 'Shipped')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold transition-colors"
                          >
                            Ship Order
                          </button>
                        )}
                        <Link
                          href={`/account/orders/${id}`}
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-gray-900 inline-block"
                          title="View Full Order & Timeline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
