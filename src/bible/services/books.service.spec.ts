import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import { spaR09Books } from '../../../test/fixtures';
import { BooksService } from './books.service';

describe('BooksService', () => {
  let service: BooksService;
  const bibleApi = { getBooks: jest.fn() };

  beforeEach(async () => {
    bibleApi.getBooks.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BibleApiClient, useValue: bibleApi },
      ],
    }).compile();

    service = module.get(BooksService);
  });

  it('asks the API for the books of the given translation', async () => {
    const books = spaR09Books();
    bibleApi.getBooks.mockResolvedValue(books);

    await expect(service.getBooks('spa_r09')).resolves.toEqual(books);
    expect(bibleApi.getBooks).toHaveBeenCalledWith('spa_r09');
  });

  it('propagates a 404 from the API client', async () => {
    bibleApi.getBooks.mockRejectedValue(new NotFoundException());

    await expect(service.getBooks('spa_xyz')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
