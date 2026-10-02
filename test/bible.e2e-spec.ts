import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';
import { BibleApiClient } from './../src/bible-api/bible-api.client';
import { availableTranslations, spaR09Books, spaR09Gen1 } from './fixtures';

// The real HTTP client is replaced so these tests never hit bible.helloao.org.
// Supported languages and defaults come from the .env (spa / spa_r09).
describe('Bible API (e2e)', () => {
  let app: INestApplication<App>;
  const bibleApi = {
    getTranslations: jest.fn(),
    getBooks: jest.fn(),
    getChapter: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    bibleApi.getTranslations.mockResolvedValue(availableTranslations());
    bibleApi.getBooks.mockResolvedValue(spaR09Books());
    bibleApi.getChapter.mockResolvedValue(spaR09Gen1());

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BibleApiClient)
      .useValue(bibleApi)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/v1/translations', () => {
    it('returns the Spanish translations as DTOs', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/api/v1/translations?lang=spa')
        .expect(200);

      expect(body.map((t: { id: string }) => t.id).sort()).toEqual([
        'spa_pdt',
        'spa_r09',
      ]);
      expect(body[0]).not.toHaveProperty('sha256');
    });

    it('returns only supported languages when lang is omitted', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/api/v1/translations')
        .expect(200);

      expect(body.some((t: { id: string }) => t.id === 'BSB')).toBe(false);
    });

    it('rejects a lang that is not 3 characters long', () => {
      return request(app.getHttpServer())
        .get('/api/v1/translations?lang=es')
        .expect(400);
    });

    it('rejects unknown query params', () => {
      return request(app.getHttpServer())
        .get('/api/v1/translations?lang=spa&foo=1')
        .expect(400);
    });

    it('rejects an unsupported language with a 400', () => {
      return request(app.getHttpServer())
        .get('/api/v1/translations?lang=eng')
        .expect(400);
    });
  });

  describe('GET /api/v1/translations/:translationId', () => {
    it('returns one translation', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/api/v1/translations/spa_r09')
        .expect(200);

      expect(body).toMatchObject({ id: 'spa_r09', isDefault: true });
    });

    it('rejects a malformed id with a 400', () => {
      return request(app.getHttpServer())
        .get('/api/v1/translations/spa%20r09')
        .expect(400);
    });

    it('returns 404 for an unknown id', () => {
      return request(app.getHttpServer())
        .get('/api/v1/translations/spa_xyz')
        .expect(404);
    });
  });

  describe('GET /api/v1/translations/:translationId/books', () => {
    it('returns the books of the translation', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/api/v1/translations/spa_r09/books')
        .expect(200);

      expect(body.books.map((b: { id: string }) => b.id)).toEqual([
        'GEN',
        'EXO',
        'MAT',
      ]);
      expect(bibleApi.getBooks).toHaveBeenCalledWith('spa_r09');
    });

    it('returns 404 when the API does not know the translation', () => {
      bibleApi.getBooks.mockRejectedValue(new NotFoundException());

      return request(app.getHttpServer())
        .get('/api/v1/translations/spa_xyz/books')
        .expect(404);
    });

    it('rejects a malformed translation id', () => {
      return request(app.getHttpServer())
        .get('/api/v1/translations/spa%20r09/books')
        .expect(400);
    });

    it('returns 404 for a translation in an unsupported language', () => {
      const books = spaR09Books();
      books.translation.language = 'eng';
      bibleApi.getBooks.mockResolvedValue(books);

      return request(app.getHttpServer())
        .get('/api/v1/translations/BSB/books')
        .expect(404);
    });
  });

  describe('GET /api/v1/translations/:translationId/books/:bookId/chapters/:chapter', () => {
    it('returns the chapter', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/api/v1/translations/spa_r09/books/GEN/chapters/1')
        .expect(200);

      expect(body.chapter.number).toBe(1);
      expect(body.chapter.content[0]).toMatchObject({
        type: 'verse',
        number: 1,
      });
    });

    it('returns 404 when the chapter does not exist', () => {
      bibleApi.getChapter.mockRejectedValue(new NotFoundException());

      return request(app.getHttpServer())
        .get('/api/v1/translations/spa_r09/books/GEN/chapters/99')
        .expect(404);
    });

    it('returns 404 for a chapter from an unsupported language', () => {
      const chapter = spaR09Gen1();
      chapter.translation.language = 'eng';
      bibleApi.getChapter.mockResolvedValue(chapter);

      return request(app.getHttpServer())
        .get('/api/v1/translations/BSB/books/GEN/chapters/1')
        .expect(404);
    });

    it('passes the chapter to the client as a number', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/translations/spa_r09/books/GEN/chapters/1')
        .expect(200);

      expect(bibleApi.getChapter).toHaveBeenCalledWith('spa_r09', 'GEN', 1);
    });

    it('rejects a non-numeric chapter with a 400', () => {
      return request(app.getHttpServer())
        .get('/api/v1/translations/spa_r09/books/GEN/chapters/abc')
        .expect(400);
    });

    it('accepts a lower-case book id', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/translations/spa_r09/books/gen/chapters/1')
        .expect(200);

      expect(bibleApi.getChapter).toHaveBeenCalledWith('spa_r09', 'GEN', 1);
    });
  });
});
