import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { NovelsModule } from './novels/novels.module';
import { ArticlesModule } from './articles/articles.module';
import { CharactersModule } from './characters/characters.module';
import { GenerateArticleModule } from './generate-article/generate-article.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CategoriesModule,
    NovelsModule,
    ArticlesModule,
    CharactersModule,
    GenerateArticleModule,
  ],
})
export class AppModule {}
