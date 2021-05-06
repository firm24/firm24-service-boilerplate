import { Test, TestingModule } from '@nestjs/testing';
import { SessionModule } from './session.module';
import { SessionService } from './session.service';
import { SessionRepositoryService } from './session-repository.service';
import { spy } from 'ts-mockito';


describe('SessionService', () => {
  let module: TestingModule;
  let service: SessionService;

  const spies = () => {
    const repositoryService = module.get<SessionRepositoryService>(SessionRepositoryService);

    const repository = spy(repositoryService);
    return { repository };
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [ SessionModule ] }).compile();

    service = module.get<SessionService>(SessionService);
  });

  afterEach(async () => {
    await module.close();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
