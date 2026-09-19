import { Coupon } from '@/types';

export const availableCoupons: Coupon[] = [
  {
    code: 'WELCOME10',
    discountPercent: 10,
    minOrderValue: 499,
    description: '10% OFF on your first purchase above ₹499',
    expiryDate: '31 Dec 2026',
  },
  {
    code: 'FIRSTORDER',
    discountAmount: 100,
    minOrderValue: 799,
    description: 'Flat ₹100 OFF on orders above ₹799',
    expiryDate: '31 Dec 2026',
  },
  {
    code: 'TRADITION10',
    discountPercent: 10,
    minOrderValue: 399,
    description: '10% celebration discount on traditional grains',
    expiryDate: '31 Dec 2026',
  },
  {
    code: 'FREESHIP',
    discountAmount: 49,
    minOrderValue: 299,
    description: 'Free Shipping voucher for regional farm clusters',
    expiryDate: '31 Dec 2026',
  },
];
