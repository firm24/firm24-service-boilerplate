import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { HealthModule } from './health.module';

describe('HealthService', () => {
  let module: TestingModule;
  let service: HealthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ HealthModule ]
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(async () => {
    await module.close();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
