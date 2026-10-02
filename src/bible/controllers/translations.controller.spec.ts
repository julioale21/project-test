import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsService } from '../services/translations.service';
import { TranslationsController } from './translations.controller';

describe('TranslationsController', () => {
  let controller: TranslationsController;
  const translationsService = { findAll: jest.fn(), findOne: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationsController],
      providers: [
        { provide: TranslationsService, useValue: translationsService },
      ],
    }).compile();

    controller = module.get(TranslationsController);
  });

  it('findAll passes the lang query to the service', async () => {
    translationsService.findAll.mockResolvedValue([{ id: 'spa_r09' }]);

    await expect(controller.findAll({ lang: 'spa' })).resolves.toEqual([
      { id: 'spa_r09' },
    ]);
    expect(translationsService.findAll).toHaveBeenCalledWith('spa');
  });

  it('findAll works without a lang query', async () => {
    translationsService.findAll.mockResolvedValue([]);

    await controller.findAll({});

    expect(translationsService.findAll).toHaveBeenCalledWith(undefined);
  });

  it('findOne passes the id to the service', async () => {
    translationsService.findOne.mockResolvedValue({ id: 'spa_r09' });

    await expect(controller.findOne('spa_r09')).resolves.toEqual({
      id: 'spa_r09',
    });
    expect(translationsService.findOne).toHaveBeenCalledWith('spa_r09');
  });
});
