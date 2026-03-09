import Link from 'next/link';
import { api } from '@/lib/api';

export const metadata = {
  title: 'Truyện tu tiên',
  description: 'Danh sách truyện tu tiên, tiên hiệp, huyền huyễn. Tóm tắt và bài viết liên quan.',
};

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function TruyenTuTienPage() {
  let novels: Awaited<ReturnType<typeof api.novels>> = [];
  try {
    novels = await api.novels();
  } catch {
    // Backend chưa chạy
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">Truyện tu tiên</h1>
      <p className="text-ink-600 mb-8">
        Danh sách các bộ truyện tu tiên, tiên hiệp được giới thiệu trên blog. Chọn truyện để xem tóm tắt, nhân vật và cảnh giới.
      </p>
      {novels.length === 0 ? (
        <p className="text-ink-500">Chưa có truyện. Thêm dữ liệu từ API hoặc seed.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {novels.map((n) => (
            <Link
              key={n.id}
              href={`/tom-tat-truyen/${n.slug}`}
              className="group rounded-xl border border-ink-200 bg-white overflow-hidden hover:shadow-lg hover:border-primary-200 transition"
            >
              {n.cover_image ? (
                <img
                  src={n.cover_image}
                  alt=""
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-ink-100 flex items-center justify-center text-ink-400">
                  Truyện
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-ink-900 group-hover:text-primary-600 line-clamp-2">
                  {n.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
