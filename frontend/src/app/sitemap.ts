import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogtutien.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: { slug: string; category_slug: string; updated_at: string }[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];
  try {
    [articles, categories] = await Promise.all([
      api.sitemapArticles(),
      api.categories(),
    ]);
  } catch {
    // API unavailable at build or runtime
  }

  const entries: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/truyen-tu-tien`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  categories.forEach((c) => {
    entries.push({
      url: `${BASE}/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  });

  articles.forEach((a) => {
    entries.push({
      url: `${BASE}/${a.category_slug}/${a.slug}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  return entries;
}
