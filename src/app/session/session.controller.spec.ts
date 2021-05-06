import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionModule } from './session.module';

describe('SessionController', () => {
  let module: TestingModule;
  let controller: SessionController;

  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [ SessionModule ] }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  afterEach(async () => {
    await module.close();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
