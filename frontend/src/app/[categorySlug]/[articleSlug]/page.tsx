import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { addHeadingIds } from '@/lib/utils';
import AdSlot from '@/components/AdSlot';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';

const VALID_CATEGORIES = [
  'tom-tat-truyen',
  'nhan-vat',
  'top-nhan-vat-manh-nhat',
  'he-thong-canh-gioi',
  'giai-thich-cot-truyen',
];

interface PageProps {
  params: Promise<{ categorySlug: string; articleSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug, articleSlug } = await params;
  if (!VALID_CATEGORIES.includes(categorySlug)) return {};
  const article = await api.articleBySlug(categorySlug, articleSlug);
  if (!article) return {};
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || undefined,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || undefined,
      type: 'article',
      publishedTime: article.published_at,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blogtutien.vn'}/${categorySlug}/${articleSlug}`,
    },
  };
}

export const revalidate = 60;

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { categorySlug, articleSlug } = await params;
  if (!VALID_CATEGORIES.includes(categorySlug)) notFound();

  const article = await api.articleBySlug(categorySlug, articleSlug);
  if (!article) notFound();

  const contentWithIds = addHeadingIds(article.content);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogtutien.vn';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: { '@type': 'Organization', name: 'Blog Tu Tiên' },
    publisher: {
      '@type': 'Organization',
      name: 'Blog Tu Tiên',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/${categorySlug}/${articleSlug}` },
  };

  const firstP = contentWithIds.indexOf('</p>');
  const part1 = firstP > 0 ? contentWithIds.slice(0, firstP + 4) : '';
  const rest = firstP > 0 ? contentWithIds.slice(firstP + 4) : contentWithIds;
  const mid = Math.floor(rest.length / 2);
  const midIdx = rest.indexOf('</p>', mid);
  const part2 = midIdx > 0 ? rest.slice(0, midIdx + 4) : rest;
  const part3 = midIdx > 0 ? rest.slice(midIdx + 4) : '';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_240px] gap-8">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 text-sm text-ink-500 mb-4">
              <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
              <span>/</span>
              <Link href={`/${categorySlug}`} className="hover:text-primary-600">
                {article.categories.name}
              </Link>
              {article.novels && (
                <>
                  <span>/</span>
                  <Link href={`/tom-tat-truyen/${article.novels.slug}`} className="hover:text-primary-600">
                    {article.novels.title}
                  </Link>
                </>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              {article.title}
            </h1>
            <p className="text-ink-500 text-sm mb-6">
              {formatDate(article.published_at)}
              {article.view_count != null && (
                <span className="ml-4">· {article.view_count} lượt xem</span>
              )}
            </p>
            {article.featured_image && (
              <img
                src={article.featured_image}
                alt=""
                className="w-full rounded-xl mb-6 max-h-80 object-cover"
                loading="eager"
              />
            )}

            <div className="article-content">
              {part1 && <div dangerouslySetInnerHTML={{ __html: part1 }} />}
              <AdSlot position="article_after_first_paragraph" />
              {part2 && <div dangerouslySetInnerHTML={{ __html: part2 }} />}
              {part3 && (
                <>
                  <AdSlot position="article_middle" />
                  <div dangerouslySetInnerHTML={{ __html: part3 }} />
                </>
              )}
            </div>

            {/* Share */}
            <div className="mt-8 pt-6 border-t border-ink-200">
              <p className="text-sm font-medium text-ink-700 mb-2">Chia sẻ bài viết</p>
              <ShareButtons url={`${baseUrl}/${categorySlug}/${articleSlug}`} title={article.title} />
            </div>

            {/* Related */}
            {article.related && article.related.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-4">Bài viết liên quan</h2>
                <ul className="space-y-3">
                  {article.related.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/${r.categories?.slug ?? categorySlug}/${r.slug}`}
                        className="text-ink-700 hover:text-primary-600 hover:underline"
                      >
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            <TableOfContents content={contentWithIds} />
            <AdSlot position="sidebar" className="min-h-[250px]" />
          </aside>
        </div>
      </article>
    </>
  );
}

