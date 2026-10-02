import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import type { ApiTranslationBookChapter } from 'free-use-bible-api';
import { ChaptersService } from '../services/chapters.service';
import { ParseBookIdPipe } from '../pipes/parse-book-id.pipe';
import { ParseTranslationIdPipe } from '../pipes/parse-translation-id.pipe';

@Controller('translations/:translationId/books/:bookId/chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get(':chapter')
  async findOne(
    @Param('translationId', ParseTranslationIdPipe) translationId: string,
    @Param('bookId', ParseBookIdPipe) bookId: string,
    @Param('chapter', ParseIntPipe) chapter: number,
  ): Promise<ApiTranslationBookChapter> {
    return this.chaptersService.getChapter(translationId, bookId, chapter);
  }
}
