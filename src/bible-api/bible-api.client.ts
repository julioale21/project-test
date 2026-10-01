import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// `import type` is erased at compile time, so the package's broken CommonJS
// build is never loaded: only its type definitions are used.
import type {
  ApiAvailableTranslations,
  ApiTranslationBookChapter,
  ApiTranslationBooks,
} from 'free-use-bible-api';

const DEFAULT_TIMEOUT_MS = 5000;

@Injectable()
export class BibleApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    this.baseUrl = config
      .getOrThrow<string>('BIBLE_API_BASE_URL')
      .replace(/\/+$/, '');
    this.timeoutMs = Number(
      config.get('BIBLE_API_TIMEOUT_MS', DEFAULT_TIMEOUT_MS),
    );
  }

  getTranslations(): Promise<ApiAvailableTranslations> {
    return this.getJson('available_translations.json');
  }

  getBooks(translationId: string): Promise<ApiTranslationBooks> {
    return this.getJson(`${encodeURIComponent(translationId)}/books.json`);
  }

  getChapter(
    translationId: string,
    bookId: string,
    chapter: number,
  ): Promise<ApiTranslationBookChapter> {
    return this.getJson(
      `${encodeURIComponent(translationId)}/${encodeURIComponent(bookId)}/${chapter}.json`,
    );
  }

  private async getJson<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}/${path}`;
    let response: Response;

    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      // fetch rejects with a DOMException, which is not always `instanceof Error`.
      if ((error as { name?: string })?.name === 'TimeoutError') {
        throw new GatewayTimeoutException(
          `Bible API did not respond within ${this.timeoutMs}ms`,
        );
      }
      throw new BadGatewayException('Bible API is unreachable');
    }

    if (response.status === 404) {
      throw new NotFoundException(`Resource not found: ${path}`);
    }
    if (!response.ok) {
      throw new BadGatewayException(
        `Bible API responded with status ${response.status}`,
      );
    }

    return (await response.json()) as T;
  }
}
