import { Locale } from 'locale-enum';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from './session.service';
import { SESSION_COOKIE } from '../constants';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly session: SessionService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.header('x-session') || (req.cookies && req.cookies[SESSION_COOKIE]);
    const session = sessionId && await this.session.getSessionByIdAndAttachOrganization(sessionId);
    const ip = (req as any).ip;

    if (session && session.ip !== ip) {
      await this.session.updateSession(session, { ip });
    }

    (req as any).locale = (session?.user as any)?.locale || req.header?.('x-locale') || Locale.en_GB;

    if (session) {
      (req as any).session = session;
      (req as any).user = session.user;
    }

    next();
  }
}
