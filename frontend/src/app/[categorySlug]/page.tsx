import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

const VALID_CATEGORIES = [
  'tom-tat-truyen',
  'nhan-vat',
  'top-nhan-vat-manh-nhat',
  'he-thong-canh-gioi',
  'giai-thich-cot-truyen',
];

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug } = await params;
  if (!VALID_CATEGORIES.includes(categorySlug)) return {};
  const cat = await api.categoryBySlug(categorySlug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description || `Bài viết chuyên mục ${cat.name}. Tóm tắt truyện, nhân vật, cảnh giới tu luyện.`,
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  if (!VALID_CATEGORIES.includes(categorySlug)) notFound();

  let category: Awaited<ReturnType<typeof api.categoryBySlug>> = null;
  let result: Awaited<ReturnType<typeof api.articlesByCategory>> = { data: [], total: 0 };
  try {
    [category, result] = await Promise.all([
      api.categoryBySlug(categorySlug),
      api.articlesByCategory(categorySlug, 50, 0),
    ]);
  } catch {
    // Backend chưa chạy
  }

  if (!category) notFound();

  const { data: articles, total } = result;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-ink-600 mb-8">{category.description}</p>
      )}
      {articles.length === 0 ? (
        <p className="text-ink-500 py-8">Chưa có bài viết trong chuyên mục này.</p>
      ) : (
        <>
          <p className="text-sm text-ink-500 mb-6">{total} bài viết</p>
          <div className="space-y-4">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
