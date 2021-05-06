import { HttpAuthGuard } from './http-auth.guard';
import { HttpAuthMiddleware } from './http-auth.middleware';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { HttpAuthService } from './http-auth.service';

@Module({
  imports: [ConfigModule],
  providers: [
    HttpAuthService,
    HttpAuthMiddleware,
    HttpAuthGuard,
  ],
  exports: [
    HttpAuthService,
    HttpAuthMiddleware,
    HttpAuthGuard,
  ],
})
export class HttpAuthModule { }
