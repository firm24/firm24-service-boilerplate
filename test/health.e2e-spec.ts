import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { HealthService } from '../src/app/health/health.service';

describe('HealthController (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication;
  let service: HealthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({  imports: [ AppModule ] }).compile();

    await module.init();
    service = module.get<HealthService>(HealthService);
    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    await app.close();
  });

  describe('/api/health (GET)', () => {
    test('should return a 200', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/health').send();

      expect(res.status).toBe(200);
    });

    test('should return a 500 when not healthy', async () => {
      jest.spyOn(service, 'isHealthy').mockImplementation(() => Promise.resolve(false));
      const res = await request(app.getHttpServer())
        .get('/api/health').send();

      expect(res.status).toBe(500);
    });
  });
});
