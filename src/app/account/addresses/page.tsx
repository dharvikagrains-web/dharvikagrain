'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialAddresses } from '@/data/addresses';
import { SavedAddress } from '@/types';
import { MapPin, Plus, Trash2, Edit2, Check, ArrowLeft, Home, Briefcase } from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [type, setType] = useState<'Home' | 'Work'>('Home');

  const openAddModal = () => {
    setEditingId(null);
    setFullName('Pavan Geesala');
    setMobile('+91 98765 43210');
    setPincode('');
    setHouseFlat('');
    setStreetArea('');
    setLandmark('');
    setCity('Hyderabad');
    setState('Telangana');
    setType('Home');
    setIsModalOpen(true);
  };

  const openEditModal = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setFullName(addr.fullName);
    setMobile(addr.mobile);
    setPincode(addr.pincode);
    setHouseFlat(addr.houseFlat);
    setStreetArea(addr.streetArea);
    setLandmark(addr.landmark || '');
    setCity(addr.city);
    setState(addr.state);
    setType(addr.type);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, fullName, mobile, pincode, houseFlat, streetArea, landmark, city, state, type }
            : a
        )
      );
    } else {
      const newAddress: SavedAddress = {
        id: `addr-${Date.now()}`,
        type,
        fullName,
        mobile,
        pincode,
        houseFlat,
        streetArea,
        landmark,
        city,
        state,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
        <Link href="/account" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Account
        </Link>
      </div>

      <div className="border-b border-[#E7DED4] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#B35638] uppercase">
            Address Book
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#0D3522] mt-1">
            Saved Addresses
          </h1>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white border border-[#E7DED4] p-6 space-y-4 relative group hover:border-[#C5A059] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#FAF7F2] border border-[#E7DED4] text-[10px] uppercase tracking-wider font-bold text-[#0D3522]">
                {addr.type === 'Home' ? <Home className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                <span>{addr.type}</span>
              </span>
              {addr.isDefault && (
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">
                  Default Delivery Address
                </span>
              )}
            </div>

            <div className="space-y-1 text-xs text-[#6B5B52]">
              <p className="font-bold text-sm text-[#241611]">{addr.fullName}</p>
              <p>{addr.houseFlat}, {addr.streetArea}</p>
              {addr.landmark && <p className="text-[11px] text-[#8C7A70]">Landmark: {addr.landmark}</p>}
              <p>{addr.city}, {addr.state} — <strong className="text-[#241611]">{addr.pincode}</strong></p>
              <p className="pt-1 text-[#241611]">Phone: {addr.mobile}</p>
            </div>

            <div className="pt-4 border-t border-[#E7DED4] flex items-center space-x-4 text-xs">
              <button
                type="button"
                onClick={() => openEditModal(addr)}
                className="text-[#0D3522] font-semibold hover:underline flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="text-[#8C7A70] hover:text-[#B35638] flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241611]/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DED4] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-bold text-[#0D3522] pb-3 border-b border-[#E7DED4]">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#241611]">House / Flat / Building *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Sri Nilayam"
                  value={houseFlat}
                  onChange={(e) => setHouseFlat(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#241611]">Street / Area / Colony *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhapur Main Road, Hitec City"
                  value={streetArea}
                  onChange={(e) => setStreetArea(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="500032"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#241611]">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Cyber Towers"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                />
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-semibold text-[#241611] block mb-1">Address Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addrType"
                      checked={type === 'Home'}
                      onChange={() => setType('Home')}
                      className="text-[#0D3522]"
                    />
                    <span>Home (All day delivery)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addrType"
                      checked={type === 'Work'}
                      onChange={() => setType('Work')}
                      className="text-[#0D3522]"
                    />
                    <span>Work (10 AM - 6 PM)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7DED4] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E7DED4] text-[#6B5B52] hover:text-[#241611]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white font-semibold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
