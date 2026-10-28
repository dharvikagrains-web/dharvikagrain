import type { Metadata } from 'next';
import { brandConfig } from '@/data/brandConfig';

export const metadata: Metadata = {
  title: 'Shop All Provisions | Unpolished Millets & Pure Spices',
  description: `Explore the complete harvest of unpolished Chiru Dhanyalu (millets), single-origin spices, and curated pantry kits from ${brandConfig.brandName}.`,
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: `Shop All Provisions | ${brandConfig.brandName}`,
    description: 'Direct from rain-fed Deccan farm clusters. 100% natural, fiber-rich millets and cold-ground spices.',
    url: '/shop',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
