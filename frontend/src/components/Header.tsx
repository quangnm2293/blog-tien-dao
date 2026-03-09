'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Truyện tu tiên', href: '/truyen-tu-tien' },
  { label: 'Tóm tắt truyện', href: '/tom-tat-truyen' },
  { label: 'Nhân vật', href: '/nhan-vat' },
  { label: 'Top nhân vật mạnh nhất', href: '/top-nhan-vat-manh-nhat' },
  { label: 'Hệ thống cảnh giới', href: '/he-thong-canh-gioi' },
  { label: 'Giải thích cốt truyện', href: '/giai-thich-cot-truyen' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-ink-200 dark:bg-ink-950/95 dark:border-ink-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16 gap-3">
          <Link href="/" className="font-serif font-bold text-lg text-ink-900 hover:text-primary-600 dark:text-ink-50">
            Blog Tu Tiên
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium ${
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          <button
            type="button"
            className="md:hidden p-2 text-ink-600 dark:text-ink-200"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>
        {open && (
          <nav className="md:hidden py-4 border-t border-ink-200 flex flex-col gap-2">
            <div className="pb-3">
              <ThemeToggle />
            </div>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-ink-700 hover:text-primary-600 dark:text-ink-200 dark:hover:text-primary-300"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
      {/* Ad slot: Top Banner */}
      <div className="ad-slot min-h-[90px] mx-4 mb-2 max-w-6xl mx-auto" data-ad-position="top_banner">
        Quảng cáo (Top Banner)
      </div>
    </header>
  );
}
