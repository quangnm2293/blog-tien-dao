import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('latest')
  findLatest(@Query('limit') limit?: string) {
    return this.articlesService.findLatest(limit ? parseInt(limit, 10) : 10);
  }

  @Get('popular')
  findPopular(@Query('limit') limit?: string) {
    return this.articlesService.findPopular(limit ? parseInt(limit, 10) : 10);
  }

  @Get('sitemap')
  sitemap() {
    return this.articlesService.findAllForSitemap();
  }

  @Get('category/:categorySlug')
  findByCategory(
    @Param('categorySlug') categorySlug: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.articlesService.findByCategorySlug(
      categorySlug,
      limit ? parseInt(limit, 10) : 50,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Get('category/:categorySlug/:articleSlug')
  findBySlugAndCategory(
    @Param('categorySlug') categorySlug: string,
    @Param('articleSlug') articleSlug: string,
  ) {
    return this.articlesService.findBySlugAndCategory(categorySlug, articleSlug);
  }
}
