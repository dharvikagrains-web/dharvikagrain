import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { brandConfig } from '@/data/brandConfig';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${brandConfig.brandName} | Authentic Chiru Dhanyalu (Millets) & Pure Spices`,
    template: `%s | ${brandConfig.brandName}`,
  },
  description: brandConfig.tagline,
  keywords: [
    'Chiru Dhanyalu',
    'Millets India',
    'Korralu Foxtail Millet',
    'Samalu Little Millet',
    'Arikelu Kodo Millet',
    'Udalu Barnyard Millet',
    'Ragi Finger Millet',
    'Jowar Sorghum',
    'Pure Turmeric Powder',
    'Guntur Red Chilli',
    'Single Origin Indian Spices',
  ],
  authors: [{ name: brandConfig.brandName }],
  openGraph: {
    title: `${brandConfig.brandName} | Authentic Chiru Dhanyalu & Pure Spices`,
    description: brandConfig.subTagline,
    url: 'https://dharvikagrains.in',
    siteName: brandConfig.brandName,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FAF7F2] text-[#241611] selection:bg-[#B35638] selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
