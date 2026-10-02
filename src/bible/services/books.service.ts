import { Injectable } from '@nestjs/common';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import type { ApiTranslationBooks } from 'free-use-bible-api';

@Injectable()
export class BooksService {
  constructor(private readonly bibleApi: BibleApiClient) {}

  async getBooks(translationId: string): Promise<ApiTranslationBooks> {
    return await this.bibleApi.getBooks(translationId);
  }
}
