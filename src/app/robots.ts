import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/order-success', '/account'],
    },
    sitemap: 'https://dharvikagrains.in/sitemap.xml',
  };
}
