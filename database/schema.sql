-- Blog Tu Tiên - Supabase PostgreSQL Schema
-- Vietnamese SEO blog for cultivation novels

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories (SEO optimized slugs)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Tóm tắt truyện', 'tom-tat-truyen', 'Tóm tắt các truyện tu tiên, tiên hiệp từ đầu đến cuối', 1),
  ('Nhân vật', 'nhan-vat', 'Hồ sơ nhân vật trong truyện tu tiên', 2),
  ('Top nhân vật mạnh nhất', 'top-nhan-vat-manh-nhat', 'Xếp hạng nhân vật mạnh nhất trong từng bộ truyện', 3),
  ('Hệ thống cảnh giới', 'he-thong-canh-gioi', 'Các cảnh giới tu luyện trong truyện', 4),
  ('Giải thích cốt truyện', 'giai-thich-cot-truyen', 'Giải thích cốt truyện, ending và các arc', 5);

-- Novels
CREATE TABLE novels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  cover_image VARCHAR(500),
  author_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_novels_slug ON novels(slug);
CREATE INDEX idx_novels_created_at ON novels(created_at DESC);

-- Characters
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  novel_id UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  power_rank INT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(novel_id, slug)
);

CREATE INDEX idx_characters_novel_id ON characters(novel_id);
CREATE INDEX idx_characters_slug ON characters(slug);
CREATE INDEX idx_characters_power_rank ON characters(novel_id, power_rank);

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category_id UUID NOT NULL REFERENCES categories(id),
  novel_id UUID REFERENCES novels(id) ON DELETE SET NULL,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  featured_image VARCHAR(500),
  view_count INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_articles_slug_category ON articles(slug, category_id);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_novel_id ON articles(novel_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC) WHERE published = true;
CREATE INDEX idx_articles_view_count ON articles(view_count DESC) WHERE published = true;

-- Article internal links (for related articles)
CREATE TABLE article_related (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  related_article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  PRIMARY KEY (article_id, related_article_id),
  CHECK (article_id != related_article_id)
);

-- Ad slots configuration (for future AdSense)
CREATE TABLE ad_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slot_id VARCHAR(100),
  position VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ad_slots (name, position) VALUES
  ('Top Banner', 'top_banner'),
  ('Inside Article - After First Paragraph', 'article_after_first_paragraph'),
  ('Middle of Article', 'article_middle'),
  ('Sidebar', 'sidebar'),
  ('Footer', 'footer');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER novels_updated_at BEFORE UPDATE ON novels
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- RLS (Row Level Security) - enable if needed
-- ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
