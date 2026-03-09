import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-source-serif',
});

export const metadata: Metadata = {
  title: {
    default: 'Blog Tu Tiên | Tóm tắt truyện, Nhân vật, Cảnh giới tu luyện',
    template: '%s | Blog Tu Tiên',
  },
  description:
    'Trang tin về truyện tu tiên, tiên hiệp, huyền huyễn. Tóm tắt truyện, top nhân vật mạnh nhất, hệ thống cảnh giới tu luyện.',
  keywords: [
    'tu tiên',
    'tiên hiệp',
    'huyền huyễn',
    'tóm tắt truyện',
    'nhân vật',
    'cảnh giới tu luyện',
    'tiên nghịch',
    'đấu phá thương khung',
    'phàm nhân tu tiên',
  ],
  openGraph: {
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
