import { Controller, Get, Param } from '@nestjs/common';
import { CharactersService } from './characters.service';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get('novel/:novelSlug')
  findByNovel(@Param('novelSlug') novelSlug: string) {
    return this.charactersService.findByNovelSlug(novelSlug);
  }

  @Get('novel/:novelSlug/:characterSlug')
  findBySlug(
    @Param('novelSlug') novelSlug: string,
    @Param('characterSlug') characterSlug: string,
  ) {
    return this.charactersService.findBySlug(novelSlug, characterSlug);
  }
}
