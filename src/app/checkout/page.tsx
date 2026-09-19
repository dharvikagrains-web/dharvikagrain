'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { initialAddresses } from '@/data/addresses';
import { availableCoupons } from '@/data/coupons';
import { SavedAddress } from '@/types';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  ArrowRight,
  Home,
  Briefcase,
  Plus,
  Tag,
  Check,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, shippingFee, total } = useCart();

  // Step 1: Contact info
  const [mobile, setMobile] = useState('9876543210');
  const [email, setEmail] = useState('pavan@example.com');

  // Step 2: Delivery address selection
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(initialAddresses[0]?.id || '');
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);

  // New address form fields
  const [newFullName, setNewFullName] = useState('Pavan Geesala');
  const [newMobile, setNewMobile] = useState('+91 98765 43210');
  const [newPincode, setNewPincode] = useState('');
  const [newHouse, setNewHouse] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Hyderabad');
  const [newState, setNewState] = useState('Telangana');
  const [newType, setNewType] = useState<'Home' | 'Work'>('Home');

  // Step 4: Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    const found = availableCoupons.find((c) => c.code === code);
    if (!found) {
      setCouponMsg({ type: 'error', text: 'Invalid coupon code. Try WELCOME10 or TRADITION10' });
      return;
    }
    if (subtotal < found.minOrderValue) {
      setCouponMsg({
        type: 'error',
        text: `Minimum order value ₹${found.minOrderValue} required for ${found.code}`,
      });
      return;
    }
    let disc = 0;
    if (found.discountPercent) disc = Math.round((subtotal * found.discountPercent) / 100);
    else if (found.discountAmount) disc = found.discountAmount;

    setDiscountAmount(disc);
    setAppliedCoupon(found.code);
    setCouponMsg({ type: 'success', text: `Saved ₹${disc} with ${found.code}!` });
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      type: newType,
      fullName: newFullName,
      mobile: newMobile,
      pincode: newPincode,
      houseFlat: newHouse,
      streetArea: newStreet,
      landmark: newLandmark,
      city: newCity,
      state: newState,
    };
    setAddresses([...addresses, newAddr]);
    setSelectedAddressId(newAddr.id);
    setShowNewAddressModal(false);
  };

  const finalTotal = Math.max(0, total - discountAmount);

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    // Save checkout state into session for /checkout/payment
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'checkout_state',
        JSON.stringify({
          mobile,
          email,
          address: addresses.find((a) => a.id === selectedAddressId) || addresses[0],
          discountAmount,
          appliedCoupon,
          finalTotal,
        })
      );
    }
    router.push('/checkout/payment');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
        <Link href="/cart" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Cart
        </Link>
      </div>

      <div className="border-b border-[#E7DED4] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#B35638] uppercase">
            Step 1 of 2
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#0D3522] mt-0.5">
            Checkout
          </h1>
        </div>
        <p className="text-xs text-[#6B5B52]">
          Secure 256-bit encrypted checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Contact, Delivery, Coupon */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1 — Contact Information */}
          <div className="bg-white border border-[#E7DED4] p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#E7DED4]">
              <span className="w-5 h-5 rounded-full bg-[#0D3522] text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-serif font-bold text-[#0D3522] uppercase tracking-wider">
                Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#241611]">Mobile Number *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-[#FAF7F2] border border-r-0 border-[#E7DED4] text-xs font-semibold text-[#241611]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#241611]">Email Address (For Tax Invoice) *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2 — Delivery Address */}
          <div className="bg-white border border-[#E7DED4] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DED4]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#0D3522] text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-serif font-bold text-[#0D3522] uppercase tracking-wider">
                  Deliver To
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowNewAddressModal(true)}
                className="text-xs font-semibold text-[#0D3522] hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address Selectable Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`p-4 border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    selectedAddressId === addr.id
                      ? 'border-[#0D3522] bg-[#FAF7F2] ring-1 ring-[#0D3522]'
                      : 'border-[#E7DED4] bg-white hover:border-[#C5A059]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="deliveryAddress"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="text-[#0D3522]"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0D3522] flex items-center space-x-1">
                        {addr.type === 'Home' ? <Home className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                        <span>{addr.type}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[#6B5B52] space-y-0.5">
                    <p className="font-bold text-[#241611]">{addr.fullName}</p>
                    <p>{addr.houseFlat}, {addr.streetArea}</p>
                    <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="pt-1 text-[11px] text-[#241611]">Phone: {addr.mobile}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 4 — Coupon Application */}
          <div className="bg-white border border-[#E7DED4] p-6 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#E7DED4]">
              <Tag className="w-4 h-4 text-[#C5A059]" />
              <h2 className="text-sm font-serif font-bold text-[#0D3522] uppercase tracking-wider">
                Have a Coupon?
              </h2>
            </div>

            <form onSubmit={handleApplyCoupon} className="flex space-x-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="ENTER COUPON (e.g. WELCOME10)"
                className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3.5 py-2.5 text-xs uppercase tracking-wider focus:outline-none focus:border-[#0D3522]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex-shrink-0"
              >
                Apply
              </button>
            </form>

            {couponMsg && (
              <p
                className={`text-xs ${
                  couponMsg.type === 'success' ? 'text-[#0D3522] font-semibold' : 'text-[#B35638]'
                }`}
              >
                {couponMsg.text}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Step 3 — Order Summary & Payment Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E7DED4] p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-serif font-bold text-[#241611] pb-3 border-b border-[#E7DED4] uppercase tracking-wider">
              Step 3 — Order Summary ({cart.length} items)
            </h2>

            <div className="divide-y divide-[#E7DED4] max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.selectedWeight}`} className="py-2.5 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 bg-[#FAF7F2] border border-[#E7DED4] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#241611] line-clamp-1">{item.name}</p>
                      <p className="text-[#6B5B52] text-[11px]">{item.selectedWeight} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#0D3522]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E7DED4] space-y-2 text-xs text-[#6B5B52]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#241611]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-[#0D3522] uppercase tracking-wider">FREE</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#0D3522] font-semibold">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#E7DED4] flex justify-between text-lg font-serif font-bold text-[#0D3522]">
                <span>TOTAL</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToPayment}
              className="w-full py-4 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <span>PROCEED TO PAYMENT (₹{finalTotal})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-[#8C7A70] flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Next step: UPI, Net Banking, Cards, or Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      {showNewAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241611]/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DED4] max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-serif font-bold text-[#0D3522] pb-2 border-b border-[#E7DED4]">
              Add Delivery Address
            </h3>

            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">House / Flat / Building</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 301, Heritage Apts"
                  value={newHouse}
                  onChange={(e) => setNewHouse(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Street / Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jubilee Hills Road No. 36"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewAddressModal(false)}
                  className="px-4 py-2 border border-[#E7DED4] text-[#6B5B52]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D3522] text-white font-semibold"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
