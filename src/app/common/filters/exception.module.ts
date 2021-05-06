import { ConfigService } from './../modules/config/config.service';
import { HttpExceptionFilter } from './http-exception.filter';
import { InternalExceptionFilter } from './internal-exception.filter';
import { CommonExceptionFilter } from './common-exception.filter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../modules/config/config.module';
import { LoggerModule } from '../modules/logger/logger.module';

export const ExceptionModuleConfig = {
  imports: [
    ConfigModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    HttpExceptionFilter,
    CommonExceptionFilter,
    InternalExceptionFilter,
  ],
  exports: [
    HttpExceptionFilter,
    CommonExceptionFilter,
    InternalExceptionFilter,
  ],
};

@Module(ExceptionModuleConfig)
export class ExceptionModule { }
