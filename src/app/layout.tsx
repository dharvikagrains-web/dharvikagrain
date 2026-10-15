import type { Metadata } from 'next';
import Script from 'next/script';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://dharvikagrains.in'),
  title: {
    default: `${brandConfig.brandName} | Authentic Chiru Dhanyalu (Millets) & Pure Spices`,
    template: `%s | ${brandConfig.brandName}`,
  },
  description: `${brandConfig.tagline} — ${brandConfig.subTagline}`,
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
  authors: [{ name: brandConfig.brandName, url: 'https://dharvikagrains.in' }],
  creator: brandConfig.brandName,
  publisher: brandConfig.brandName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: `${brandConfig.brandName} | Authentic Chiru Dhanyalu (Millets) & Pure Spices`,
    description: `${brandConfig.tagline} ${brandConfig.subTagline}`,
    url: 'https://dharvikagrains.in',
    siteName: brandConfig.brandName,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/brand/dharvika-lockup.jpg',
        width: 1200,
        height: 630,
        alt: `${brandConfig.brandName} - The Goodness of India's Harvest`,
      },
      {
        url: '/images/brand/dharvika-luxury-logo.jpg',
        width: 800,
        height: 800,
        alt: `${brandConfig.brandName} Emblem`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brandConfig.brandName} | Authentic Chiru Dhanyalu & Pure Spices`,
    description: brandConfig.subTagline,
    images: ['/images/brand/dharvika-lockup.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/brand/dharvika-icon-128.png', sizes: '128x128', type: 'image/png' },
    ],
    apple: [
      { url: '/images/brand/dharvika-icon-128.png', sizes: '128x128', type: 'image/png' },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${inter.variable} ${teluguSerif.variable} ${teluguSans.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FAF7F2] text-[#221814] selection:bg-[#9E462A] selection:text-white">
        {gaId && (
          <>
            <Script
              id="google-analytics-consent"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'wait_for_update': 500
                  });
                  try {
                    if (localStorage.getItem('dharvika_cookie_consent') === 'granted') {
                      gtag('consent', 'update', {
                        'analytics_storage': 'granted'
                      });
                    }
                  } catch (e) {}
                  window.addEventListener('dharvika_consent_granted', function() {
                    gtag('consent', 'update', {
                      'analytics_storage': 'granted'
                    });
                  });
                `,
              }}
            />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        )}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
