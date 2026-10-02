import { Injectable, NotFoundException } from '@nestjs/common';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import { TranslationsService } from './translations.service';
import { BookDto } from '../dto/book.dto';
import { toBookDto } from '../mapper/book.mapper';

@Injectable()
export class BooksService {
  constructor(
    private readonly bibleApi: BibleApiClient,
    private readonly translationsService: TranslationsService,
  ) {}

  async getBooks(translationId: string): Promise<BookDto[]> {
    const response = await this.bibleApi.getBooks(translationId);

    // The response already includes the translation, so no extra API call
    // is needed to check that its language is supported.
    if (!this.translationsService.isSupported(response.translation.language)) {
      throw new NotFoundException(
        `Translation with id ${translationId} not found`,
      );
    }

    return response.books.map(toBookDto);
  }
}
