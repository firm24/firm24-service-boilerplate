import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';

describe('AppController', () => {
  let module: TestingModule;
  let controller: AppController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ AppModule ]
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
