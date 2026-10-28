import type { Metadata } from 'next';
import { brandConfig } from '@/data/brandConfig';

export const metadata: Metadata = {
  title: 'Shopping Basket',
  description: `Review your basket of unpolished Chiru Dhanyalu and pure spices at ${brandConfig.brandName}.`,
  alternates: {
    canonical: '/cart',
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
