import { CaptchaModule } from './../common/modules/captcha/captcha.module';
import { DatabaseModule } from './../common/modules/database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { UserRepositoryService } from './user-repository.service';
import { CommonModule } from '../common/common.module';
import { HasherModule } from '../common/modules/hasher/hasher.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    HasherModule,
    CaptchaModule,
  ],
  controllers: [UserController],
  providers: [...userProviders, UserService, UserRepositoryService],
  exports: [...userProviders, UserService, UserRepositoryService],
})
export class UserModule { }
