import { SessionRequestInfoType } from './types/request-info.type';
import { CaptchaService } from './../common/modules/captcha/captcha.service';
import { UserService } from './../user/user.service';
import { AddSessionPayload } from './api/add-session.api';
import { LoggerService } from './../common/modules/logger/logger.service';
import { ConfigService } from './../common/modules/config/config.service';
import { UserDocumentType } from './../user/models/user.model';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionRepositoryService } from './session-repository.service';
import { SessionDocumentType } from './models/session.model';

@Injectable()
export class SessionService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly sessionRepository: SessionRepositoryService,
    private readonly user: UserService,
    private readonly captcha: CaptchaService,
  ) {
    this.logger = this.logger.build(SessionRepositoryService.name);
  }

  async getSessionById(id: string): Promise<SessionDocumentType | null> {
    return await this.sessionRepository.find({ _id: id });
  }

  async getSessionByUser(user: string): Promise<SessionDocumentType | null> {
    return await this.sessionRepository.find({ user });
  }

  async addSession(data: UserDocumentType): Promise<SessionDocumentType> {
    const session = await this.sessionRepository.new({ user: data });

    return await this.sessionRepository.save(session);
  }

  async updateSession(session: SessionDocumentType, data: Partial<SessionDocumentType>): Promise<SessionDocumentType> {
    session.setValues({ ...data });
    return await this.sessionRepository.save(session);
  }

  async getSessionByIdAndAttachOrganization(
    id: string,
  ): Promise<SessionDocumentType | undefined> {
    const session = await this.getSessionById(id);

    if (!session) {
      return undefined;
    }

    return session;
  }

  async deleteSessionById(id: string): Promise<boolean> {
    return await this.sessionRepository.delete({ _id: id });
  }

  async getOrAddSession(user: UserDocumentType): Promise<SessionDocumentType> {
    const exists = await this.getSessionByUser(user._id);
    const session = exists || await this.addSession(user);

    return session;
  }

  async authenticate(body: AddSessionPayload, info?: SessionRequestInfoType): Promise<SessionDocumentType | undefined> {
    const user = await this.validateCredentials(body);

    if (!user) {
      return;
    }

    return this.createSessionAndClearUser(user, info);
  }

  async validateCredentials(
    body: AddSessionPayload,
    options?: { captcha?: boolean, silent?: boolean },
  ): Promise<UserDocumentType | undefined> {
    const user = await this.user.getUserByEmail(body.email);
    if (!user) {
      return;
    }
    const tooManyAttempts = user.attemptLogin();
    const captchaResponse = tooManyAttempts && await this.captcha.validate(body.captcha_response);
    await this.user.saveUser(user);
    const captchaEnabled = options?.captcha !== false && this.captcha.isEnabled();

    if (captchaEnabled && !captchaResponse.success && tooManyAttempts) {
      if (options?.silent === true) {
        return;
      }

      throw new HttpException('Too many failed attempts', 429);
    }

    if (!user || !await this.user.verifyPassword(user, body.password)) {
      if (options?.silent === true) {
        return;
      }

      throw new UnauthorizedException();
    }

    return user;
  }

  async createSessionAndClearUser(user: UserDocumentType, info?: SessionRequestInfoType) {
    user.clearLoginAttempts();
    await this.user.saveUser(user);

    const session = await this.getOrAddSession(user);

    if (info) {
      await this.updateSession(session, info);
    }

    return session;
  }
}
