import { ConfigService } from './../config/config.service';
import { DatabaseService } from './database.service';
import { DB_DEFAULT_CONNECTION, DB_SESSION_CONNECTION } from './../../constants';

export const databaseProviders = [
  {
    provide: DB_DEFAULT_CONNECTION,
    useFactory: (database: DatabaseService, config: ConfigService) => {
      // @note: do not open db connection in tests as we use mocks only
      // if db is required override DB_DEFAULT_CONNECTION in the test
      return config.isEnv('test') ? undefined : database.connect();
    },
    inject: [DatabaseService, ConfigService],
  },
];
