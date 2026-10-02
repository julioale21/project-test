import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { ParseTranslationIdPipe } from '../pipes/parse-translation-id.pipe';
import { ApiTranslationBooks } from 'free-use-bible-api';

@Controller('translations/:translationId/books')
export class BooksController {
    constructor(
        private readonly booksService: BooksService
    ){}

    @Get()
    async findAll(@Param('translationId', ParseTranslationIdPipe) translationId: string): Promise<ApiTranslationBooks> {
        return this.booksService.getBooks(translationId);
    }
}
