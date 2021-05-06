import { Module } from '@nestjs/common';
import { ExceptionModule } from './filters/exception.module';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';
import { EmitterModule } from './modules/emitter/emitter.module';

export const CommonModuleConfig = {
  imports: [
    ConfigModule, LoggerModule, EmitterModule, ExceptionModule,
  ],
  controllers: [],
  providers: [],
  exports: [
    ConfigModule, LoggerModule, EmitterModule, ExceptionModule,
  ],
};

@Module(CommonModuleConfig)
export class CommonModule { }
