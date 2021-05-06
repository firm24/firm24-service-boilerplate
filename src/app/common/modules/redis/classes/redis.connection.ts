import redis from 'ioredis';

export class RedisConnection {
  constructor(
    private connection: redis.Redis | redis.Cluster,
  ) {}



  async set(key: redis.KeyType, value: string): Promise<string> {
    return this.connection.set(key, value);
  }

  async setex(key: redis.KeyType, seconds: number, value: string): Promise<string> {
    return this.connection.setex(key, seconds, value);
  }

  async hset(key: redis.KeyType, field: string, value: any): Promise<0 | 1> {
    return this.connection.hset(key, field, value);
  }

  async hgetall(key: redis.KeyType): Promise<any> {
    return this.connection.hgetall(key);
  }

  async get(key: redis.KeyType): Promise<string> {
    return this.connection.get(key);
  }

  async del(key: redis.KeyType): Promise<number> {
    return this.connection.del(key);
  }

  async sadd(key: redis.KeyType, value: string): Promise<number> {
    return this.connection.sadd(key, [value]);
  }

  async srem(key: redis.KeyType, value: string): Promise<number> {
    return this.connection.srem(key, [value]);
  }

  async smembers(key: redis.KeyType): Promise<string[]> {
    return this.connection.smembers(key);
  }

  async zadd(key: redis.KeyType, args: string[]): Promise<number | string> {
    return this.connection.zadd(key, ...args);
  }

  async zaddIncr(key: redis.KeyType, members: string[]): Promise<number | string> {
    const number = await this.zcard(key);
    return this.connection.zadd(key, String(number), ...members);
  }

  async zaddWithScore(key: redis.KeyType, score: string, value: string): Promise<number | string> {
    return this.connection.zadd(key, score, value);
  }

  async zrange(key: redis.KeyType, start: number, stop: number): Promise<any> {
    return this.connection.zrange(key, start, stop);
  }

  async zrevrange(key: redis.KeyType, start: number, stop: number): Promise<any> {
    return this.connection.zrevrange(key, start, stop);
  }

  async zrevrangePaginate(key: redis.KeyType, limit: number, offset: number): Promise<any> {
    const start = Number(offset);
    const stop = (Number(limit) - 1) + start;
    return this.connection.zrevrange(key, start, stop);
  }

  async zrangePaginate(key: redis.KeyType, limit: number, offset: number): Promise<any> {
    const start = Number(offset);
    const stop = (Number(limit) - 1) + start;
    return this.connection.zrange(key, start, stop);
  }

  async zcard(key: redis.KeyType): Promise<number> {
    return this.connection.zcard(key);
  }

  async subscribe(eventName: string) {
    return this.connection.subscribe(eventName);
  }

  async publish(channel: string, message: string): Promise<number> {
    return this.connection.publish(channel, message);
  }

  async on(event: string | symbol, listener: (...args: any[]) => void) {
    return this.connection.on(event, listener);
  }

  async close() {
    await this.connection.quit();
  }

  isConnected(): boolean {
    return this.connection.status === 'ready';
  }
}
