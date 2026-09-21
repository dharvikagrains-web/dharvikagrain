'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
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
  AlertCircle,
} from 'lucide-react';

export default function PaymentGatewayPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'>('upi');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [checkoutData, setCheckoutData] = useState<{
    customerId?: string;
    mobile: string;
    email: string;
    customerName?: string;
    address: any;
    discountAmount: number;
    appliedCoupon: string | null;
    finalTotal: number;
  }>({
    mobile: '',
    email: '',
    customerName: '',
    address: null,
    discountAmount: 0,
    appliedCoupon: null,
    finalTotal: 0,
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.authenticated || !data.user) {
          router.push('/signin?redirect=/checkout');
          return;
        }
        setCurrentUser(data.user);
      } catch {
        router.push('/signin?redirect=/checkout');
        return;
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();

    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('checkout_state');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCheckoutData({
            customerId: parsed.customerId,
            mobile: parsed.mobile || '',
            email: parsed.email || '',
            customerName: parsed.customerName || parsed.address?.fullName || '',
            address: parsed.address,
            discountAmount: parsed.discountAmount || 0,
            appliedCoupon: parsed.appliedCoupon || null,
            finalTotal: parsed.finalTotal || 0,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [router]);

  const handlePay = async () => {
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add products before checking out.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Create order on server (validates prices & reserves inventory in DB)
      const res = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: checkoutData.customerId || currentUser?.id,
          customerName: checkoutData.customerName || currentUser?.fullName || 'Customer',
          email: checkoutData.email || currentUser?.email,
          mobile: checkoutData.mobile || currentUser?.mobile,
          shippingAddress: checkoutData.address || {
            type: 'Home',
            fullName: checkoutData.customerName || currentUser?.fullName || 'Customer',
            mobile: checkoutData.mobile || currentUser?.mobile,
            pincode: '500081',
            houseFlat: 'Plot 42, Jubilee Hills',
            streetArea: 'Road No 36',
            city: 'Hyderabad',
            state: 'Telangana',
          },
          items: cart.map((it) => ({
            productId: it.productId,
            selectedWeight: it.selectedWeight,
            quantity: it.quantity,
          })),
          couponCode: checkoutData.appliedCoupon || undefined,
          paymentMethod: paymentMethod === 'cod' ? 'COD' : 'RAZORPAY',
        }),
      });

      if (res.status === 401) {
        setIsProcessing(false);
        router.push('/signin?redirect=/checkout');
        return;
      }

      const orderResult = await res.json();

      if (!res.ok || !orderResult.success) {
        setIsProcessing(false);
        setErrorMessage(orderResult.error || 'Unable to initialize order.');
        return;
      }

      // 2. If Cash on Delivery, order is confirmed immediately
      if (orderResult.isCod) {
        clearCart();
        router.push(`/order/success/${encodeURIComponent(orderResult.orderNumber)}`);
        return;
      }

      // 3. Razorpay Payment Gateway integration
      if (typeof window !== 'undefined' && (window as any).Razorpay && !orderResult.keyId.includes('placeholder')) {
        const options = {
          key: orderResult.keyId,
          amount: orderResult.amount,
          currency: orderResult.currency,
          name: 'DHARVIKA GRAINS',
          description: 'Authentic Chiru Dhanyalu & Pure Spices',
          order_id: orderResult.razorpayOrderId,
          prefill: {
            name: orderResult.customerName,
            email: orderResult.customerEmail,
            contact: orderResult.customerMobile,
          },
          theme: {
            color: '#0D3522',
          },
          handler: async function (response: any) {
            // Verify payment signature server-side
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderNumber: orderResult.orderNumber,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                method: paymentMethod.toUpperCase(),
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/order/success/${encodeURIComponent(orderResult.orderNumber)}`);
            } else {
              setIsProcessing(false);
              setErrorMessage('Payment verification failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Developer & Sandbox environment verification (when live gateway keys are not provided)
        const simRes = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: orderResult.orderNumber,
            razorpay_order_id: orderResult.razorpayOrderId,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: `sim_sig_${Date.now()}`,
            method: paymentMethod.toUpperCase(),
          }),
        });

        const simData = await simRes.json();
        if (simRes.ok && simData.success) {
          clearCart();
          router.push(`/order/success/${encodeURIComponent(orderResult.orderNumber)}`);
        } else {
          setIsProcessing(false);
          setErrorMessage(simData.error || 'Payment execution could not be verified.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMessage('Communication error processing payment. Please try again.');
    }
  };

  const currentTotal = checkoutData.finalTotal > 0 ? checkoutData.finalTotal : cart.reduce((t, it) => t + it.price * it.quantity, 0);

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-[#FAF7F2]">
        <div className="w-10 h-10 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#6B5B52] font-serif tracking-wide">
          Verifying Customer Identity & Payment Security...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

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
          <span>PCI-DSS 256-bit Encrypted Indian Gateway</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#FAF0ED] border border-[#B35638]/40 text-[#B35638] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

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
                  <span>UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-[#0D3522] bg-[#EBF7EE] px-2 py-0.5 rounded-xs">
                  Zero Surcharge
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
                      placeholder="e.g. mobile@upi or username@okaxis"
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
                <span>Net Banking (SBI, HDFC, ICICI, Axis & 50+ Banks)</span>
              </span>
            </label>
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
                  Pay with cash or UPI QR code at your doorstep upon delivery.
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
              <span className="text-lg font-serif font-bold text-[#0D3522]">
                ₹{currentTotal}
              </span>
            </div>
            {checkoutData.discountAmount > 0 && (
              <div className="flex justify-between text-[#0D3522] font-medium">
                <span>Coupon Applied</span>
                <span>-₹{checkoutData.discountAmount}</span>
              </div>
            )}
            <p className="text-[11px] text-[#8C7A70] pt-1">
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
              <span>
                {paymentMethod === 'cod'
                  ? 'CONFIRM CASH ON DELIVERY'
                  : `PAY ₹${currentTotal} VIA ${paymentMethod.toUpperCase()}`}
              </span>
            )}
          </button>

          <div className="pt-2 text-center text-[10px] text-[#8C7A70] space-y-1">
            <div className="flex items-center justify-center space-x-1 text-[#0D3522]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-semibold">Razorpay Verified Indian Gateway</span>
            </div>
            <p>Seamlessly routed to certified RBI & NPCI compliant payment aggregators.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
