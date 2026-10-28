/**
 * Site Configuration & Commerce Constants
 * Single source of truth for site URL, free shipping thresholds, and brand constants.
 */

export const SHIPPING_FREE_THRESHOLD = 500;
export const SHIPPING_FLAT_RATE = 49;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'https://dharvikagrains.in';

export const siteConfig = {
  name: 'DHARVIKA GRAINS',
  shortName: 'Dharvika',
  tagline: "The Goodness of India's Harvest.",
  subTagline: 'Authentic Chiru Dhanyalu (Millets) and Pure Cold-Ground Spices direct from dryland farm clusters.',
  url: SITE_URL,
  ogImage: `${SITE_URL}/images/brand/dharvika-lockup.jpg`,
  supportEmail: 'care@dharvikagrains.in',
  supportPhone: '+91 94942 81818',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919494281818',
  fssaiNumber: '13626011000284',
  shipping: {
    freeThreshold: SHIPPING_FREE_THRESHOLD,
    flatRate: SHIPPING_FLAT_RATE,
    currencySymbol: '₹',
  },
};
