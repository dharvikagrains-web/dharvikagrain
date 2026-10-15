import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/order-success', '/account', '/admin', '/api'],
    },
    sitemap: 'https://dharvikagrains.in/sitemap.xml',
  };
}
