import { BadRequestException } from '@nestjs/common';
import { ParseBookIdPipe } from './parse-book-id.pipe';

describe('ParseBookIdPipe', () => {
  const pipe = new ParseBookIdPipe();

  it.each(['GEN', 'JHN', '1SA', '2KI', '3JN', 'PS2'])('accepts "%s"', (id) => {
    expect(pipe.transform(id)).toBe(id);
  });

  it.each([
    ['gen', 'GEN'],
    ['Jhn', 'JHN'],
    ['1sa', '1SA'],
  ])('upper-cases "%s" to "%s"', (input, expected) => {
    expect(pipe.transform(input)).toBe(expected);
  });

  it.each([
    ['empty', ''],
    ['too short', 'GE'],
    ['too long', 'GENE'],
    ['starting with 5', '5SA'],
    ['with a symbol', 'G-N'],
    ['path traversal', '../'],
  ])('rejects an id %s', (_label, id) => {
    expect(() => pipe.transform(id)).toThrow(BadRequestException);
  });
});
