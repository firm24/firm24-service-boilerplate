export default {
  debug: true,
  port: 3000,
  log: {
    level: 'debug',
  },
  mailer: {
    test: true,
  },
  captcha: {
    enabled: false,
  },
  ssl: {
    enabled: false,
  },
  redis: {
    url: 'redis://localhost'
  },
  rmq: {
    url: 'amqp://localhost',
  },
};
