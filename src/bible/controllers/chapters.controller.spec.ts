import { Test, TestingModule } from '@nestjs/testing';
import { spaR09Gen1 } from '../../../test/fixtures';
import { ChaptersService } from '../services/chapters.service';
import { ChaptersController } from './chapters.controller';

describe('ChaptersController', () => {
  let controller: ChaptersController;
  const chaptersService = { getChapter: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChaptersController],
      providers: [{ provide: ChaptersService, useValue: chaptersService }],
    }).compile();

    controller = module.get(ChaptersController);
  });

  it('findOne passes translation, book and chapter to the service', async () => {
    const chapter = spaR09Gen1();
    chaptersService.getChapter.mockResolvedValue(chapter);

    await expect(controller.findOne('spa_r09', 'GEN', 1)).resolves.toEqual(
      chapter,
    );
    expect(chaptersService.getChapter).toHaveBeenCalledWith(
      'spa_r09',
      'GEN',
      1,
    );
  });
});
