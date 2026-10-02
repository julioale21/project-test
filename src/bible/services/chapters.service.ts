import type { ApiTranslationBookChapter } from 'free-use-bible-api';
import { BibleApiClient } from './../../bible-api/bible-api.client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TranslationsService } from './translations.service';

@Injectable()
export class ChaptersService {
  constructor(
    private readonly bibleApi: BibleApiClient,
    private readonly translationsService: TranslationsService,
  ) {}

  async getChapter(
    translationId: string,
    bookId: string,
    chapter: number,
  ): Promise<ApiTranslationBookChapter> {
    const response = await this.bibleApi.getChapter(
      translationId,
      bookId,
      chapter,
    );

    if (!this.translationsService.isSupported(response.translation.language)) {
      throw new NotFoundException(
        `Translation with id ${translationId} not found`,
      );
    }

    return response;
  }
}
