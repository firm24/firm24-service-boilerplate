import { CommonExceptionFilter } from './../common/filters/common-exception.filter';
import { Controller, Get, Req, Res, UsePipes, ValidationPipe, UseFilters, Header } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { HealthService } from './health.service';

@Controller('api/health')
@ApiTags('health')
@UsePipes(ValidationPipe)
@UseFilters(CommonExceptionFilter)
export class HealthController {
  constructor(
    private readonly health: HealthService,
  ) { }

  @Get()
  @Header('content-type', 'text/html')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 500, description: 'not healthy' })
  async check(@Req() req: Request, @Res() res: Response): Promise<Response> {
    if (!await this.health.isHealthy()) {
      return res.status(500).send('not healthy');
    }

    return res.status(200).send();
  }
}
