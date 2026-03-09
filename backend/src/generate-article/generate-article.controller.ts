import { Body, Controller, Post } from '@nestjs/common';
import { GenerateArticleService, GenerateArticleDto } from './generate-article.service';

@Controller('generate-article')
export class GenerateArticleController {
  constructor(private readonly generateArticleService: GenerateArticleService) {}

  @Post()
  async generate(@Body() dto: GenerateArticleDto) {
    return this.generateArticleService.generate(dto);
  }
}
