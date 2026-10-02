import { Test, TestingModule } from '@nestjs/testing';
import type { BookDto } from '../dto/book.dto';
import { BooksService } from '../services/books.service';
import { BooksController } from './books.controller';

describe('BooksController', () => {
  let controller: BooksController;
  const booksService = { getBooks: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: booksService }],
    }).compile();

    controller = module.get(BooksController);
  });

  it('findAll returns the books of the translation', async () => {
    const books: BookDto[] = [
      { id: 'GEN', name: 'Génesis', order: 1, chapters: 50, testament: 'old' },
      {
        id: 'MAT',
        name: 'San Mateo',
        order: 40,
        chapters: 28,
        testament: 'new',
      },
    ];
    booksService.getBooks.mockResolvedValue(books);

    await expect(controller.findAll('spa_r09')).resolves.toEqual(books);
    expect(booksService.getBooks).toHaveBeenCalledWith('spa_r09');
  });
});
