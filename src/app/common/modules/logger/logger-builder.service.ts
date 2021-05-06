import { pascalCase } from 'pascal-case';
import { LoggerColorUtils } from './utils/colors.utils';
import { WINSTON } from './../../constants';
import { Injectable, Inject, Optional } from '@nestjs/common';
import winston from 'winston';
import util from 'util';
import { ConfigService } from '../config/config.service';
import RollbarTransport from 'winston-transport-rollbar-3';
import Flatted from 'flatted';

@Injectable()
export class LoggerBuilderService {
  constructor(
    private readonly config: ConfigService,
    @Inject(WINSTON) private readonly _winston: typeof winston,
    @Optional() private logger?: winston.Logger,
  ) {
    this.logger = this.createLogger();
  }

  getLogger() {
    return this.logger;
  }

  createLogger(): winston.Logger {
    const formats = [
      this._winston.format.label({ label: pascalCase(this.config.getApp().shorthand) }),
      this._winston.format.timestamp({ format: 'DD/MM/YY hh:mm:ss' }),
      this._winston.format.printf((info) => {
        const msg = [
          [
            LoggerColorUtils.clc.cyanBright(`[${info.label}] `),
            `<${info.timestamp}>\t`,
            `${info.level}\t`,
            info.context ? LoggerColorUtils.clc.yellow(`[${info.context}] `) : '',
            `${info.message}`,
          ].join('')
        ];

        for (const key in info) {
          if (['timestamp', 'message', 'level', 'label', 'context'].indexOf(key) > -1) {
            continue;
          }

          const value = util.isString(info[key]) ? info[key] : Flatted.stringify(info[key], null, 2);
          msg.push(`\n${key}:\n${value}\n`);
        }

        return msg.join('\n');
      }),
    ];

    const transports = [
      new this._winston.transports.Console({
        level: (this.config.getLoggerConsole()).level,
        format: this._winston.format.combine(
          this._winston.format(info => {
            info.level = `<${info.level}>`;
            return info;
          })(),
          ...[this._winston.format.colorize()],
          ...formats,
        ),
        handleExceptions: true,
      })
    ];

    const rollbar = this.config.getRollbar();
    if (rollbar.access_token) {
      transports.push(new RollbarTransport({
        rollbarConfig: {
          accessToken: rollbar.access_token,
          environment: rollbar.environment || this.config.getEnv(),
          reportLevel: rollbar.level || 'warn',
          captureUncaught: true,
          captureUnhandledRejections: true,
        },
        level: rollbar.level || 'warn',
      }));
    }

    return this._winston.createLogger({
      transports,
    });
  }
}
