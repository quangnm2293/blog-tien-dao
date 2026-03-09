import { Injectable } from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';
import { PrismaService } from '../prisma/prisma.service';

export interface GenerateArticleDto {
  type: 'tom-tat-truyen' | 'top-nhan-vat-manh-nhat' | 'he-thong-canh-gioi' | 'nhan-vat' | 'giai-thich-cot-truyen';
  novel_id?: string;
  character_id?: string;
  title?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
}

@Injectable()
export class GenerateArticleService {
  constructor(
    private prisma: PrismaService,
    private articlesService: ArticlesService,
  ) {}

  async generate(dto: GenerateArticleDto): Promise<{
    success: boolean;
    message: string;
    article?: { id: string; slug: string; category_slug: string };
  }> {
    const categorySlug = dto.type;
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });
    if (!category) {
      return { success: false, message: `Category not found: ${categorySlug}` };
    }

    if (dto.content && dto.title) {
      const slug = this.slugify(dto.title);
      const article = await this.articlesService.create({
        title: dto.title,
        slug,
        content: dto.content,
        category_id: category.id,
        novel_id: dto.novel_id ?? null,
        character_id: dto.character_id ?? null,
        meta_title: dto.meta_title || dto.title.slice(0, 70),
        meta_description: dto.meta_description || dto.content.slice(0, 160).replace(/\n/g, ' '),
        published: true,
      });
      return {
        success: true,
        message: 'Article created. Integrate AI here to generate content.',
        article: {
          id: article.id,
          slug: article.slug,
          category_slug: categorySlug,
        },
      };
    }

    return {
      success: true,
      message: 'Ready for AI integration. Send title + content to save article.',
    };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
