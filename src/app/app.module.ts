import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { appProviders } from './app.providers';
import { SSLMiddleware } from './common/modules/ssl/ssl.middleware';
import { SSLModule } from './common/modules/ssl/ssl.module';
import { HealthModule } from './health/health.module';
import { HttpAuthMiddleware } from './common/modules/http-auth/http-auth.middleware';
import { HttpAuthModule } from './common/modules/http-auth/http-auth.module';
import { InfoModule } from './info/info.module';
import { SessionMiddleware } from './session/session.middleware';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    CommonModule,
    SSLModule,
    HttpAuthModule,
    HealthModule,
    InfoModule,
    UserModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [
    ...appProviders
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        SSLMiddleware,
        SessionMiddleware,
        HttpAuthMiddleware,
      )
      .forRoutes('*');
  }
}
