import { ConfigService } from './../common/modules/config/config.service';
import { SessionGuard } from './session.guard';
import { CommonExceptionFilter } from './../common/filters/common-exception.filter';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  ForbiddenException,
  Param,
  Post,
  Res,
  UseFilters,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddSessionPayload, AddSessionResponse201 } from './api/add-session.api';
import { GetSessionParams, GetSessionResponse200 } from './api/get-session.api';
import { SessionService } from './session.service';
import { SESSION_COOKIE } from '../constants';
import { SessionDecorator as Session } from './session.decorator';
import { SessionDocumentType } from './models/session.model';

@Controller('api/sessions')
@ApiTags('session')
@UsePipes(new ValidationPipe({ whitelist: true }))
@UseFilters(CommonExceptionFilter)
export class SessionController {
  constructor(
    private readonly config: ConfigService,
    private readonly session: SessionService,
  ) { }

  @Get('/:id')
  @ApiOperation({ description: 'Get session by id' })
  @ApiResponse({ status: 200, type: GetSessionResponse200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 500 })
  async get(@Res() res: Response, @Param() params: GetSessionParams) {
    const session = await this.session.getSessionById(params.id);

    if (!session) {
      throw new NotFoundException();
    }

    return res.status(200).json(session.compact());
  }

  @Post()
  @ApiOperation({ description: 'Add session' })
  @ApiResponse({
    status: 201, type: AddSessionResponse201,
    headers: { 'Set-Cookie': { description: `${SESSION_COOKIE}=000000000000000000000001` } }
  })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 429 })
  @ApiResponse({ status: 500 })
  async add(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: AddSessionPayload,
  ) {
    const session = await this.session.authenticate(body, { ip: (req as any).ip });

    if (!session) {
      throw new BadRequestException('Invalid credentials given');
    }

    return res.status(201)
      .cookie(SESSION_COOKIE, session._id, this.config.getCookie().options)
      .json(session.compact());
  }

  @Delete('/:id')
  @UseGuards(SessionGuard)
  @ApiOperation({ description: 'Delete session by id' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 500 })
  async delete(
    @Res() res: Response,
    @Param() params: GetSessionParams,
    @Session() session: SessionDocumentType
  ) {
    if (!session.is(params.id)) {
      throw new ForbiddenException();
    }
    const deleted = await this.session.deleteSessionById(params.id);

    return res.status(204)
      .cookie(SESSION_COOKIE, session._id, { expires: new Date(0) })
      .send();
  }
}
