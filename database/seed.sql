-- Seed data for development / demo
-- Run after schema.sql

-- Novels
INSERT INTO novels (title, slug, description, author_name) VALUES
  ('Tiên Nghịch', 'tien-nghich', 'Truyện tiên hiệp nổi tiếng của Nhĩ Căn.', 'Nhĩ Căn'),
  ('Đấu Phá Thương Khung', 'dau-pha-thuong-khung', 'Tiêu Viêm từ phế vật vươn lên đỉnh cao.', 'Thiên Tàm Thổ Đậu'),
  ('Phàm Nhân Tu Tiên', 'pham-nhan-tu-tien', 'Hàn Lập tu tiên từ phàm nhân.', 'Vong Ngữ'),
  ('Vạn Cổ Thần Đế', 'van-co-than-de', 'Truyện huyền huyễn đại thế.', NULL);

-- Characters (Tiên Nghịch)
DO $$
DECLARE nid UUID;
BEGIN
  SELECT id INTO nid FROM novels WHERE slug = 'tien-nghich';
  INSERT INTO characters (novel_id, name, slug, description, power_rank) VALUES
    (nid, 'Vương Lâm', 'vuong-lam', 'Nhân vật chính, nghịch tu.', 1),
    (nid, 'Lý Mộ Uyển', 'ly-mo-uyen', 'Nữ chính.', 2);
END $$;

-- Characters (Đấu Phá Thương Khung)
DO $$
DECLARE nid UUID;
BEGIN
  SELECT id INTO nid FROM novels WHERE slug = 'dau-pha-thuong-khung';
  INSERT INTO characters (novel_id, name, slug, description, power_rank) VALUES
    (nid, 'Tiêu Viêm', 'tieu-viem', 'Nhân vật chính.', 1),
    (nid, 'Vân Vận', 'van-van', 'Sư phụ.', 2);
END $$;

-- Sample articles (get category ids and novel ids)
DO $$
DECLARE
  cat_tt UUID;
  cat_top UUID;
  cat_ht UUID;
  nid_tn UUID;
  nid_dp UUID;
BEGIN
  SELECT id INTO cat_tt FROM categories WHERE slug = 'tom-tat-truyen';
  SELECT id INTO cat_top FROM categories WHERE slug = 'top-nhan-vat-manh-nhat';
  SELECT id INTO cat_ht FROM categories WHERE slug = 'he-thong-canh-gioi';
  SELECT id INTO nid_tn FROM novels WHERE slug = 'tien-nghich';
  SELECT id INTO nid_dp FROM novels WHERE slug = 'dau-pha-thuong-khung';

  INSERT INTO articles (title, slug, content, excerpt, category_id, novel_id, meta_title, meta_description, published) VALUES
    (
      'Tóm tắt truyện Tiên Nghịch từ đầu đến cuối',
      'tien-nghich',
      '<p>Tiên Nghịch là bộ truyện tiên hiệp nổi tiếng của tác giả Nhĩ Căn. Câu chuyện xoay quanh Vương Lâm – một thiếu niên nghịch thiên tu đạo.</p><h2>Mở đầu</h2><p>Vương Lâm từ một tiểu tu sĩ dần trưởng thành qua vô số kiếp nạn.</p><h2>Kết thúc</h2><p>Kết cục mở, để lại nhiều suy ngẫm.</p>',
      'Tóm tắt toàn bộ cốt truyện Tiên Nghịch từ chương đầu đến kết thúc.',
      cat_tt, nid_tn,
      'Tóm tắt truyện Tiên Nghịch từ đầu đến cuối',
      'Tóm tắt toàn bộ cốt truyện Tiên Nghịch từ chương đầu đến kết thúc. Vương Lâm và hành trình nghịch thiên.',
      true
    ),
    (
      'Top 10 nhân vật mạnh nhất trong Đấu Phá Thương Khung',
      'dau-pha-thuong-khung',
      '<p>Đấu Phá Thương Khung có nhiều cao thủ. Dưới đây là top 10 nhân vật mạnh nhất.</p><h2>Tiêu Viêm</h2><p>Nhân vật chính, từ Đấu Giả vươn lên Đế.</p><h2>Các nhân vật khác</h2><p>Vân Vận, Nga Nhi, v.v.</p>',
      'Xếp hạng top 10 nhân vật mạnh nhất trong Đấu Phá Thương Khung.',
      cat_top, nid_dp,
      'Top 10 nhân vật mạnh nhất trong Đấu Phá Thương Khung',
      'Xếp hạng top 10 nhân vật mạnh nhất trong Đấu Phá Thương Khung. Tiêu Viêm, Vân Vận và các cao thủ.',
      true
    ),
    (
      'Các cảnh giới tu luyện trong Phàm Nhân Tu Tiên',
      'pham-nhan-tu-tien',
      '<p>Phàm Nhân Tu Tiên có hệ thống cảnh giới rõ ràng từ Luyện Khí đến Đại Thừa.</p><h2>Luyện Khí</h2><p>Giai đoạn mở đầu.</p><h2>Trúc Cơ, Kết Đan</h2><p>Các bước tiến quan trọng.</p>',
      'Giới thiệu hệ thống cảnh giới tu luyện trong Phàm Nhân Tu Tiên.',
      cat_ht, (SELECT id FROM novels WHERE slug = 'pham-nhan-tu-tien'),
      'Các cảnh giới tu luyện trong Phàm Nhân Tu Tiên',
      'Hệ thống cảnh giới tu luyện trong Phàm Nhân Tu Tiên: Luyện Khí, Trúc Cơ, Kết Đan và cao hơn.',
      true
    );
END $$;
