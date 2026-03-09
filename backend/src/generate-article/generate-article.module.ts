import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { GenerateArticleController } from './generate-article.controller';
import { GenerateArticleService } from './generate-article.service';

@Module({
  imports: [ArticlesModule],
  controllers: [GenerateArticleController],
  providers: [GenerateArticleService],
})
export class GenerateArticleModule {}
