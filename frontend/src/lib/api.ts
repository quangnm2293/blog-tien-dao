const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: 60 },
      ...options,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch (e) {
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL) {
      console.warn(`fetchApi failed (API not running?): ${path}`, e);
    }
    throw e;
  }
}

export const api = {
  categories: () => fetchApi<{ id: string; name: string; slug: string; description: string | null }[]>('/categories'),
  categoryBySlug: (slug: string) =>
    fetchApi<{ id: string; name: string; slug: string; description: string | null } | null>(`/categories/${slug}`),
  novels: () => fetchApi<{ id: string; title: string; slug: string; cover_image: string | null }[]>('/novels'),
  trendingNovels: () =>
    fetchApi<{ id: string; title: string; slug: string; cover_image: string | null }[]>('/novels/trending'),
  latestArticles: (limit = 10) =>
    fetchApi<ArticleListItem[]>(`/articles/latest?limit=${limit}`),
  popularArticles: (limit = 10) =>
    fetchApi<ArticleListItem[]>(`/articles/popular?limit=${limit}`),
  articlesByCategory: (categorySlug: string, limit = 50, offset = 0) =>
    fetchApi<{ data: ArticleListItem[]; total: number }>(
      `/articles/category/${categorySlug}?limit=${limit}&offset=${offset}`,
    ),
  articleBySlug: (categorySlug: string, articleSlug: string) =>
    fetchApi<ArticleDetail | null>(`/articles/category/${categorySlug}/${articleSlug}`),
  sitemapArticles: () =>
    fetchApi<{ slug: string; category_slug: string; updated_at: string }[]>('/articles/sitemap'),
};

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  view_count?: number;
  published_at: string;
  categories?: { name: string; slug: string };
  novels?: { title: string; slug: string } | null;
}

export interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured_image: string | null;
  view_count: number;
  published_at: string;
  categories: { name: string; slug: string };
  novels: { id: string; title: string; slug: string; cover_image: string | null } | null;
  characters?: { id: string; name: string; slug: string } | null;
  related?: ArticleListItem[];
}
