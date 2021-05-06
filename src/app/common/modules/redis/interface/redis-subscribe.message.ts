export interface RedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}
