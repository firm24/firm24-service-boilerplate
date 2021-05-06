import { Test, TestingModule } from '@nestjs/testing';
import { SessionModule } from './session.module';
import { SessionRepositoryService } from './session-repository.service';

describe('SessionRepositoryService', () => {
  let module: TestingModule;
  let service: SessionRepositoryService

  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [ SessionModule ] }).compile();

    service = module.get<SessionRepositoryService>(SessionRepositoryService);
  });

  afterEach(async () => {
    await module.close();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
