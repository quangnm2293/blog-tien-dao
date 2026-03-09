import Link from 'next/link';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let categories: { id: string; name: string; slug: string }[] = [];
  let latest: Awaited<ReturnType<typeof api.latestArticles>> = [];
  let popular: Awaited<ReturnType<typeof api.popularArticles>> = [];
  let trending: Awaited<ReturnType<typeof api.trendingNovels>> = [];
  try {
    [categories, latest, popular, trending] = await Promise.all([
      api.categories(),
      api.latestArticles(8),
      api.popularArticles(6),
      api.trendingNovels(),
    ]);
  } catch {
    // Backend chưa chạy hoặc lỗi – vẫn hiển thị trang với nội dung rỗng
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 md:p-12 mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
          Blog Tu Tiên – Tóm tắt truyện, Nhân vật & Cảnh giới
        </h1>
        <p className="text-primary-100 text-lg max-w-2xl mb-6">
          Khám phá tóm tắt truyện tu tiên, top nhân vật mạnh nhất, hệ thống cảnh giới tu luyện và giải thích cốt truyện các bộ tiên hiệp, huyền huyễn nổi tiếng.
        </p>
        <div className="flex flex-wrap gap-3">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="font-serif text-xl font-bold text-ink-900 mb-4">Chuyên mục</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="p-4 rounded-xl bg-white border border-ink-200 hover:border-primary-300 hover:shadow-md transition text-center"
            >
              <span className="font-medium text-ink-800">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Latest articles */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-ink-900">Bài viết mới nhất</h2>
              <Link href="/tom-tat-truyen" className="text-sm text-primary-600 hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-4">
              {latest.length === 0 ? (
                <p className="text-ink-500 py-8">Chưa có bài viết. Hãy thêm nội dung từ API hoặc seed data.</p>
              ) : (
                latest.map((a) => <ArticleCard key={a.id} article={a} />)
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          {/* Popular */}
          <section>
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4">Đọc nhiều</h2>
            <ul className="space-y-3">
              {popular.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/${a.categories?.slug ?? 'tom-tat-truyen'}/${a.slug}`}
                    className="text-ink-700 hover:text-primary-600 line-clamp-2 text-sm"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Trending novels */}
          <section>
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4">Truyện nổi bật</h2>
            <ul className="space-y-3">
              {trending.map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/tom-tat-truyen/${n.slug}`}
                    className="flex items-center gap-3 text-ink-700 hover:text-primary-600"
                  >
                    {n.cover_image && (
                      <img
                        src={n.cover_image}
                        alt=""
                        className="w-10 h-14 rounded object-cover shrink-0"
                        loading="lazy"
                      />
                    )}
                    <span className="text-sm line-clamp-2">{n.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Sidebar ad */}
          <div className="ad-slot min-h-[250px]" data-ad-position="sidebar">
            Quảng cáo (Sidebar)
          </div>
        </aside>
      </div>
    </div>
  );
}
