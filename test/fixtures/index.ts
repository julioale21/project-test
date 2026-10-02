import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  ApiAvailableTranslations,
  ApiTranslationBookChapter,
  ApiTranslationBooks,
} from 'free-use-bible-api';

// Real responses from bible.helloao.org, trimmed to keep them small:
// - available-translations: spa_r09 and spa_pdt (Spanish) and BSB (English)
// - spa_r09.books: GEN, EXO and MAT
// - spa_r09.GEN.1: first 3 verses
function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(__dirname, name), 'utf8')) as T;
}

export const availableTranslations = () =>
  load<ApiAvailableTranslations>('available-translations.json');

export const spaR09Books = () =>
  load<ApiTranslationBooks>('spa_r09.books.json');

export const spaR09Gen1 = () =>
  load<ApiTranslationBookChapter>('spa_r09.GEN.1.json');
