import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import { spaR09Gen1 } from '../../../test/fixtures';
import { ChaptersService } from './chapters.service';
import { TranslationsService } from './translations.service';

describe('ChaptersService', () => {
  let service: ChaptersService;
  const bibleApi = { getChapter: jest.fn() };
  const translationsService = { isSupported: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    translationsService.isSupported.mockImplementation(
      (language: string) => language === 'spa',
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        { provide: BibleApiClient, useValue: bibleApi },
        { provide: TranslationsService, useValue: translationsService },
      ],
    }).compile();

    service = module.get(ChaptersService);
  });

  it('asks the API for the requested chapter', async () => {
    const chapter = spaR09Gen1();
    bibleApi.getChapter.mockResolvedValue(chapter);

    await expect(service.getChapter('spa_r09', 'GEN', 1)).resolves.toEqual(
      chapter,
    );
    expect(bibleApi.getChapter).toHaveBeenCalledWith('spa_r09', 'GEN', 1);
  });

  it('rejects a chapter from an unsupported language with a 404', async () => {
    const chapter = spaR09Gen1();
    chapter.translation.language = 'eng';
    bibleApi.getChapter.mockResolvedValue(chapter);

    await expect(service.getChapter('BSB', 'GEN', 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('propagates a 404 from the API client', async () => {
    bibleApi.getChapter.mockRejectedValue(new NotFoundException());

    await expect(
      service.getChapter('spa_r09', 'GEN', 99),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
