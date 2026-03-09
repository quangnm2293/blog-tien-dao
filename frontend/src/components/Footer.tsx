import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Tóm tắt truyện', href: '/tom-tat-truyen' },
  { label: 'Nhân vật', href: '/nhan-vat' },
  { label: 'Top nhân vật mạnh nhất', href: '/top-nhan-vat-manh-nhat' },
  { label: 'Hệ thống cảnh giới', href: '/he-thong-canh-gioi' },
  { label: 'Giải thích cốt truyện', href: '/giai-thich-cot-truyen' },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="font-serif font-bold text-white text-lg">
              Blog Tu Tiên
            </Link>
            <p className="mt-2 text-sm">
              Trang tin về truyện tu tiên, tiên hiệp, huyền huyễn. Tóm tắt truyện, nhân vật, cảnh giới tu luyện.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Chuyên mục</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ad-slot bg-ink-800 border-ink-700 min-h-[100px] text-ink-500" data-ad-position="footer">
              Quảng cáo (Footer)
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-ink-700 text-center text-sm text-ink-500">
          © {new Date().getFullYear()} Blog Tu Tiên. Nội dung chỉ mang tính giải trí.
        </div>
      </div>
    </footer>
  );
}
