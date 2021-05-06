import { HttpAuthResultInterface } from './interfaces/auth-result.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class HttpAuthService {
  constructor(private readonly config: ConfigService) { }

  get settings(): ReturnType<typeof ConfigService.prototype.getHttpAuth> {
    return this.config.getHttpAuth();
  }

  validate(token: string): ReturnType<typeof HttpAuthService.prototype.validateBearer> {
    if (token.match('bearer')) {
      return this.validateBearer(token);
    }

    return { authorized: false };
  }

  validateBearer(token: string): HttpAuthResultInterface {
    const config = this.settings;

    if (!config || !config.bearer || !config.bearer.token) {
      return { authorized: false };
    }

    const bearer = token.split('bearer').pop().trim();
    return { authorized: config.bearer.token === bearer };
  }
}
