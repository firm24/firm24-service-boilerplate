import { Module } from '@nestjs/common';
import { redisProviders } from './redis.providers';
import { RedisConnectionService } from './redis.connection.service';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '../config/config.module';
import { RedisService } from './redis.service';

export const RedisModuleConfig = {
  imports: [LoggerModule, ConfigModule],
  controllers: [],
  providers: [
    ...redisProviders,
    RedisConnectionService,
    RedisService,
  ],
  exports: [
    ...redisProviders,
    RedisConnectionService,
    RedisService,
  ],
};

@Module(RedisModuleConfig)
export class RedisModule { }
