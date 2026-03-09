import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NovelsService } from './novels.service';

@Controller('novels')
export class NovelsController {
  constructor(private readonly novelsService: NovelsService) {}

  @Get()
  findAll() {
    return this.novelsService.findAll();
  }

  @Get('trending')
  findTrending() {
    return this.novelsService.findTrending();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.novelsService.findBySlug(slug);
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.novelsService.create(body);
  }
}
