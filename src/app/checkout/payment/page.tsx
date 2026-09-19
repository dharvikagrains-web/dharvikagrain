'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Truck,
  CheckCircle2,
  RefreshCw,
  Lock,
} from 'lucide-react';

export default function PaymentGatewayPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'>('upi');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    finalTotal: number;
    discountAmount: number;
    appliedCoupon: string | null;
  }>({
    finalTotal: 190,
    discountAmount: 0,
    appliedCoupon: null,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('checkout_state');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCheckoutData(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      const orderId = 'DG10248';
      router.push(`/order/success?orderId=${orderId}`);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
        <Link href="/checkout" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Delivery Details
        </Link>
      </div>

      <div className="border-b border-[#E7DED4] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#B35638] uppercase">
            Step 2 of 2
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#0D3522] mt-0.5">
            Select Payment Method
          </h1>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-[#0D3522] font-semibold bg-[#EBF7EE] px-2.5 py-1 rounded-xs">
          <Lock className="w-3.5 h-3.5" />
          <span>PCI-DSS 256-bit Encrypted Gateway</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Payment Methods Selector */}
        <div className="md:col-span-8 bg-white border border-[#E7DED4] divide-y divide-[#E7DED4] shadow-xs">
          {/* Method 1: UPI */}
          <div className="p-5">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="text-[#0D3522] w-4 h-4"
              />
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-[#241611] flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-[#C5A059]" />
                  <span>UPI (Instant & Zero Surcharge)</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-[#0D3522] bg-[#EBF7EE] px-2 py-0.5 rounded-xs">
                  Recommended
                </span>
              </div>
            </label>

            {paymentMethod === 'upi' && (
              <div className="mt-4 pl-7 space-y-3 pt-3 border-t border-[#E7DED4]">
                <p className="text-xs text-[#6B5B52]">Choose your preferred UPI application:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'gpay', label: 'Google Pay' },
                    { key: 'phonepe', label: 'PhonePe' },
                    { key: 'paytm', label: 'Paytm' },
                    { key: 'custom', label: 'Other UPI' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setUpiProvider(p.key as any)}
                      className={`p-2.5 border text-xs font-semibold rounded-xs transition-colors text-center ${
                        upiProvider === p.key
                          ? 'border-[#0D3522] bg-[#FAF7F2] text-[#0D3522] font-bold'
                          : 'border-[#E7DED4] text-[#6B5B52] hover:border-[#241611]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {upiProvider === 'custom' && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okaxis / username@okhdfcbank"
                      className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 text-xs focus:outline-none focus:border-[#0D3522]"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Method 2: Credit / Debit Card */}
          <div className="p-5">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="text-[#0D3522] w-4 h-4"
              />
              <span className="text-sm font-bold text-[#241611] flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#C5A059]" />
                <span>Credit / Debit Card (Visa, MasterCard, RuPay)</span>
              </span>
            </label>

            {paymentMethod === 'card' && (
              <div className="mt-4 pl-7 space-y-3 pt-3 border-t border-[#E7DED4] text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#241611]">Card Number</label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#241611]">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#241611]">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Method 3: Net Banking */}
          <div className="p-5">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'netbanking'}
                onChange={() => setPaymentMethod('netbanking')}
                className="text-[#0D3522] w-4 h-4"
              />
              <span className="text-sm font-bold text-[#241611] flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#C5A059]" />
                <span>Net Banking (SBI, HDFC, ICICI, Axis & All Major Banks)</span>
              </span>
            </label>

            {paymentMethod === 'netbanking' && (
              <div className="mt-4 pl-7 pt-3 border-t border-[#E7DED4] text-xs">
                <select className="w-full bg-[#FAF7F2] border border-[#E7DED4] p-2.5 focus:border-[#0D3522] focus:outline-none">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>Other Indian Scheduled Bank</option>
                </select>
              </div>
            )}
          </div>

          {/* Method 4: Wallets */}
          <div className="p-5">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
                className="text-[#0D3522] w-4 h-4"
              />
              <span className="text-sm font-bold text-[#241611] flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-[#C5A059]" />
                <span>Wallets (Amazon Pay, Paytm Wallet, Mobikwik)</span>
              </span>
            </label>
          </div>

          {/* Method 5: Cash on Delivery */}
          <div className="p-5">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="text-[#0D3522] w-4 h-4"
              />
              <div>
                <span className="text-sm font-bold text-[#241611] flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>Cash on Delivery (COD)</span>
                </span>
                <span className="text-[11px] text-[#6B5B52] block ml-6">
                  Pay with cash or UPI QR at your doorstep on delivery.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Amount & Pay CTA */}
        <div className="md:col-span-4 bg-white border border-[#E7DED4] p-6 space-y-6 shadow-xs">
          <h2 className="text-sm font-serif font-bold text-[#241611] pb-3 border-b border-[#E7DED4] uppercase tracking-wider">
            Payment Summary
          </h2>

          <div className="space-y-2 text-xs text-[#6B5B52]">
            <div className="flex justify-between">
              <span>Payable Amount</span>
              <span className="text-base font-serif font-bold text-[#0D3522]">
                ₹{checkoutData.finalTotal}
              </span>
            </div>
            <p className="text-[11px] text-[#8C7A70]">
              Inclusive of GST & Pan-India Food-Grade Delivery
            </p>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full py-4 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>PROCESSING SECURE PAYMENT...</span>
              </>
            ) : (
              <span>PAY ₹{checkoutData.finalTotal}</span>
            )}
          </button>

          <div className="pt-2 text-center text-[10px] text-[#8C7A70] space-y-1">
            <div className="flex items-center justify-center space-x-1 text-[#0D3522]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-semibold">Zero credentials stored on server</span>
            </div>
            <p>Seamlessly routed to certified RBI & NPCI compliant payment aggregators.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
