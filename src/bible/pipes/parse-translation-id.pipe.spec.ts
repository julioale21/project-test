import { BadRequestException } from '@nestjs/common';
import { ParseTranslationIdPipe } from './parse-translation-id.pipe';

describe('ParseTranslationIdPipe', () => {
  const pipe = new ParseTranslationIdPipe();

  it.each(['spa_r09', 'BSB', 'eng_kjv', 'abc-123'])(
    'accepts "%s" and returns it unchanged',
    (id) => {
      expect(pipe.transform(id)).toBe(id);
    },
  );

  it.each([
    ['empty', ''],
    ['with spaces', 'spa r09'],
    ['path traversal', '../etc'],
    ['with a slash', 'spa/r09'],
    ['longer than 32 characters', 'a'.repeat(33)],
  ])('rejects an id %s', (_label, id) => {
    expect(() => pipe.transform(id)).toThrow(BadRequestException);
  });
});
