'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, CreditCard, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, shippingFee, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    houseAddress: '',
    streetAddress: '',
    city: '',
    state: 'Andhra Pradesh',
    pincode: '',
    paymentMethod: 'upi',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const indianStates = [
    'Andhra Pradesh',
    'Telangana',
    'Karnataka',
    'Tamil Nadu',
    'Kerala',
    'Maharashtra',
    'Gujarat',
    'Delhi NCR',
    'Rajasthan',
    'Madhya Pradesh',
    'Uttar Pradesh',
    'West Bengal',
    'Other Indian State',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-IN-${randomNum}`;

    const orderPayload = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      customer: formData,
      items: cart,
      subtotal,
      shippingFee,
      total,
      paymentMethod: formData.paymentMethod,
      status: 'Confirmed',
    };

    // Save mock order in session/storage for order-success page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('latest_order', JSON.stringify(orderPayload));
    }

    setTimeout(() => {
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-[#241611]">Your cart is empty</h2>
        <p className="text-xs text-[#6B5B52] mt-2">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block px-6 py-3 bg-[#241611] text-white text-xs uppercase tracking-widest font-semibold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-6">
        <Link href="/cart" className="text-xs text-[#6B5B52] hover:text-[#241611] flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Cart
        </Link>
      </div>

      <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-[#241611] mb-8">
        Checkout & Delivery Details
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 bg-white border border-[#E7DED4] p-6 sm:p-8">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Contact Details */}
            <div>
              <h2 className="text-sm font-serif font-semibold text-[#241611] uppercase tracking-wider pb-3 border-b border-[#E7DED4]">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#241611]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sridhar Varma"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#241611]">
                    Mobile Number (for delivery updates) *
                  </label>
                  <div className="flex">
                    <span className="bg-[#EFE7DE] border border-r-0 border-[#E7DED4] px-2.5 py-2.5 text-xs text-[#6B5B52] font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[#241611]">
                    Email Address (for order invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t border-[#E7DED4]">
              <h2 className="text-sm font-serif font-semibold text-[#241611] uppercase tracking-wider pb-3 border-b border-[#E7DED4]">
                2. Delivery Address in India
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[#241611]">
                    Flat / House No. / Building Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="houseAddress"
                    value={formData.houseAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 302, Sai Residency"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[#241611]">
                    Street / Colony / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. 4th Cross, Near Heritage Fresh"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#241611]">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Hyderabad"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#241611]">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN code"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[#241611]">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs text-[#241611] focus:outline-none focus:border-[#B35638]"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Architecture Interface */}
            <div className="pt-4 border-t border-[#E7DED4]">
              <h2 className="text-sm font-serif font-semibold text-[#241611] uppercase tracking-wider pb-3 border-b border-[#E7DED4]">
                3. Payment Gateway Integration
              </h2>
              <p className="text-[11px] text-[#6B5B52] mt-2 mb-3">
                Architected for Indian Payment Gateways (Razorpay / Cashfree / PhonePe integration).
              </p>

              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3.5 border border-[#E7DED4] bg-[#FAF7F2] cursor-pointer hover:border-[#B35638]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="accent-[#B35638]"
                  />
                  <Smartphone className="w-4 h-4 text-[#B35638]" />
                  <div className="text-xs">
                    <span className="font-semibold text-[#241611]">Instant UPI / QR</span>
                    <span className="text-[#6B5B52] block text-[11px]">
                      Google Pay, PhonePe, Paytm, BHIM, Cred
                    </span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3.5 border border-[#E7DED4] bg-[#FAF7F2] cursor-pointer hover:border-[#B35638]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="accent-[#B35638]"
                  />
                  <CreditCard className="w-4 h-4 text-[#B35638]" />
                  <div className="text-xs">
                    <span className="font-semibold text-[#241611]">Cards & Net Banking</span>
                    <span className="text-[#6B5B52] block text-[11px]">
                      Visa, MasterCard, RuPay, Indian Netbanking
                    </span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3.5 border border-[#E7DED4] bg-[#FAF7F2] cursor-pointer hover:border-[#B35638]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="accent-[#B35638]"
                  />
                  <Truck className="w-4 h-4 text-[#B35638]" />
                  <div className="text-xs">
                    <span className="font-semibold text-[#241611]">Cash on Delivery (COD)</span>
                    <span className="text-[#6B5B52] block text-[11px]">
                      Pay cash or UPI upon delivery at your doorstep
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#B35638] hover:bg-[#9E462A] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming Order...' : `Place Order • ${formatCurrency(total)}`}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 bg-white border border-[#E7DED4] p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-serif font-semibold text-[#241611] pb-3 border-b border-[#E7DED4]">
            Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto divide-y divide-[#F0E8DF] pr-2">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedWeight}`}
                className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 bg-[#F5EFEB] flex-shrink-0 border border-[#E7DED4] overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#241611] leading-snug">{item.name}</h4>
                    <span className="text-[#6B5B52] text-[11px]">
                      {item.selectedWeight} × {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-[#241611]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-[#E7DED4] text-xs">
            <div className="flex justify-between text-[#6B5B52]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#241611]">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6B5B52]">
              <span>Shipping Fee</span>
              <span>
                {shippingFee === 0 ? (
                  <strong className="text-[#274135] uppercase">FREE</strong>
                ) : (
                  formatCurrency(shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#241611] pt-3 border-t border-[#E7DED4]">
              <span>Grand Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4] space-y-2 text-[11px] text-[#6B5B52]">
            <p className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#274135]" /> Food-Grade Purity Packaging
            </p>
            <p className="flex items-center">
              <Truck className="w-3.5 h-3.5 mr-1.5 text-[#274135]" /> Prompt Dispatch within 24–48 Hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
