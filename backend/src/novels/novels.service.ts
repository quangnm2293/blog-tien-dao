import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Novel {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  author_name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class NovelsService {
  constructor(private prisma: PrismaService) {}

  async findAll(limit = 50): Promise<Novel[]> {
    const list = await this.prisma.novel.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return list.map((n) => this.toNovel(n));
  }

  async findTrending(limit = 10): Promise<Novel[]> {
    const list = await this.prisma.novel.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return list.map((n) => this.toNovel(n));
  }

  async findBySlug(slug: string): Promise<Novel | null> {
    const n = await this.prisma.novel.findUnique({ where: { slug } });
    return n ? this.toNovel(n) : null;
  }

  async create(payload: Partial<Novel>): Promise<Novel> {
    const n = await this.prisma.novel.create({
      data: {
        title: payload.title!,
        slug: payload.slug!,
        description: payload.description ?? undefined,
        coverImage: payload.cover_image ?? undefined,
        authorName: payload.author_name ?? undefined,
        status: payload.status ?? 'completed',
      },
    });
    return this.toNovel(n);
  }

  private toNovel(n: { id: string; title: string; slug: string; description: string | null; coverImage: string | null; authorName: string | null; status: string; createdAt: Date; updatedAt: Date }): Novel {
    return {
      id: n.id,
      title: n.title,
      slug: n.slug,
      description: n.description,
      cover_image: n.coverImage,
      author_name: n.authorName,
      status: n.status,
      created_at: n.createdAt.toISOString(),
      updated_at: n.updatedAt.toISOString(),
    };
  }
}
