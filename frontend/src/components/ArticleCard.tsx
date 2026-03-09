import Link from 'next/link';
import type { ArticleListItem } from '@/lib/api';

interface ArticleCardProps {
  article: ArticleListItem;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const categorySlug = article.categories?.slug ?? 'tom-tat-truyen';
  const href = `/${categorySlug}/${article.slug}`;

  return (
    <article className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white border border-ink-200 hover:border-primary-200 hover:shadow-md transition dark:bg-ink-900 dark:border-ink-700 dark:hover:border-primary-500">
      {article.featured_image && (
        <Link href={href} className="block sm:w-40 shrink-0 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800">
          <img
            src={article.featured_image}
            alt=""
            className="w-full h-32 object-cover group-hover:scale-105 transition"
            loading="lazy"
          />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-2 text-xs text-ink-500 mb-1 dark:text-ink-400">
          {article.categories && (
            <Link href={`/${article.categories.slug}`} className="hover:text-primary-600 dark:hover:text-primary-300">
              {article.categories.name}
            </Link>
          )}
          {article.novels && (
            <>
              <span>·</span>
              <span>{article.novels.title}</span>
            </>
          )}
        </div>
        <Link href={href} className="block">
          <h3 className="font-serif font-semibold text-ink-900 group-hover:text-primary-600 line-clamp-2 dark:text-ink-50 dark:group-hover:text-primary-300">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="mt-1 text-sm text-ink-600 line-clamp-2 dark:text-ink-300">{article.excerpt}</p>
        )}
        <p className="mt-2 text-xs text-ink-400 dark:text-ink-500">{formatDate(article.published_at)}</p>
      </div>
    </article>
  );
}
