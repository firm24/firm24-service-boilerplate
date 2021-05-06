import { Test, TestingModule } from '@nestjs/testing';
import { HttpAuthModule } from './http-auth.module';
import { HttpAuthService } from './http-auth.service';
import { ConfigService } from '../config/config.service';

describe('HttpAuthService', () => {
  let module: TestingModule;
  let authService: HttpAuthService;
  let config: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [ HttpAuthModule ] }).compile();
    await module.init();

    authService = module.get<HttpAuthService>(HttpAuthService);
    config = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await module.close();
  })

  describe('validateBearer()', () => {
    test('should return true if a token is correct', () => {
      const { token } = config.getHttpAuth().bearer;

      expect(authService.validateBearer(token)).toEqual({ authorized: true });
    });

    test('should return false if a token is incorrect', () => {
      const token = 'test';

      expect(authService.validateBearer(token)).toEqual({ authorized: false });
    });
  });
});
