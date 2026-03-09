import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category_id: string;
  novel_id: string | null;
  character_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured_image: string | null;
  view_count: number;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  categories?: { name: string; slug: string };
  novels?: { id?: string; title: string; slug: string; cover_image?: string | null } | null;
  characters?: { id: string; name: string; slug: string } | null;
}

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  view_count: number;
  published_at: string;
  categories?: { name: string; slug: string };
  novels?: { title: string; slug: string } | null;
}

const selectListItem = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  viewCount: true,
  publishedAt: true,
  category: { select: { name: true, slug: true } },
  novel: { select: { title: true, slug: true } },
} as const;

function toListItem(a: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  viewCount: number;
  publishedAt: Date;
  category: { name: string; slug: string };
  novel: { title: string; slug: string } | null;
}): ArticleListItem {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    featured_image: a.featuredImage,
    view_count: a.viewCount,
    published_at: a.publishedAt.toISOString(),
    categories: a.category ? { name: a.category.name, slug: a.category.slug } : undefined,
    novels: a.novel ? { title: a.novel.title, slug: a.novel.slug } : null,
  };
}

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findLatest(limit = 10): Promise<ArticleListItem[]> {
    const list = await this.prisma.article.findMany({
      where: { published: true },
      select: selectListItem,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
    return list.map((a) => toListItem(a as Parameters<typeof toListItem>[0]));
  }

  async findPopular(limit = 10): Promise<ArticleListItem[]> {
    const list = await this.prisma.article.findMany({
      where: { published: true },
      select: selectListItem,
      orderBy: { viewCount: 'desc' },
      take: limit,
    });
    return list.map((a) => toListItem(a as Parameters<typeof toListItem>[0]));
  }

  async findByCategorySlug(categorySlug: string, limit = 50, offset = 0): Promise<{ data: ArticleListItem[]; total: number }> {
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });
    if (!category) return { data: [], total: 0 };

    const [list, total] = await Promise.all([
      this.prisma.article.findMany({
        where: { categoryId: category.id, published: true },
        select: selectListItem,
        orderBy: { publishedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.article.count({
        where: { categoryId: category.id, published: true },
      }),
    ]);
    return {
      data: list.map((a) => toListItem(a as Parameters<typeof toListItem>[0])),
      total,
    };
  }

  async findBySlugAndCategory(categorySlug: string, articleSlug: string): Promise<(Article & { related?: ArticleListItem[] }) | null> {
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });
    if (!category) return null;

    const article = await this.prisma.article.findFirst({
      where: { categoryId: category.id, slug: articleSlug, published: true },
      include: {
        category: { select: { name: true, slug: true } },
        novel: { select: { id: true, title: true, slug: true, coverImage: true } },
        character: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!article) return null;

    await this.prisma.article.update({
      where: { id: article.id },
      data: { viewCount: article.viewCount + 1 },
    });

    const related = await this.findRelated(article.id, article.novelId, article.categoryId, 5);
    const result: Article & { related?: ArticleListItem[] } = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      category_id: article.categoryId,
      novel_id: article.novelId,
      character_id: article.characterId,
      meta_title: article.metaTitle,
      meta_description: article.metaDescription,
      featured_image: article.featuredImage,
      view_count: article.viewCount + 1,
      published: article.published,
      published_at: article.publishedAt.toISOString(),
      created_at: article.createdAt.toISOString(),
      updated_at: article.updatedAt.toISOString(),
      categories: article.category ? { name: article.category.name, slug: article.category.slug } : undefined,
      novels: article.novel
        ? { id: article.novel.id, title: article.novel.title, slug: article.novel.slug, cover_image: article.novel.coverImage }
        : null,
      characters: article.character ? { id: article.character.id, name: article.character.name, slug: article.character.slug } : undefined,
      related,
    };
    return result;
  }

  async findRelated(articleId: string, novelId: string | null, categoryId: string, limit = 5): Promise<ArticleListItem[]> {
    const where: { published: boolean; id?: { not: string }; novelId?: string; categoryId?: string } = {
      published: true,
      id: { not: articleId },
    };
    if (novelId) where.novelId = novelId;
    else where.categoryId = categoryId;

    const list = await this.prisma.article.findMany({
      where,
      select: selectListItem,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
    return list.map((a) => toListItem(a as Parameters<typeof toListItem>[0]));
  }

  async create(payload: {
    title: string;
    slug: string;
    content: string;
    category_id: string;
    novel_id?: string | null;
    character_id?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    published?: boolean;
  }): Promise<Article> {
    const article = await this.prisma.article.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        content: payload.content,
        categoryId: payload.category_id,
        novelId: payload.novel_id ?? undefined,
        characterId: payload.character_id ?? undefined,
        metaTitle: payload.meta_title ?? undefined,
        metaDescription: payload.meta_description ?? undefined,
        published: payload.published ?? true,
      },
    });
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      category_id: article.categoryId,
      novel_id: article.novelId,
      character_id: article.characterId,
      meta_title: article.metaTitle,
      meta_description: article.metaDescription,
      featured_image: article.featuredImage,
      view_count: article.viewCount,
      published: article.published,
      published_at: article.publishedAt.toISOString(),
      created_at: article.createdAt.toISOString(),
      updated_at: article.updatedAt.toISOString(),
    };
  }

  async findAllForSitemap(): Promise<{ slug: string; category_slug: string; updated_at: string }[]> {
    const list = await this.prisma.article.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true, category: { select: { slug: true } } },
    });
    return list.map((a) => ({
      slug: a.slug,
      category_slug: a.category?.slug ?? '',
      updated_at: a.publishedAt.toISOString(),
    }));
  }
}
