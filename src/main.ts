import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from './app/common/modules/config/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GrpcOptions, MicroserviceOptions, RedisOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { LoggerService } from './app/common/modules/logger/logger.service';
import cors from 'cors';
import helmet from 'helmet';
import cookie from 'cookie-parser';
import bodyParser from 'body-parser';

declare const module: any;

async function swagger(app: INestApplication, config: ConfigService) {
  const options = new DocumentBuilder()
    .setTitle('Firm24 notifications')
    .setDescription('Firm24 notifications')
    .addBearerAuth()
    .build();

  // config.isSSLEnabled() ? options.schemes = ['https'] : options.schemes = ['http', 'https'];
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.set('trust proxy', true); // @note: gives access to ip in request
  const config = app.get<ConfigService>(ConfigService);

  await swagger(app, config);

  const dist = await config.getDist();
  if (dist) {
    app.useStaticAssets(dist, { index: false });
  }
  const helmetOptions: any = {};
  if(!config.isSSLEnabled()) {
    helmetOptions.hsts = false;
  }
  app.use(cors(await config.getCors()));
  app.use(cookie());
  app.use(helmet(helmetOptions));
  app.use(bodyParser.json());
  
  await app.listenAsync(config.getPort());

  const logger = app.get<LoggerService>(LoggerService);
  logger.info(`server: running on http://localhost:${config.getPort()}`);
  logger.info(`server: using env ${config.getEnv()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
