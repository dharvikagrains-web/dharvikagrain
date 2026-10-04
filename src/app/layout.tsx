import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Inter, Noto_Serif_Telugu, Noto_Sans_Telugu } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { brandConfig } from '@/data/brandConfig';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dmsans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const teluguSerif = Noto_Serif_Telugu({
  subsets: ['telugu'],
  weight: ['500', '600'],
  variable: '--font-telugu-serif',
  display: 'swap',
});

const teluguSans = Noto_Sans_Telugu({
  subsets: ['telugu'],
  weight: ['400', '500', '600'],
  variable: '--font-telugu-sans',
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
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${inter.variable} ${teluguSerif.variable} ${teluguSans.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FAF7F2] text-[#221814] selection:bg-[#9E462A] selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
