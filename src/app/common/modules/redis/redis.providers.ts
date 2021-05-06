import redis from 'ioredis';
import {
  REDIS,
  REDIS_DEFAULT_CONNECTION,
} from '../../constants';
import { ConfigService } from '../config/config.service';
import { RedisConnectionService } from './redis.connection.service';

export const redisProviders = [
  {
    provide: REDIS,
    useValue: redis,
  },
  {
    provide: REDIS_DEFAULT_CONNECTION,
    useFactory: (connectionService: RedisConnectionService, config: ConfigService) => {
      // @note: do not open db connection in tests as we use mocks only
      // if db is required override DB_DEFAULT_CONNECTION in the test
      const client = config.getRedisClient();
      return config.getRedisClient() ? connectionService.connect(config.getRedisClient()) : null;
    },
    inject: [RedisConnectionService, ConfigService],
  }
];
