import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from './common/modules/config/config.service';
import { LoggerService } from './common/modules/logger/logger.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
  ) { }

  @Get()
  @ApiExcludeEndpoint()
  async root(@Res() res: Response): Promise<void> {
    return res.redirect('/api');
  }

  @Get('api')
  @ApiExcludeEndpoint()
  async api(@Res() res: Response): Promise<void> {
    return res.redirect('/api-docs');
  }
}
