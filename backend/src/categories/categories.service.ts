import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    const list = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      sort_order: c.sortOrder,
      created_at: c.createdAt.toISOString(),
    }));
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const c = await this.prisma.category.findUnique({ where: { slug } });
    if (!c) return null;
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      sort_order: c.sortOrder,
      created_at: c.createdAt.toISOString(),
    };
  }
}
