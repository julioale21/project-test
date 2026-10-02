import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import { spaR09Gen1 } from '../../../test/fixtures';
import { ChaptersService } from './chapters.service';

describe('ChaptersService', () => {
  let service: ChaptersService;
  const bibleApi = { getChapter: jest.fn() };

  beforeEach(async () => {
    bibleApi.getChapter.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        { provide: BibleApiClient, useValue: bibleApi },
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

  it('propagates a 404 from the API client', async () => {
    bibleApi.getChapter.mockRejectedValue(new NotFoundException());

    await expect(
      service.getChapter('spa_r09', 'GEN', 99),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
