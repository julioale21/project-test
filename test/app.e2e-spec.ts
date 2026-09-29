import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('GET /api/v1 responde el saludo', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect('Hello World from my local machine!');
  });

  it('GET / sin prefijo da 404', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  describe('CORS', () => {
    it('permite el origen configurado en FRONTEND_URL', () => {
      const origin = process.env.FRONTEND_URL!.split(',')[0].trim();

      return request(app.getHttpServer())
        .get('/api/v1')
        .set('Origin', origin)
        .expect('Access-Control-Allow-Origin', origin);
    });

    it('no devuelve la cabecera para un origen desconocido', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1')
        .set('Origin', 'http://malicioso.com');

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
