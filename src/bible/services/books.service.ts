import { Injectable, NotFoundException } from '@nestjs/common';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import type { ApiTranslationBooks } from 'free-use-bible-api';
import { TranslationsService } from './translations.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly bibleApi: BibleApiClient,
    private readonly translationsService: TranslationsService,
  ) {}

  async getBooks(translationId: string): Promise<ApiTranslationBooks> {
    const response = await this.bibleApi.getBooks(translationId);

    // The response already includes the translation, so no extra API call
    // is needed to check that its language is supported.
    if (!this.translationsService.isSupported(response.translation.language)) {
      throw new NotFoundException(
        `Translation with id ${translationId} not found`,
      );
    }

    return response;
  }
}
