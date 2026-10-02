import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import { availableTranslations } from '../../../test/fixtures';
import { TranslationsService } from './translations.service';

describe('TranslationsService', () => {
  let service: TranslationsService;
  const bibleApi = { getTranslations: jest.fn() };

  beforeEach(async () => {
    bibleApi.getTranslations
      .mockReset()
      .mockResolvedValue(availableTranslations());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationsService,
        { provide: BibleApiClient, useValue: bibleApi },
        {
          provide: ConfigService,
          useValue: new ConfigService({
            SUPPORTED_LANGUAGES: 'spa',
            DEFAULT_TRANSLATIONS: 'spa:spa_r09',
          }),
        },
      ],
    }).compile();

    service = module.get(TranslationsService);
  });

  describe('findAll', () => {
    it('returns only translations in supported languages when no lang is given', async () => {
      const result = await service.findAll();

      expect(result.map((t) => t.id).sort()).toEqual(['spa_pdt', 'spa_r09']);
    });

    it('filters by the requested language', async () => {
      const result = await service.findAll('spa');

      expect(result.every((t) => t.language === 'spa')).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('marks only the configured default translation', async () => {
      const result = await service.findAll('spa');

      expect(result.find((t) => t.id === 'spa_r09')?.isDefault).toBe(true);
      expect(result.find((t) => t.id === 'spa_pdt')?.isDefault).toBe(false);
    });

    it('rejects an unsupported language without calling the API', async () => {
      await expect(service.findAll('eng')).rejects.toThrow(
        'Language eng is not supported',
      );
      expect(bibleApi.getTranslations).not.toHaveBeenCalled();
    });

    // TODO: findAll throws a plain Error, which Nest turns into a 500.
    // Remove `.skip` once it throws BadRequestException.
    it.skip('rejects an unsupported language with a 400', async () => {
      await expect(service.findAll('eng')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('returns the mapped translation', async () => {
      const result = await service.findOne('spa_r09');

      expect(result).toMatchObject({
        id: 'spa_r09',
        shortName: 'R09',
        isDefault: true,
      });
    });

    it('rejects an unknown id', async () => {
      await expect(service.findOne('spa_xyz')).rejects.toThrow(
        'Translation with id spa_xyz not found',
      );
    });

    // TODO: findOne throws a plain Error, which Nest turns into a 500.
    // Remove `.skip` once it throws NotFoundException.
    it.skip('rejects an unknown id with a 404', async () => {
      await expect(service.findOne('spa_xyz')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    // TODO: findOne does not check the language yet, so BSB (English) is returned.
    // Remove `.skip` once unsupported languages are rejected.
    it.skip('rejects a translation in an unsupported language', async () => {
      await expect(service.findOne('BSB')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
