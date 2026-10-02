import { BookDto } from './../dto/book.dto';
import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { ParseTranslationIdPipe } from '../pipes/parse-translation-id.pipe';

@Controller('translations/:translationId/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll(
    @Param('translationId', ParseTranslationIdPipe) translationId: string,
  ): Promise<BookDto[]> {
    return this.booksService.getBooks(translationId);
  }
}
