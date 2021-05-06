import { SessionContextInterface } from './../session/interfaces/context.interface';
import { CaptchaService } from './../common/modules/captcha/captcha.service';
import { AddUserPayload, AddUserResponse201 } from './api/add-user.api';
import { GetUserParams, GetUserResponse200 } from './api/get-user.api';
import { CommonExceptionFilter } from './../common/filters/common-exception.filter';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionGuard } from '../session/session.guard';
import { UserDecorator as User } from './user.decorator';
import { SessionDecorator as Session } from '../session/session.decorator';
import { UserDocumentType } from './models/user.model';

@Controller('api/users')
@ApiTags('user')
@UsePipes(new ValidationPipe({ whitelist: true }))
@UseFilters(CommonExceptionFilter)
export class UserController {
  constructor(
    private readonly user: UserService,
    private readonly captcha: CaptchaService,
  ) { }

  @Get('/:id')
  @UseGuards(SessionGuard)
  @ApiOperation({ description: 'Get user by id or email' })
  @ApiResponse({ status: 200, type: GetUserResponse200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 500 })
  async get(
    @Res() res: Response,
    @Param() params: GetUserParams,
    @Session() session: SessionContextInterface
  ) {
    const user = await this.user.getUserByIdOrEmail(params.id);
    if (!(session.user as UserDocumentType).is(user)) {
      throw new ForbiddenException();
    }

    if (!user) {
      throw new NotFoundException();
    }

    return res.status(200).json(user);
  }

  @Post()
  @ApiOperation({ description: 'Add user' })
  @ApiResponse({ status: 201, type: AddUserResponse201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 500 })
  async add(
    @Res() res: Response,
    @Body() body: AddUserPayload,
    @User() sessionUser: UserDocumentType
  ) {
    if (!sessionUser) {
      const catpchaResponse = await this.captcha.validate(body.captcha_response);
      if (this.captcha.isEnabled() && !catpchaResponse.success) {
        throw new BadRequestException('Invalid captcha given');
      }
    }

    const exists = await this.user.getUserByIdOrEmail(body.email);

    if (exists) {
      throw new ConflictException();
    }

    const user = await this.user.addUser(body as any);

    return res.status(201).json(user);
  }
}
