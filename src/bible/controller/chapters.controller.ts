import { Controller, Get, Param } from '@nestjs/common';
import { ChaptersService } from '../services/chapters.service';
import { ParseTranslationIdPipe } from '../pipes/parse-translation-id.pipe';

@Controller('translations/:translationId/books/:bookId/chapters')
export class ChaptersController {
    constructor(
        private readonly chaptersService: ChaptersService
    ){}

    @Get(':chapter')
    async findOne(
        @Param('translationId', ParseTranslationIdPipe) translationId: string,
        @Param('bookId') bookId: string,
        @Param('chapter') chapter: number
    ) {
        return this.chaptersService.getChapter(translationId, bookId, chapter);
    }
}
