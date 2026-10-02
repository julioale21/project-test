import { spaR09Books } from '../../../test/fixtures';
import { toBookDto, toTestament } from './book.mapper';

describe('book mapper', () => {
  const books = spaR09Books().books;
  const genesis = books.find((b) => b.id === 'GEN')!;
  const matthew = books.find((b) => b.id === 'MAT')!;

  describe('toBookDto', () => {
    it('maps the API book to the public DTO', () => {
      expect(toBookDto(genesis)).toEqual({
        id: 'GEN',
        name: 'Génesis',
        order: 1,
        chapters: 50,
        testament: 'old',
      });
    });

    it('marks New Testament books as new', () => {
      expect(toBookDto(matthew)).toMatchObject({
        id: 'MAT',
        order: 40,
        testament: 'new',
      });
    });

    it('does not leak API-only fields', () => {
      const dto = toBookDto(genesis);

      expect(dto).not.toHaveProperty('sha256');
      expect(dto).not.toHaveProperty('firstChapterApiLink');
      expect(dto).not.toHaveProperty('numberOfChapters');
    });
  });

  describe('toTestament', () => {
    it.each([
      [1, 'old'],
      [39, 'old'],
      [40, 'new'],
      [66, 'new'],
    ])('order %i is %s', (order, expected) => {
      expect(toTestament(order)).toBe(expected);
    });
  });
});
