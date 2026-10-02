import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import { spaR09Books } from '../../../test/fixtures';
import { BooksService } from './books.service';
import { TranslationsService } from './translations.service';

describe('BooksService', () => {
  let service: BooksService;
  const bibleApi = { getBooks: jest.fn() };
  const translationsService = { isSupported: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    translationsService.isSupported.mockImplementation(
      (language: string) => language === 'spa',
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BibleApiClient, useValue: bibleApi },
        { provide: TranslationsService, useValue: translationsService },
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

  it('checks the language of the translation in the response', async () => {
    bibleApi.getBooks.mockResolvedValue(spaR09Books());

    await service.getBooks('spa_r09');

    expect(translationsService.isSupported).toHaveBeenCalledWith('spa');
  });

  it('rejects a translation in an unsupported language with a 404', async () => {
    const books = spaR09Books();
    books.translation.language = 'eng';
    bibleApi.getBooks.mockResolvedValue(books);

    await expect(service.getBooks('BSB')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('propagates a 404 from the API client', async () => {
    bibleApi.getBooks.mockRejectedValue(new NotFoundException());

    await expect(service.getBooks('spa_xyz')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
