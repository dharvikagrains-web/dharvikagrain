import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/order-success', '/account', '/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

