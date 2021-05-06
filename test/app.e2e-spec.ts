import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ AppModule ]
    }).compile();

    await module.init();
    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    await app.close();
  });

  describe('GET /', () => {
    test('should redirect to swagger api', async () => {
      const res = await request(app.getHttpServer()).get('/');
      expect(res.status).toBe(302);
      expect(res.header.location).toBe('/api');
    });
  });
});
