import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { RedisConnection } from './classes/redis.connection';
import { Observable, Observer } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { RedisSubscribeMessage } from './interface/redis-subscribe.message';
import { REDIS_DEFAULT_CONNECTION } from '../../constants';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RedisService implements OnModuleDestroy {

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject(REDIS_DEFAULT_CONNECTION)
    private connection: RedisConnection,
  ) {}

  async onModuleDestroy() {
    await this.close();
  }

  private async close() {
    if (this.connection) {
      await this.connection.close();
      delete this.connection;
    }
  }

  async getValue(key: string): Promise<string> {
    return this.connection.get(key);
  }

  async setValue(key: string, value: string, ttl?: number): Promise<string> {
    return ttl ? this.connection.setex(key, ttl, value) : this.connection.set(key, value);
  }

  async delValue(key: string): Promise<number> {
    return this.connection.del(key);
  }

  async setObject(key: string, value: any): Promise<void> {
    Object.keys(value).forEach(async (field) => {
      await this.connection.hset(key, field, value[field]);
    });
  }

  async getObject(key: string): Promise<any> {
    return this.connection.hgetall(key);
  }

  fromEvent<T>(eventName: string): Observable<T> {
    this.connection.subscribe(eventName);

    return Observable.create((observer: Observer<RedisSubscribeMessage>) =>
      this.connection.on('message', (channel, message) => observer.next({ channel, message })),
    ).pipe(
      filter(({ channel }) => channel === eventName),
      tap(message => this.logger.debug(`redis-service: receive event ${message}`)),
      map(({ message }) => JSON.parse(message)),
    );
  }

  async publish(channel: string, value: unknown): Promise<number> {
    this.logger.debug(`redis-service: Publish event to channel ${channel}`);
    return this.connection.publish(channel, JSON.stringify(value));
  }

  hasConnection(): boolean {
    return !!this.connection;
  }
}
