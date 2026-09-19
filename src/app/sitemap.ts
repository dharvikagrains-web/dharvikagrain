import { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { journalArticles } from '@/data/journal';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dharvikagrains.in';

  const staticPages = [
    '',
    '/shop',
    '/millets',
    '/spices',
    '/about',
    '/sourcing',
    '/quality',
    '/recipes',
    '/journal',
    '/contact',
    '/faq',
    '/cart',
    '/privacy-policy',
    '/terms',
    '/shipping-policy',
    '/refund-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productPages = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const recipePages = recipes.map((r) => ({
    url: `${baseUrl}/recipes/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const articlePages = journalArticles.map((a) => ({
    url: `${baseUrl}/journal/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...recipePages, ...articlePages];
}
