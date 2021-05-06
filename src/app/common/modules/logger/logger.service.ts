import { pascalCase } from 'pascal-case';
import { LoggerBuilderService } from './logger-builder.service';
import { Injectable, Optional } from '@nestjs/common';
import cliProgress from 'cli-progress';

@Injectable()
export class LoggerService {
  constructor(
    private readonly loggerBuilder: LoggerBuilderService,
    @Optional() private readonly context?: string,
  ) { }

  build(context?: string) {
    return new LoggerService(this.loggerBuilder, pascalCase(context));
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }

  progress(total: number) {
    // @todo: see if we can make the progress bar sticky even if other stuff is printed to console
    const bar = new cliProgress.SingleBar({
      stopOnComplete: true,
      hideCursor: true,
      forceRedraw: true,
    }, cliProgress.Presets.shades_classic);

    bar.start(total, 0);

    return bar;
  }

  async log(level: string, message: string, meta?: any) {
    const logger = this.loggerBuilder.getLogger();
    logger[level](message, { ...meta, context: this.context || LoggerService.name });
  }
}
