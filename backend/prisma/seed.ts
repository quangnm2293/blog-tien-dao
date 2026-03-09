import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  if (categories.length > 0) {
    console.log('Categories already seeded, skip.');
    return;
  }

  await prisma.category.createMany({
    data: [
      { name: 'Tóm tắt truyện', slug: 'tom-tat-truyen', description: 'Tóm tắt các truyện tu tiên, tiên hiệp từ đầu đến cuối', sortOrder: 1 },
      { name: 'Nhân vật', slug: 'nhan-vat', description: 'Hồ sơ nhân vật trong truyện tu tiên', sortOrder: 2 },
      { name: 'Top nhân vật mạnh nhất', slug: 'top-nhan-vat-manh-nhat', description: 'Xếp hạng nhân vật mạnh nhất trong từng bộ truyện', sortOrder: 3 },
      { name: 'Hệ thống cảnh giới', slug: 'he-thong-canh-gioi', description: 'Các cảnh giới tu luyện trong truyện', sortOrder: 4 },
      { name: 'Giải thích cốt truyện', slug: 'giai-thich-cot-truyen', description: 'Giải thích cốt truyện, ending và các arc', sortOrder: 5 },
    ],
  });

  const catIds = await prisma.category.findMany({ select: { id: true, slug: true } });
  const catMap = Object.fromEntries(catIds.map((c) => [c.slug, c.id]));

  const novelTienNghich = await prisma.novel.upsert({
    where: { slug: 'tien-nghich' },
    create: { title: 'Tiên Nghịch', slug: 'tien-nghich', description: 'Truyện tiên hiệp nổi tiếng của Nhĩ Căn.', authorName: 'Nhĩ Căn' },
    update: {},
  });
  const novelDauPha = await prisma.novel.upsert({
    where: { slug: 'dau-pha-thuong-khung' },
    create: { title: 'Đấu Phá Thương Khung', slug: 'dau-pha-thuong-khung', description: 'Tiêu Viêm từ phế vật vươn lên đỉnh cao.', authorName: 'Thiên Tàm Thổ Đậu' },
    update: {},
  });
  const novelPhamNhan = await prisma.novel.upsert({
    where: { slug: 'pham-nhan-tu-tien' },
    create: { title: 'Phàm Nhân Tu Tiên', slug: 'pham-nhan-tu-tien', description: 'Hàn Lập tu tiên từ phàm nhân.', authorName: 'Vong Ngữ' },
    update: {},
  });
  await prisma.novel.upsert({
    where: { slug: 'van-co-than-de' },
    create: { title: 'Vạn Cổ Thần Đế', slug: 'van-co-than-de', description: 'Truyện huyền huyễn đại thế.' },
    update: {},
  });

  await prisma.character.createMany({
    data: [
      { novelId: novelTienNghich.id, name: 'Vương Lâm', slug: 'vuong-lam', description: 'Nhân vật chính, nghịch tu.', powerRank: 1 },
      { novelId: novelTienNghich.id, name: 'Lý Mộ Uyển', slug: 'ly-mo-uyen', description: 'Nữ chính.', powerRank: 2 },
      { novelId: novelDauPha.id, name: 'Tiêu Viêm', slug: 'tieu-viem', description: 'Nhân vật chính.', powerRank: 1 },
      { novelId: novelDauPha.id, name: 'Vân Vận', slug: 'van-van', description: 'Sư phụ.', powerRank: 2 },
    ],
    skipDuplicates: true,
  });

  await prisma.article.createMany({
    data: [
      {
        title: 'Tóm tắt truyện Tiên Nghịch từ đầu đến cuối',
        slug: 'tien-nghich',
        content: '<p>Tiên Nghịch là bộ truyện tiên hiệp nổi tiếng của tác giả Nhĩ Căn. Câu chuyện xoay quanh Vương Lâm – một thiếu niên nghịch thiên tu đạo.</p><h2>Mở đầu</h2><p>Vương Lâm từ một tiểu tu sĩ dần trưởng thành qua vô số kiếp nạn.</p><h2>Kết thúc</h2><p>Kết cục mở, để lại nhiều suy ngẫm.</p>',
        excerpt: 'Tóm tắt toàn bộ cốt truyện Tiên Nghịch từ chương đầu đến kết thúc.',
        categoryId: catMap['tom-tat-truyen'],
        novelId: novelTienNghich.id,
        metaTitle: 'Tóm tắt truyện Tiên Nghịch từ đầu đến cuối',
        metaDescription: 'Tóm tắt toàn bộ cốt truyện Tiên Nghịch từ chương đầu đến kết thúc. Vương Lâm và hành trình nghịch thiên.',
        published: true,
      },
      {
        title: 'Top 10 nhân vật mạnh nhất trong Đấu Phá Thương Khung',
        slug: 'dau-pha-thuong-khung',
        content: '<p>Đấu Phá Thương Khung có nhiều cao thủ. Dưới đây là top 10 nhân vật mạnh nhất.</p><h2>Tiêu Viêm</h2><p>Nhân vật chính, từ Đấu Giả vươn lên Đế.</p><h2>Các nhân vật khác</h2><p>Vân Vận, Nga Nhi, v.v.</p>',
        excerpt: 'Xếp hạng top 10 nhân vật mạnh nhất trong Đấu Phá Thương Khung.',
        categoryId: catMap['top-nhan-vat-manh-nhat'],
        novelId: novelDauPha.id,
        metaTitle: 'Top 10 nhân vật mạnh nhất trong Đấu Phá Thương Khung',
        metaDescription: 'Xếp hạng top 10 nhân vật mạnh nhất trong Đấu Phá Thương Khung. Tiêu Viêm, Vân Vận và các cao thủ.',
        published: true,
      },
      {
        title: 'Các cảnh giới tu luyện trong Phàm Nhân Tu Tiên',
        slug: 'pham-nhan-tu-tien',
        content: '<p>Phàm Nhân Tu Tiên có hệ thống cảnh giới rõ ràng từ Luyện Khí đến Đại Thừa.</p><h2>Luyện Khí</h2><p>Giai đoạn mở đầu.</p><h2>Trúc Cơ, Kết Đan</h2><p>Các bước tiến quan trọng.</p>',
        excerpt: 'Giới thiệu hệ thống cảnh giới tu luyện trong Phàm Nhân Tu Tiên.',
        categoryId: catMap['he-thong-canh-gioi'],
        novelId: novelPhamNhan.id,
        metaTitle: 'Các cảnh giới tu luyện trong Phàm Nhân Tu Tiên',
        metaDescription: 'Hệ thống cảnh giới tu luyện trong Phàm Nhân Tu Tiên: Luyện Khí, Trúc Cơ, Kết Đan và cao hơn.',
        published: true,
      },
    ],
  });

  const adCount = await prisma.adSlot.count();
  if (adCount === 0) {
    await prisma.adSlot.createMany({
      data: [
        { name: 'Top Banner', position: 'top_banner' },
        { name: 'Inside Article - After First Paragraph', position: 'article_after_first_paragraph' },
        { name: 'Middle of Article', position: 'article_middle' },
        { name: 'Sidebar', position: 'sidebar' },
        { name: 'Footer', position: 'footer' },
      ],
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
