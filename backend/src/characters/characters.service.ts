import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Character {
  id: string;
  novel_id: string;
  name: string;
  slug: string;
  description: string | null;
  power_rank: number | null;
  avatar_url: string | null;
  created_at: string;
}

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async findByNovelSlug(novelSlug: string): Promise<Character[]> {
    const novel = await this.prisma.novel.findUnique({
      where: { slug: novelSlug },
      select: { id: true },
    });
    if (!novel) return [];
    const list = await this.prisma.character.findMany({
      where: { novelId: novel.id },
      orderBy: { powerRank: 'asc' },
    });
    return list.map((c) => this.toCharacter(c));
  }

  async findBySlug(novelSlug: string, characterSlug: string): Promise<Character | null> {
    const novel = await this.prisma.novel.findUnique({
      where: { slug: novelSlug },
      select: { id: true },
    });
    if (!novel) return null;
    const c = await this.prisma.character.findUnique({
      where: { novelId_slug: { novelId: novel.id, slug: characterSlug } },
    });
    return c ? this.toCharacter(c) : null;
  }

  private toCharacter(c: { id: string; novelId: string; name: string; slug: string; description: string | null; powerRank: number | null; avatarUrl: string | null; createdAt: Date }): Character {
    return {
      id: c.id,
      novel_id: c.novelId,
      name: c.name,
      slug: c.slug,
      description: c.description,
      power_rank: c.powerRank,
      avatar_url: c.avatarUrl,
      created_at: c.createdAt.toISOString(),
    };
  }
}
