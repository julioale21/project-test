import { ApiTranslationBookChapter } from 'free-use-bible-api';
import { BibleApiClient } from './../../bible-api/bible-api.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChaptersService {
    constructor(
        private readonly bibleApi: BibleApiClient,
    ){}

    async getChapter(translationId: string, bookId: string, chapter: number): Promise<ApiTranslationBookChapter> {
        return this.bibleApi.getChapter(translationId, bookId, chapter);
    }
}
